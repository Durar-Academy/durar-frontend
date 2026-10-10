"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { TopBar } from "@/components/shared/top-bar";
import { CourseCard } from "@/components/student/courses-card";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAccount";
import { useSubscriptions } from "@/hooks/useSubscription";
import { getStudentCourses } from "@/lib/student";
import { getCumulativeProgress } from "@/utils/processor";

export default function CoursesPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const hasActiveSubscription = (subscriptions ?? []).some((subscription) => subscription.status === "active");
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["student-courses"],
    queryFn: ({ signal }) => getStudentCourses({ signal }),
  });

  const enrolledCourses = useMemo(() => courses ?? [], [courses]);
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
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-5 gap-3">
                {enrolledCourses.map((course, index) => (
                  <CourseCard
                    key={course.title + index}
                    name={course.title}
                    thumbnailId={course.thumbnailId}
                    progress={course.UserCourse?.[0]?.progress ?? 0}
                    id={course.id}
                    enrolled={course.enrolled ?? ((course.UserCourse?.length ?? 0) > 0)}
                    subscriptionActive={subscriptionsLoading || hasActiveSubscription}
                  />
                ))}
              </div>
            ) : (
              <p className="text-low text-base">No courses yet.</p>
            )}
          </div>
        )}
      </div>

      {!subscriptionsLoading && !hasActiveSubscription && (
        <div className="flex justify-center sm:justify-start">
          <Link
            href="/student/subscription"
            className="rounded-xl bg-orange px-6 py-3 text-center text-sm font-medium text-white hover:bg-burnt"
          >
            Subscribe
          </Link>
        </div>
      )}
    </section>
  );
}
