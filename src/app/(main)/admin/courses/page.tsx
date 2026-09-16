"use client";

import { GraduationCap, Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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
  const [filters, setFilters] = useState<SearchFilters>({ page: 1, limit: 50 });

  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: coursesMetrics, isLoading: coursesMetricsLoading } = useCoursesMetrics();
  const { data: courses, isLoading: coursesLoading, isError: coursesError } = useCourses(filters);
  const { data: course, isLoading: courseLoading, isError: courseError } = useCourse(selectedCourseId);

  // Keep a course selected once the list loads so the course-specific actions
  // (including enrolment) have a valid destination immediately.
  useEffect(() => {
    if (!selectedCourseId && courses?.length) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  const allCoursesMetrics = processCoursesMetrics(coursesMetrics ?? []);
  const handleCourseSearch = useCallback((search: string) => {
    setFilters((current) => ({ ...current, search, page: 1 }));
  }, []);
  const handleCourseStatus = useCallback((status: SearchFilters["status"] | undefined) => {
    setFilters((current) => ({ ...current, status, page: 1 }));
  }, []);

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

      <div className="flex flex-col gap-4 rounded-xl border border-shade-2 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-low font-medium text-xl">Courses Overview</h3>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link className="w-full sm:w-auto" href={selectedCourseId ? `/admin/courses/${selectedCourseId}/enroll` : "#"}>
              <Button
                variant={"_default"}
                className="h-10 w-full bg-green px-4 py-2 hover:bg-dark-green sm:w-auto"
                disabled={!selectedCourseId}
              >
                <GraduationCap className="w-5 h-5" />
                <span>Enrol Student</span>
              </Button>
            </Link>
            <Link className="w-full sm:w-auto" href={"/admin/courses/new"}>
              <Button variant={"_default"} className="h-10 w-full bg-orange px-4 py-2 hover:bg-burnt sm:w-auto">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {allCoursesMetrics.map((coursesMetrics, index) => (
                <OverviewCard overview={coursesMetrics} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 lg:grid lg:h-[600px] lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
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
              search={filters.search ?? ""}
              status={filters.status as CourseStatus | undefined}
              onSearchChange={handleCourseSearch}
              onStatusChange={handleCourseStatus}
            />

            <div className="min-w-0 w-full rounded-xl border border-shade-2 bg-white p-4 sm:p-6">
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
