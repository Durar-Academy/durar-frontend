"use client";

import React, { createContext, useState } from "react";
import { useRouter } from "next/navigation";

import { axiosInstance } from "@/lib/axios";
import { createQuizDefaultValues } from "@/data/constants";
import toast from "react-hot-toast";

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
    if (!formData.courseId) {
      toast.error("Select a course before publishing the quiz.");
      return;
    }

    if (!formData.dueAt) {
      toast.error("Select a due date before publishing the quiz.");
      return;
    }

    const unansweredQuestion = formData.questions.findIndex(
      (question) =>
        !question.options.some(
          (option) => option.id === question.correctAnswerId && option.optionText.trim(),
        ),
    );

    if (unansweredQuestion !== -1) {
      toast.error(`Select the correct option for question ${unansweredQuestion + 1}.`);
      return;
    }

    setIsSubmiting(true);

    try {
      const assignmentPayload = {
        title: formData.title,
        courseId: formData.courseId,
        type: "quiz",
        totalScore: formData.totalScore,
        dueAt: formData.dueAt
          ? formData.dueAt instanceof Date
            ? formData.dueAt.toISOString().split("T")[0]
            : formData.dueAt
          : null,
        description: formData.description,
        allowLate: formData.allowLate,
        randomnize: formData.randomnize,
        duration: formData.duration * 60 * 1_000,
        autoGraded: formData.autoGraded,
      };
      console.log("ASSIGNMENT PAYLOAD", assignmentPayload);

      // create assignment first
      const createAssignmentResponse = await axiosInstance.post("/assignment", assignmentPayload);
      console.log("CREATE ASSIGNMENT RESPONSE", createAssignmentResponse);

      // form the questions payload
      const questionsPayload = formData.questions.map((question) => {
        return {
          body: question.questionText,
          type: "single_choice",
          assignmentId: createAssignmentResponse.data.data.id,
          options: question.options.map((option) => option.optionText),
          answer: {
            singleChoiceAnswer:
              question.options.find((option) => option.id === question.correctAnswerId)
                ?.optionText ?? "",
          },
        };
      });
      console.log("QUESTIONS PAYLOAD", questionsPayload);

      const createQuestionsResponse = await axiosInstance.post("/question", {
        questions: questionsPayload,
      });
      console.log("CREATE QUIZ RESPONSE", createQuestionsResponse);

      toast.success("Quiz Created Successfully!");

      // reset form
      cancelForm();
    } catch (error) {
      console.log("CREATE QUIZ ERROR:", error);
      toast.error("Something went Wrong. Please try again!");
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
