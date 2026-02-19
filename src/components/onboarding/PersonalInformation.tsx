import { X, ChevronRight } from "lucide-react";
import React, { useState } from "react";

interface FormData {
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
}

interface PersonalInformationProps {
  handleNext: () => void;
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  handleCancel: () => void;
}

const PersonalInformation = ({
  handleNext,
  formData,
  updateFormData,
  handleCancel,
}: PersonalInformationProps) => {
  // State for form validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  // Handle radio changes
  const handleRadioChange = (gender: string) => {
    updateFormData({ gender });
  };

  // Basic validation before proceeding to next step
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Proceed to next step
  const proceedToNext = () => {
    if (validateForm()) {
      handleNext();
    }
  };

  return (
    <section className="rounded-xl p-4 bg-white border border-shade-2">
      <div className="text-sm text-low grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-2">
          <label htmlFor="title">Title</label>
          <select
            className={`pl-2 h-12 rounded-lg ${
              errors.title ? "border-red-500" : "border-shade-3"
            } border outline-orange`}
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
          <label htmlFor="firstName">First Name</label>
          <input
            placeholder="Enter first name..."
            className={`pl-2 h-12 rounded-lg ${
              errors.firstName ? "border-red-500" : "border-shade-3"
            } border outline-orange`}
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
          <label htmlFor="middleName">Middle Name</label>
          <input
            placeholder="Enter middle name..."
            className="pl-2 h-12 rounded-lg border-shade-3 border outline-orange"
            type="text"
            name="middleName"
            id="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="lastName">Last Name</label>
          <input
            placeholder="Enter last name..."
            className={`pl-2 h-12 rounded-lg ${
              errors.lastName ? "border-red-500" : "border-shade-3"
            } border outline-orange`}
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
          <label htmlFor="dob">Date of Birth</label>
          <input
            placeholder="Enter date of birth..."
            className={`pl-2 h-12 rounded-lg ${
              errors.dob ? "border-red-500" : "border-shade-3"
            } border outline-orange`}
            type="date"
            name="dob"
            id="dob"
            value={formData.dob}
            onChange={handleChange}
          />
          {errors.dob && (
            <span className="text-xs text-red-500">{errors.dob}</span>
          )}
        </div>



        <div className="flex flex-col gap-2">
          <label htmlFor="phone">Phone Number</label>
          <input
            placeholder="Enter phone number..."
            className={`pl-2 h-12 rounded-lg ${
              errors.phone ? "border-red-500" : "border-shade-3"
            } border outline-orange`}
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
          <label htmlFor="gender">Gender</label>
          <div
            className={`pl-2 h-12 rounded-lg ${
              errors.gender ? "border-red-500" : "border-shade-3"
            } border flex gap-2 items-center`}
          >
            <input
              className="border border-shade-3 h-6 w-6 cursor-pointer accent-orange focus:ring-orange focus:ring-1 outline-none"
              name="gender"
              type="radio"
              id="male"
              checked={formData.gender === "male"}
              onChange={() => handleRadioChange("male")}
            />
            <label htmlFor="male">Male</label>
          </div>
        </div>

        <div className="h-full flex items-end w-full">
          <div
            className={`pl-2 h-12 rounded-lg ${
              errors.gender ? "border-red-500" : "border-shade-3"
            } border flex gap-2 items-center w-full`}
          >
            <input
              className="border border-shade-3 h-6 w-6 cursor-pointer accent-orange focus:ring-orange focus:ring-1 outline-none"
              name="gender"
              type="radio"
              id="female"
              checked={formData.gender === "female"}
              onChange={() => handleRadioChange("female")}
            />
            <label htmlFor="female">Female</label>
          </div>
        </div>
        {errors.gender && (
          <span className="text-xs text-red-500">{errors.gender}</span>
        )}
      </div>

      <div className="flex justify-end items-center gap-2 mt-4">
        <button
          onClick={handleCancel}
          className="text-danger text-sm flex items-center border border-shade-3 rounded-xl p-3.5 py-2"
        >
          <X />
          Cancel
        </button>
        <button
          onClick={proceedToNext}
          className="text-white bg-orange text-sm flex items-center rounded-xl p-3.5 py-2"
        >
          Next
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};

export default PersonalInformation;
