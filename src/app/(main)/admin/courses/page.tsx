"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { OverviewCard } from "@/components/admin/overview-card";
import { TopBar } from "@/components/shared/top-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseList } from "@/components/admin/course/course-list";
import { CourseDetails } from "@/components/admin/course/course-details";

import { useCurrentUser } from "@/hooks/useAccount";
import { useCourse, useCourses, useCoursesMetrics } from "@/hooks/useAdmin";
import { processCoursesMetrics } from "@/utils/processor";

export default function CoursesManagementPage() {
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: coursesMetrics, isLoading: coursesMetricsLoading } = useCoursesMetrics();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: course, isLoading: courseLoading } = useCourse(selectedCourseId);

  const allCoursesMetrics = processCoursesMetrics(coursesMetrics ?? []);

  // console.log(selectedCourseId, course);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext="Manage Courses" user={user as User}>
            <p className="flex items-center gap-1">Courses</p>
          </TopBar>
        )}
      </div>

      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-xl">Courses Overview</h3>

          <Link href={"/admin/courses/new"}>
            <Button variant={"_default"} className="bg-orange hover:bg-burnt px-4 py-2 h-10">
              <Plus className="w-6 h-6" strokeWidth={3} />
              <span>Add Course</span>
            </Button>
          </Link>
        </div>

        <div className="courses-overview-cards">
          {coursesMetricsLoading ? (
            <Skeleton className="w-full rounded-xl h-24" />
          ) : (
            <div className="flex gap-6 h-24">
              {allCoursesMetrics.map((coursesMetrics, index) => (
                <OverviewCard overview={coursesMetrics} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex gap-3 h-[600px]">
        {coursesLoading ? (
          <Skeleton className="w-full rounded-xl h-full" />
        ) : (
          <>
            <CourseList
              courses={courses!}
              courseId={selectedCourseId}
              setCourseId={setSelectedCourseId}
            />

            <div className="w-full rounded-xl p-6 border border-shade-2 bg-white">
              {courseLoading ? (
                <Skeleton className="w-full rounded-xl h-full" />
              ) : selectedCourseId ? (
                <CourseDetails course={course!} />
              ) : (
                <p className="text-low text-sm mt-3">No course selected.</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
