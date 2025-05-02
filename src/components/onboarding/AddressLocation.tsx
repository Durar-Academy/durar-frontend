import { COUNTRY_DATA } from "@/data/data";
import { X, ChevronRight, ArrowLeft } from "lucide-react";
import React, { useState } from "react";

interface AddressLocationProps {
  handleNext: () => void;
  handlePrev: () => void;
  formData: any;
  updateFormData: (data: any) => void;
  handleCancel: () => void;
}

const AddressLocation = ({
  handleNext,
  handlePrev,
  formData,
  updateFormData,
  handleCancel,
}: AddressLocationProps) => {
  // State for form validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  // Basic validation before proceeding to next step
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";

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
        <div className="flex flex-col col-span-2 gap-2">
          <label htmlFor="address">Address</label>
          <input
            placeholder="Enter your address..."
            className={`pl-2 h-12 rounded-lg ${
              errors.address ? "border-red-500" : "border-shade-3"
            } border outline-orange`}
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && (
            <span className="text-xs text-red-500">{errors.address}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="city">City</label>
          <input
            placeholder="Enter your city..."
            className={`pl-2 h-12 rounded-lg ${
              errors.city ? "border-red-500" : "border-shade-3"
            } border outline-orange`}
            type="text"
            name="city"
            id="city"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && (
            <span className="text-xs text-red-500">{errors.city}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="state">State</label>
          <input
            placeholder="Enter your state..."
            className={`pl-2 h-12 rounded-lg ${
              errors.state ? "border-red-500" : "border-shade-3"
            } border outline-orange`}
            type="text"
            name="state"
            id="state"
            value={formData.state}
            onChange={handleChange}
          />
          {errors.state && (
            <span className="text-xs text-red-500">{errors.state}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="country">Country</label>
          <select
            className={`pl-2 h-12 rounded-lg ${
              errors.country ? "border-red-500" : "border-shade-3"
            } border outline-orange`}
            name="country"
            id="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            {COUNTRY_DATA.map((country, i) => (
              <option key={i + " " + country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <span className="text-xs text-red-500">{errors.country}</span>
          )}
        </div>
      </div>

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

export default AddressLocation;
