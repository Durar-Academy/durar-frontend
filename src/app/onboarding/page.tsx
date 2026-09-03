"use client";
import AccountSetup from "@/components/onboarding/AccountSetup";
import AddressLocation from "@/components/onboarding/AddressLocation";
import { OnboardingSidebar } from "@/components/onboarding/OnboardingSidebar";
import PersonalInformation from "@/components/onboarding/PersonalInformation";
import ProfessionalDetails from "@/components/onboarding/ProfessionalDetails";
import { onboardingSidebarData } from "@/data2/constants";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import { updateTutorOnboarding } from "@/lib/auth";

// Explicitly define FormData type
type FormData = {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  phone: string;
  specializationAndSkill: string;
  language: string;
  documents: string[];
  address: string;
  city: string;
  state: string;
  country: string;
  paymentMode: string;
  bankAccountDetails: string;
  agreedToTerms: boolean;
};
 
const Page = () => {
  
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state to collect information across all steps
  const [formData, setFormData] = useState<FormData>({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    phone: "",
    specializationAndSkill: "",
    language: "",
    documents: [],
    address: "",
    city: "",
    state: "",
    country: "",
    paymentMode: "",
    bankAccountDetails: "",
    agreedToTerms: false,
  });

  // Update form data from any step
  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleClick = (index: number) => {
    // Only allow clicking on completed steps or the next immediate step
    if (index <= progress + 1) {
      setProgress(index);
    }
  };

  const handlePrev = () => {
    setProgress(progress - 1);
  };

  const handleNext = () => {
    setProgress(progress + 1);
  };

  // Submit the form data to the API
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Do final validation before submission
      const requiredFields = [
        "firstName",
        "lastName",
        "gender",
        "phone",
        "dob",
        "specializationAndSkill",
        "language",
        "address",
        "city",
        "state",
        "country",
        "paymentMode",
        "bankAccountDetails",
      ];

      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof typeof formData]
      );

      if (missingFields.length > 0) {
        toast.error(
          `Please fill all required fields: ${missingFields.join(", ")}`
        );
        setIsSubmitting(false);
        return;
      }

      // Check documents
      if (!formData.documents.length) {
        toast.error("Please upload at least one document");
        setIsSubmitting(false);
        return;
      }

      // Prepare the data according to the API structure
      const submitData = {
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || undefined,
        phone: formData.phone,
        gender: (formData.gender === "female" ? "female" : "male") as "male" | "female",
        country: formData.country,
        dob: formData.dob,
        specializationAndSkill: formData.specializationAndSkill,
        language: formData.language,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        paymentMode: formData.paymentMode as "BankTransfer" | "PayPal" | "Crypto",
        bankAccountDetails: formData.bankAccountDetails,
        documents: formData.documents, // This contains the mediaId strings
      };

      console.log("[Onboarding] Submitting payload:", submitData);

      const response = await updateTutorOnboarding(submitData);
      console.log("[Onboarding] Response received:", response);

      if (response.success) {
        console.log("[Onboarding] Success — redirecting to /tutor");
        toast.success("Onboarding completed successfully!");
        // Clear any saved onboarding draft and navigate to tutor dashboard.
        // We avoid calling react-query hooks here to prevent SSR build errors
        // when a QueryClientProvider is not available during prerender.
        try {
          localStorage.removeItem("tutor-onboarding-data");
        } catch {
          /* ignore storage errors */
        }
        // Force a full reload to ensure fresh data is fetched after onboarding.
        window.location.href = "/tutor";
      } else {
        console.warn("[Onboarding] Backend returned success=false:", response.message);
        toast.error(response.message || "Something went wrong");
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || "An error occurred during onboarding";

      console.error("[Onboarding] Error:", {
        message: axiosError?.message,
        responseData: axiosError?.response?.data,
      });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Attempt to load any in-progress form data from storage
  useEffect(() => {
    const savedData = localStorage.getItem("tutor-onboarding-data");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData((prev) => ({ ...prev, ...parsedData }));
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, []);

  // Save form data to local storage when it changes
  useEffect(() => {
    localStorage.setItem("tutor-onboarding-data", JSON.stringify(formData));
  }, [formData]);

  const handleCancel = () => {
    setFormData({
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      phone: "",
      specializationAndSkill: "",
      language: "",
      documents: [],
      address: "",
      city: "",
      state: "",
      country: "",
      paymentMode: "",
      bankAccountDetails: "",
      agreedToTerms: false,
    });
    toast.success("All data cancelled successfully!, You can start afresh");
    setProgress(0);
  };

  return (
    <section className="w-full h-screen overflow-hidden flex bg-offwhite">
      <OnboardingSidebar handleClick={handleClick} progress={progress} />
      <section className="p-6 py-12 min-h-screen w-full overflow-y-auto flex flex-col gap-4 items-center">
        <header className="flex items-baseline justify-center gap-5">
          {onboardingSidebarData.map((eachData, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className={`${
                  i == progress
                    ? "bg-orange text-white"
                    : i < progress
                    ? "bg-success text-white"
                    : "bg-white text-low"
                } h-4 w-4 rounded-full text-xs flex justify-center items-center`}
              >
                {i + 1}
              </span>
              <span
                className={`${
                  i == progress
                    ? "text-orange"
                    : i < progress
                    ? "text-success"
                    : "text-low"
                } text-low text-base `}
              >
                {eachData.txt}
              </span>
              <span
                className={`${i === 3 ? "hidden" : ""} text-low text-xl ml-2`}
              >
                .
              </span>
            </div>
          ))}
        </header>
        <main className="w-[873px]">
          {progress === 0 ? (
            <PersonalInformation
              handleNext={handleNext}
              formData={formData}
              updateFormData={updateFormData}
              handleCancel={handleCancel}
            />
          ) : progress === 1 ? (
            <ProfessionalDetails
              handleNext={handleNext}
              handlePrev={handlePrev}
              formData={formData}
              updateFormData={updateFormData}
              handleCancel={handleCancel}
            />
          ) : progress === 2 ? (
            <AddressLocation
              handleNext={handleNext}
              handlePrev={handlePrev}
              formData={formData}
              updateFormData={updateFormData}
              handleCancel={handleCancel}
            />
          ) : (
            <AccountSetup
              handlePrev={handlePrev}
              formData={formData}
              updateFormData={updateFormData}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              handleCancel={handleCancel}
            />
          )}
        </main>
      </section>
    </section>
  );
};

export default Page;
