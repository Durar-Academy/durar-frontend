"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { TopBar } from "@/components/shared/top-bar";
import { CourseCard } from "@/components/student/courses-card";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAccount";
import { getStudentCourses } from "@/lib/student";
import { getCumulativeProgress } from "@/utils/processor";

export default function CoursesPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["student-courses"],
    queryFn: ({ signal }) => getStudentCourses({ signal }),
  });

  // Browse mode also lists courses the student has not paid for yet; the
  // learning progress only reflects the courses they are enrolled in.
  const enrolledCourses = useMemo(
    () => (courses ?? []).filter((course) => course.enrolled ?? ((course.UserCourse?.length ?? 0) > 0)),
    [courses],
  );
  const learningProgress = getCumulativeProgress(enrolledCourses);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={"Choose your desired course"} user={user as User}>
            Courses
          </TopBar>
        )}
      </div>

      <p className="text-high text-base leading-5 tracking-normal">
        Learning Progress: <span className="font-bold">{`${learningProgress}%`}</span>
      </p>

      <div>
        {coursesLoading ? (
          <Skeleton className="rounded-xl h-40" />
        ) : (
          <div className="bg-white rounded-xl p-6 flex flex-col gap-6">
            {courses && courses.length > 0 ? (
              <div className="grid grid-cols-5 gap-3">
                {courses.map((course, index) => (
                  <CourseCard
                    key={course.title + index}
                    name={course.title}
                    thumbnailId={course.thumbnailId}
                    progress={course.UserCourse?.[0]?.progress ?? 0}
                    id={course.id}
                    enrolled={course.enrolled ?? ((course.UserCourse?.length ?? 0) > 0)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-low text-base">No courses yet.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
