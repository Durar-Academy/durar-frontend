"use client";

import { createContext, useState } from "react";
import { useRouter } from "next/navigation";

import { defaultCreateFormValues } from "@/data/constants";

export const CreateCourseFormContext = createContext<CreateCourseFormContextProps | null>(null);

export function CreateCourseFormProvider({ children }: { children: React.ReactNode }) {
  const totalFormSteps = 3;

  const router = useRouter();
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [formData, setFormData] = useState<CreateCourse>(defaultCreateFormValues);

  const updateFormData = (newData: Partial<CreateCourse>) => {
    setFormData((prevData) => ({ ...prevData, newData }));
  };

  const nextStep = () => {
    if (currentFormStep < totalFormSteps) setCurrentFormStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    if (currentFormStep > 1) setCurrentFormStep((prevStep) => prevStep - 1);
  };

  const cancelForm = () => {
    setFormData(defaultCreateFormValues);
    setCurrentFormStep(1);
    router.back();
  };

  const publishCourse = () => {};

  const saveAsDraft = () => {};

  return (
    <CreateCourseFormContext.Provider
      value={{
        formData,

        updateFormData,
        cancelForm,

        currentFormStep,
        totalFormSteps,

        prevStep,
        nextStep,

        saveAsDraft,
        publishCourse,
      }}
    >
      {children}
    </CreateCourseFormContext.Provider>
  );
}
