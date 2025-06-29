import { X, ChevronRight, ArrowLeft, Loader } from "lucide-react";
import React, { useState } from "react";
import TermsAndConditionModal from "./TermsAndConditionModal";

interface FormData {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  email: string;
  gender: string;
  phone: string;
  specializationAndSkill: string;
  language: string;
  documents: string[];
  address: string;
  city: string;
  state: string;
  country: string;
  password: string;
  paymentMode: string;
  bankAccountDetails: string;
  agreedToTerms: boolean;
}

interface AccountSetupProps {
  handlePrev: () => void;
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  handleCancel: () => void;
}

const AccountSetup = ({
  handlePrev,
  formData,
  updateFormData,
  handleSubmit,
  isSubmitting,
  handleCancel,
}: AccountSetupProps) => {
  const [modal, setModal] = useState(false);
  // State for form validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleModal = () => {
    setModal(!modal);
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ agreedToTerms: e.target.checked });
  };

  // Basic validation before submission
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.paymentMode)
      newErrors.paymentMode = "Payment mode is required";
    if (!formData.bankAccountDetails)
      newErrors.bankAccountDetails = "Bank account details are required";
    if (!formData.agreedToTerms)
      newErrors.agreedToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit the form
  const onSubmit = () => {
    if (validateForm()) {
      handleSubmit();
    }
  };

  return (
    <section className="rounded-xl p-4 bg-white border border-shade-2">
      <TermsAndConditionModal handleModal={handleModal} modal={modal} />

      <div className="text-sm text-low grid grid-cols-2 gap-4 w-full">
        <h2 className="text-sm font-medium text-high col-span-2">
          Account Setup
        </h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            placeholder="Enter email..."
            className="pl-2 h-12 rounded-lg border-shade-3 border outline-orange bg-gray-100"
            type="email"
            name="email"
            id="email"
            value={formData.email}
            disabled
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            placeholder="Enter password..."
            className={`pl-2 h-12 rounded-lg ${
              errors.password ? "border-red-500" : "border-shade-3"
            } border outline-orange`}
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="text-xs text-red-500">{errors.password}</span>
          )}
        </div>

        <h2 className="text-sm font-medium text-high col-span-2">
          Payment Details
        </h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="paymentMode">Payment Mode</label>
          <select
            className={`pl-2 h-12 rounded-lg ${
              errors.paymentMode ? "border-red-500" : "border-shade-3"
            } border outline-orange`}
            name="paymentMode"
            id="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
          >
            <option value="">Select Payment Mode</option>
            <option value="BankTransfer">Bank Transfer</option>
            <option value="Crypto">Crypto</option>
            <option value="PayPal">PayPal</option>
          </select>
          {errors.paymentMode && (
            <span className="text-xs text-red-500">{errors.paymentMode}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="bankAccountDetails">Bank Account Details</label>
          <input
            placeholder="Exp: Lawal Wahab Babatunde: FCMB: 4661775012"
            className={`pl-2 h-12 rounded-lg ${
              errors.bankAccountDetails ? "border-red-500" : "border-shade-3"
            } border outline-orange`}
            type="text"
            name="bankAccountDetails"
            id="bankAccountDetails"
            value={formData.bankAccountDetails}
            onChange={handleChange}
          />
          {errors.bankAccountDetails && (
            <span className="text-xs text-red-500">
              {errors.bankAccountDetails}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-high my-[29px]">
        <input
          type="checkbox"
          name="agreedToTerms"
          id="agreedToTerms"
          checked={formData.agreedToTerms}
          onChange={handleCheckboxChange}
          className="accent-orange"
        />
        <span>By clicking this you agree with the terms & Conditions</span>
        <button
          onClick={handleModal}
          className="text-orange font-medium hover:underline"
        >
          View
        </button>
      </div>
      {errors.agreedToTerms && (
        <span className="text-xs text-red-500">{errors.agreedToTerms}</span>
      )}

      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={handleCancel}
          className="text-danger text-sm flex items-center border border-shade-3 rounded-xl p-3.5 py-2"
        >
          <X />
          Cancel
        </button>
        <span className="flex-1"></span>
        <button
          onClick={handlePrev}
          className="border border-orange text-orange text-sm flex items-center gap-1 rounded-xl p-3.5 py-2"
        >
          <ArrowLeft />
          Previous
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="text-white bg-orange text-sm flex items-center gap-1 rounded-xl p-3.5 py-2"
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin" size={16} />
              Submitting...
            </>
          ) : (
            "Save"
          )}
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};

export default AccountSetup;
