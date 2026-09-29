"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { CreateCourseButtons } from "@/components/admin/course/create-course-buttons";
import { CreateCourseTabs } from "@/components/admin/course/create-course-tabs";
import { TopBar } from "@/components/shared/top-bar";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAccount";
import { useCreateCourseFormProvider } from "@/hooks/useForm";
import { useCourse } from "@/hooks/useAdmin";

import { CreateCourseStructure } from "@/components/admin/course/create-course-structure";
import { CreateCourseAdditionalInfoForm } from "@/components/admin/course/create-course-additional-form";
import { CreateCourseBasicInfoForm } from "@/components/admin/course/create-course-basic-info-form";
import { CreateCourseFormProvider } from "@/contexts/create-course-form-context";

function EditCourseContent() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { currentFormStep } = useCreateCourseFormProvider();

  const RenderFormStepContent = () => {
    switch (currentFormStep) {
      case 1:
        return <CreateCourseBasicInfoForm />;
      case 2:
        return <CreateCourseStructure />;
      case 3:
        return <CreateCourseAdditionalInfoForm />;
      default:
        <CreateCourseBasicInfoForm />;
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext="Edit Course" user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={"/admin/courses"} className="hover:underline">
                Courses
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span>Edit course</span>
            </p>
          </TopBar>
        )}
      </div>

      <div className="max-w-[900px] mx-auto w-full">
        <CreateCourseTabs />
        <div className="w-full dashboard-shadow p-6 rounded-xl bg-white">
          <>{RenderFormStepContent()}</>
          <CreateCourseButtons />
        </div>
      </div>
    </section>
  );
}

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { data: course, isLoading } = useCourse(courseId);

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="w-full h-20 mb-6 rounded-xl" />
        <Skeleton className="max-w-[900px] mx-auto h-[500px] rounded-xl" />
      </div>
    );
  }

  if (!course) {
    return <div className="p-8">Course not found</div>;
  }

  // Convert existing course to CreateCourse shape
  const initialData: CreateCourse = {
    title: course.title,
    description: course.description || "",
    category: course.category || "",
    difficultyLevel: course.difficultyLevel || "",
    language: course.language || "",
    enableCertification: course.enableCertification,
    trackProgress: course.trackProgress,
    enableComments: course.enableComments,
    additionalNotes: course.additionalNotes || "",
    prerequisites: course.prerequisites || [],
    Lesson: course.Lesson.map((l) => ({
      id: l.id,
      name: l.title,
      type: l.type as LessonContentType,
      video: {
        file: null,
        preview: l.duration?.toString() || "0",
        src: l.mediaId || "", // we pass mediaId to src so the form can track it
      },
      isLocked: false,
    })),
    // thumbnailId on Course is a raw storage ID, not a URL — cannot be used as image src.
    // Existing thumbnail is preserved server-side; user can replace it by uploading a new one.
    thumbnailId: null,
    status: course.status as CourseStatus,
  };

  return (
    <CreateCourseFormProvider courseId={courseId} initialData={initialData}>
      <EditCourseContent />
    </CreateCourseFormProvider>
  );
}
