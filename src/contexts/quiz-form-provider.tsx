"use client";

import React, { createContext, useState } from "react";
import { useRouter } from "next/navigation";

import { createQuizDefaultValues } from "@/data/constants";

export const CreateQuizFormContext = createContext<CreateQuizFormContextProps | null>(null);

export function QuizFormProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [formData, setFormData] = useState(createQuizDefaultValues);
  const [isSubmitting, setIsSubmiting] = useState(false);

  const updateFormData = (newData: Partial<CreateQuiz>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const nextStep = () => router.push("/admin/assignments/add-quiz/questions");
  const prevStep = () => router.push("/admin/assignments/add-quiz");

  const cancelForm = () => {
    setFormData(createQuizDefaultValues);
    router.push("/admin/assignments/");
  };

  const publishQuiz = async () => {
    setIsSubmiting(true);

    try {
    } catch (error) {
      console.log("CREATE QUIZ ERROR:", error);
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <CreateQuizFormContext.Provider
      value={{
        formData,

        updateFormData,
        cancelForm,

        prevStep,
        nextStep,

        publishQuiz,

        isSubmitting,
      }}
    >
      {children}
    </CreateQuizFormContext.Provider>
  );
}
