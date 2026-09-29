"use client";

import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useState } from "react";
import toast from "react-hot-toast";

import { defaultCreateFormValues } from "@/data/constants";
import { createCourse, updateCourse } from "@/lib/admin";
import { uploadFile } from "@/lib/storage";

export const CreateCourseFormContext = createContext<CreateCourseFormContextProps | null>(null);

export function CreateCourseFormProvider({ 
  children,
  initialData,
  courseId 
}: { 
  children: React.ReactNode;
  initialData?: CreateCourse;
  courseId?: string;
}) {
  const totalFormSteps = 3;

  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [formData, setFormData] = useState<CreateCourse>(initialData || defaultCreateFormValues as CreateCourse);
  const [isSubmitting, setIsSubmiting] = useState(false);
  const [submissionMode, setSubmissionMode] = useState<CourseStatus | null>(null);

  const updateFormData = (newData: Partial<CreateCourse>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const normalizePrerequisites = (value: string[]) =>
    value
      .map((item) => item.trim())
      .filter(Boolean)
      .filter((item, index, items) => items.indexOf(item) === index);

  const buildCoursePayload = async (status: CourseStatus): Promise<UpdateCoursePayload> => {
    const title = formData.title.trim();
    const description = formData.description.trim();
    const additionalNotes = formData.additionalNotes.trim();
    const language = formData.language.trim();
    const category = formData.category.trim();
    const difficultyLevel = formData.difficultyLevel.trim();
    const prerequisites = normalizePrerequisites(formData.prerequisites);

    if (!title) throw new Error("Course title is required.");

    if (status === "published") {
      if (!category) throw new Error("Course category is required.");
      if (!formData.Lesson.length) throw new Error("Add at least one lesson before publishing.");

      const invalidLesson = formData.Lesson.find(
        (lesson) => !lesson.name.trim() || (!lesson.video?.file && !lesson.video?.src),
      );
      if (invalidLesson) {
        throw new Error("Each lesson needs a title and a video before publishing.");
      }
    }

    let thumbnailStorageId: string | undefined;
    if (formData.thumbnailId?.file) {
      const thumbnailResponse = await uploadFile(formData.thumbnailId.file);
      thumbnailStorageId = thumbnailResponse.storageId;
    }

    const lessons = await Promise.all(
      formData.Lesson
        .filter((lesson) => lesson.name.trim() || lesson.video?.file || lesson.video?.src)
        .map(async (lesson) => {
          if (!lesson.name.trim()) {
            throw new Error("Each lesson with media must have a title.");
          }

          const lessonVideoResponse = lesson.video?.file ? await uploadFile(lesson.video.file) : null;

          return {
            ...(lesson.id ? { id: String(lesson.id) } : {}),
            title: lesson.name.trim(),
            duration: Number(lesson.video?.preview ?? 0),
            type: lesson.type,
            ...(lessonVideoResponse?.storageId
              ? { storageId: lessonVideoResponse.storageId }
              : lesson.video?.src ? {} : {}), // If it already has src but no file, we keep it as is, or pass storageId if needed. Wait, backend UpdateCoursePayload accepts id for existing lessons.
          };
        }),
    );

    return {
      title,
      ...(description ? { description } : {}),
      ...(thumbnailStorageId ? { storageId: thumbnailStorageId } : {}),
      status,
      ...(language ? { language } : {}),
      ...(category ? { category } : {}),
      ...(difficultyLevel ? { difficultyLevel } : {}),
      enableCertification: formData.enableCertification,
      trackProgress: formData.trackProgress,
      enableComments: formData.enableComments,
      ...(additionalNotes ? { additionalNotes } : {}),
      prerequisites,
      lessons,
    } as UpdateCoursePayload;
  };

  const nextStep = () => {
    if (currentFormStep < totalFormSteps) setCurrentFormStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    if (currentFormStep > 1) setCurrentFormStep((prevStep) => prevStep - 1);
  };

  const resetForm = () => {
    setFormData(initialData || defaultCreateFormValues as CreateCourse);
    setCurrentFormStep(1);
  };

  const cancelForm = () => {
    resetForm();
    router.back();
  };

  const submitCourse = async (status: CourseStatus) => {
    setIsSubmiting(true);
    setSubmissionMode(status);

    try {
      const payload = await buildCoursePayload(status);
      if (courseId) {
        await updateCourse(courseId, payload);
      } else {
        await createCourse(payload as CreateCoursePayload);
      }
      
      await queryClient.invalidateQueries({ queryKey: ["all-courses"] });
      await queryClient.invalidateQueries({ queryKey: ["all-courses-metrics"] });
      if (courseId) {
        await queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      }

      toast.success(status === "draft" ? "Course saved as draft!" : `Course ${courseId ? "updated" : "created"} successfully!`);

      resetForm();
      router.push("/admin/courses");
    } catch (error) {
      console.error("CREATE COURSE ERROR:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Unable to create course. Please try again later.");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unable to create course. Please try again later.");
      }
    } finally {
      setIsSubmiting(false);
      setSubmissionMode(null);
    }
  };

  const saveAsDraft = async () => {
    await submitCourse("draft");
  };

  const publishCourse = async () => {
    await submitCourse("published");
  };

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
        submissionMode,
      }}
    >
      {children}
    </CreateCourseFormContext.Provider>
  );
}
