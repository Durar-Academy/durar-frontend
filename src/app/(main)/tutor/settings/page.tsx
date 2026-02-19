"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useCurrentUser } from "@/hooks/useAccount";
import { updateTutorOnboarding } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Top_Bar } from "@/components/tutor/top-bar";

export default function TutorSettingsPage() {
  const { data: user, isLoading } = useCurrentUser();
  const [formData, setFormData] = useState<TutorOnboardingPayload>({
    title: "",
    firstName: "",
    lastName: "",
    middleName: "",
    phone: "",
    gender: undefined,
    country: "",
    dob: "",
    specializationAndSkill: "",
    language: "",
    address: "",
    city: "",
    state: "",
    paymentMode: undefined,
    bankAccountDetails: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const tutorData: TutorData | null = (user as User & { tutor?: TutorData }).tutor || null;
      setFormData({
        title: user.title || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        middleName: user.middleName || "",
        phone: user.phone || "",
        gender: user.gender as "male" | "female" | undefined,
        country: user.country || "",
        dob: tutorData?.dob ? new Date(tutorData.dob).toISOString().split("T")[0] : "",
        specializationAndSkill: tutorData?.specializationAndSkill || "",
        language: tutorData?.language || "",
        address: tutorData?.address || "",
        city: tutorData?.city || "",
        state: tutorData?.state || "",
        paymentMode: tutorData?.paymentMode as "BankTransfer" | "PayPal" | "Crypto" | undefined,
        bankAccountDetails: tutorData?.bankAccountDetails || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRadioChange = (gender: "male" | "female") => {
    setFormData((prev) => ({ ...prev, gender }));
    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (formData.title && !formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (formData.firstName && !formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (formData.lastName && !formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (formData.phone && !formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (formData.country && !formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    try {
      // Only send fields that have values
      const payload: Partial<TutorOnboardingPayload> = {};
      (Object.keys(formData) as Array<keyof TutorOnboardingPayload>).forEach((key) => {
        const value = formData[key];
        if (value !== undefined && value !== "" && value !== null) {
          (payload as Record<string, unknown>)[key] = value as unknown;
        }
      });

      await updateTutorOnboarding(payload as TutorOnboardingPayload);
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : undefined;
      toast.error(errorMessage || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="flex flex-col gap-3">
        <Skeleton className="w-full rounded-xl h-[80px]" />
        <Skeleton className="w-full rounded-xl h-[600px]" />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <Top_Bar subtext="Settings" user={user as User}>
        <p className="flex items-center gap-1">Settings</p>
      </Top_Bar>

      <div className="rounded-xl p-6 border border-shade-2 bg-white">
        <h1 className="text-xl font-semibold text-high mb-6">Profile Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-high">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-sm text-low">
                  Title
                </label>
                <select
                  className={`pl-2 h-12 rounded-lg ${
                    errors.title ? "border-red-500" : "border-shade-3"
                  } border outline-orange focus:border-orange`}
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                >
                  <option value="">Select Title</option>
                  <option value="Mr.">Mr</option>
                  <option value="Mrs.">Mrs</option>
                  <option value="Ms.">Ms</option>
                  <option value="Dr.">Dr</option>
                </select>
                {errors.title && (
                  <span className="text-xs text-red-500">{errors.title}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm text-low">
                  First Name
                </label>
                <input
                  placeholder="Enter first name..."
                  className={`pl-2 h-12 rounded-lg ${
                    errors.firstName ? "border-red-500" : "border-shade-3"
                  } border outline-orange focus:border-orange`}
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <span className="text-xs text-red-500">{errors.firstName}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="middleName" className="text-sm text-low">
                  Middle Name
                </label>
                <input
                  placeholder="Enter middle name..."
                  className="pl-2 h-12 rounded-lg border-shade-3 border outline-orange focus:border-orange"
                  type="text"
                  name="middleName"
                  id="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-sm text-low">
                  Last Name
                </label>
                <input
                  placeholder="Enter last name..."
                  className={`pl-2 h-12 rounded-lg ${
                    errors.lastName ? "border-red-500" : "border-shade-3"
                  } border outline-orange focus:border-orange`}
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <span className="text-xs text-red-500">{errors.lastName}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm text-low">
                  Phone Number
                </label>
                <input
                  placeholder="Enter phone number..."
                  className={`pl-2 h-12 rounded-lg ${
                    errors.phone ? "border-red-500" : "border-shade-3"
                  } border outline-orange focus:border-orange`}
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <span className="text-xs text-red-500">{errors.phone}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="country" className="text-sm text-low">
                  Country
                </label>
                <input
                  placeholder="Enter country..."
                  className={`pl-2 h-12 rounded-lg ${
                    errors.country ? "border-red-500" : "border-shade-3"
                  } border outline-orange focus:border-orange`}
                  type="text"
                  name="country"
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                />
                {errors.country && (
                  <span className="text-xs text-red-500">{errors.country}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="dob" className="text-sm text-low">
                  Date of Birth
                </label>
                <input
                  className="pl-2 h-12 rounded-lg border-shade-3 border outline-orange focus:border-orange"
                  type="date"
                  name="dob"
                  id="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-low">Gender</label>
                <div className="flex gap-4 h-12 items-center">
                  <div className="flex items-center gap-2">
                    <input
                      className="border border-shade-3 h-5 w-5 cursor-pointer accent-orange focus:ring-orange focus:ring-1 outline-none"
                      type="radio"
                      id="male"
                      name="gender"
                      checked={formData.gender === "male"}
                      onChange={() => handleRadioChange("male")}
                    />
                    <label htmlFor="male" className="text-sm text-high">
                      Male
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      className="border border-shade-3 h-5 w-5 cursor-pointer accent-orange focus:ring-orange focus:ring-1 outline-none"
                      type="radio"
                      id="female"
                      name="gender"
                      checked={formData.gender === "female"}
                      onChange={() => handleRadioChange("female")}
                    />
                    <label htmlFor="female" className="text-sm text-high">
                      Female
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-high">Professional Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="specializationAndSkill" className="text-sm text-low">
                  Specialization & Skills
                </label>
                <input
                  placeholder="Enter specialization and skills..."
                  className="pl-2 h-12 rounded-lg border-shade-3 border outline-orange focus:border-orange"
                  type="text"
                  name="specializationAndSkill"
                  id="specializationAndSkill"
                  value={formData.specializationAndSkill}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="language" className="text-sm text-low">
                  Language
                </label>
                <input
                  placeholder="Enter language..."
                  className="pl-2 h-12 rounded-lg border-shade-3 border outline-orange focus:border-orange"
                  type="text"
                  name="language"
                  id="language"
                  value={formData.language}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Address & Location Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-high">Address & Location</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="address" className="text-sm text-low">
                  Address
                </label>
                <input
                  placeholder="Enter address..."
                  className="pl-2 h-12 rounded-lg border-shade-3 border outline-orange focus:border-orange"
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="city" className="text-sm text-low">
                  City
                </label>
                <input
                  placeholder="Enter city..."
                  className="pl-2 h-12 rounded-lg border-shade-3 border outline-orange focus:border-orange"
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="state" className="text-sm text-low">
                  State
                </label>
                <input
                  placeholder="Enter state..."
                  className="pl-2 h-12 rounded-lg border-shade-3 border outline-orange focus:border-orange"
                  type="text"
                  name="state"
                  id="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Payment Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-high">Payment Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="paymentMode" className="text-sm text-low">
                  Payment Mode
                </label>
                <select
                  className="pl-2 h-12 rounded-lg border-shade-3 border outline-orange focus:border-orange"
                  name="paymentMode"
                  id="paymentMode"
                  value={formData.paymentMode || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Payment Mode</option>
                  <option value="BankTransfer">Bank Transfer</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Crypto">Crypto</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="bankAccountDetails" className="text-sm text-low">
                  Bank Account Details
                </label>
                <input
                  placeholder="Enter bank account details..."
                  className="pl-2 h-12 rounded-lg border-shade-3 border outline-orange focus:border-orange"
                  type="text"
                  name="bankAccountDetails"
                  id="bankAccountDetails"
                  value={formData.bankAccountDetails}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

