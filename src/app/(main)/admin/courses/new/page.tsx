"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { CreateCourseButtons } from "@/components/admin/course/create-course-buttons";
import { CreateCourseTabs } from "@/components/admin/course/create-course-tabs";
import { TopBar } from "@/components/shared/top-bar";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAccount";
import { useCreateCourseFormProvider } from "@/hooks/useForm";

import { CreateCourseStructure } from "@/components/admin/course/create-course-structure";
import { CreateCourseAdditionalInfoForm } from "@/components/admin/course/create-course-additional-form";
import { CreateCourseBasicInfoForm } from "@/components/admin/course/create-course-basic-info-form";

export default function CreateCoursePage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

  const { currentFormStep, formData } = useCreateCourseFormProvider();

  console.log("FORM DATA:", formData, "\nSTEP:", currentFormStep);

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
      {/* <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext="Create New Course" user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={"/admin/courses"} className="hover:underline">
                Courses
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span>Create course</span>
            </p>
          </TopBar>
        )}
      </div> */}

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
