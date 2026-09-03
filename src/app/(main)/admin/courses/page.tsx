"use client";

import { GraduationCap, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const { data: courses, isLoading: coursesLoading, isError: coursesError } = useCourses();
  const { data: course, isLoading: courseLoading, isError: courseError } = useCourse(selectedCourseId);

  // Keep a course selected once the list loads so the course-specific actions
  // (including enrolment) have a valid destination immediately.
  useEffect(() => {
    if (!selectedCourseId && courses?.length) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

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

          <div className="flex items-center gap-3">
            <Link href={selectedCourseId ? `/admin/courses/${selectedCourseId}/enroll` : "#"}>
              <Button
                variant={"_default"}
                className="bg-green hover:bg-dark-green px-4 py-2 h-10"
                disabled={!selectedCourseId}
              >
                <GraduationCap className="w-5 h-5" />
                <span>Enrol Student</span>
              </Button>
            </Link>
            <Link href={"/admin/courses/new"}>
              <Button variant={"_default"} className="bg-orange hover:bg-burnt px-4 py-2 h-10">
              <Plus className="w-6 h-6" strokeWidth={3} />
              <span>Add Course</span>
              </Button>
            </Link>
          </div>
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
        ) : coursesError ? (
          <div className="w-full rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
            Unable to load courses. Please refresh and try again.
          </div>
        ) : (
          <>
            <CourseList
              courses={courses ?? []}
              courseId={selectedCourseId}
              setCourseId={setSelectedCourseId}
            />

            <div className="w-full rounded-xl p-6 border border-shade-2 bg-white">
              {courseLoading ? (
                <Skeleton className="w-full rounded-xl h-full" />
              ) : selectedCourseId && course ? (
                <CourseDetails course={course} />
              ) : (
                <p className="text-low text-sm mt-3">
                  {courseError ? "Unable to load the selected course." : "No course selected."}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
