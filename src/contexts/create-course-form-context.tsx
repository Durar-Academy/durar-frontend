"use client";

import { useRouter } from "next/navigation";
import { createContext, useState } from "react";
import toast from "react-hot-toast";

import { defaultCreateFormValues } from "@/data/constants";
import { axiosInstance } from "@/lib/axios";
import { uploadFile } from "@/lib/storage";

export const CreateCourseFormContext = createContext<CreateCourseFormContextProps | null>(null);

export function CreateCourseFormProvider({ children }: { children: React.ReactNode }) {
  const totalFormSteps = 3;

  const router = useRouter();
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [formData, setFormData] = useState<CreateCourse>(defaultCreateFormValues);
  const [isSubmitting, setIsSubmiting] = useState(false);

  const updateFormData = (newData: Partial<CreateCourse>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
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

  const publishCourse = async () => {
    setIsSubmiting(true);

    try {
      // upload thumbnail
      let thumbnailResponse;
      if (formData.thumbnailId) {
        thumbnailResponse = await uploadFile(formData.thumbnailId.file);
      }

      // upload lessons video in parallel
      const lessons = await Promise.all(
        formData.Lesson.map(async (lesson) => {
          let lessonVideoResponse;
          if (lesson.video) {
            lessonVideoResponse = await uploadFile(lesson.video.file);
          }

          return {
            title: lesson.name,
            duration: Number(lesson.video?.preview),
            isLocked: lesson.isLocked,
            type: lesson.type,
            storageId: lessonVideoResponse.storageId,
          };
        }),
      );

      // construct course payload
      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        storageId: thumbnailResponse.storageId,

        lessons,
        language: formData.language,
        difficultyLevel: formData.difficultyLevel,
        enableCertification: formData.enableCertification,
        trackProgress: formData.trackProgress,
        enableComments: formData.enableComments,
        additionalNotes: formData.additionalNotes,
        status: formData.status,
      };

      console.log("Payload", payload);

      await axiosInstance.post("/course", payload);

      // const createCourseResponse = await axiosInstance.post("/course", payload);
      // console.log("CREATE COURSE RESPONSE", createCourseResponse);

      toast.success("Course Created Successfully!");

      // reset form
      setFormData(defaultCreateFormValues);
      setCurrentFormStep(1);
      router.refresh();
    } catch (error) {
      console.error("CREATE COURSE ERROR:", error);

      toast.error("Unable to create course. Please try again later.");
    } finally {
      setIsSubmiting(false);
    }
  };

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

        isSubmitting,
      }}
    >
      {children}
    </CreateCourseFormContext.Provider>
  );
}
