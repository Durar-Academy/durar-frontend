"use client";

// Force dynamic rendering to ensure manifest generation
export const dynamic = 'force-dynamic';

import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";

import { CourseCard } from "@/components/student/courses-card";
import { AssignmentListItem } from "@/components/student/assignment-list-item";
import { DashboardTimetable } from "@/components/student/dashboard-timetable";
import { ArrowRight } from "lucide-react";

import { useCurrentUser } from "@/hooks/useAccount";
import { formatUserName } from "@/utils/formatter";

// import { studentAssignments } from "@/data/mockData";
import { useCourses } from "@/hooks/useAdmin";
import { getCumulativeProgress } from "@/utils/processor";
import { useAssignments } from "@/hooks/useStudent";
import { useSubscriptions } from "@/hooks/useSubscription";

export function StudentPageClient() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: courses, isLoading: coursesLoading } = useCourses({ status: "published" });
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments();
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const hasActiveSubscription = (subscriptions ?? []).some((subscription) => subscription.status === "active");

  const learningProgress = getCumulativeProgress(courses);
  const { firstName } = formatUserName(user);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext={`Welcome Back, ${firstName}`} user={user as User}>
            Dashboard
          </TopBar>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        <div className="rounded-xl bg-shade-1 p-3 pt-6 lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-high text-base leading-5 tracking-normal">
              Learning Progress: <span className="font-bold">{`${learningProgress}%`}</span>
            </p>

            <Link
              href={"/student/courses"}
              className="text-orange hover:underline text-balance leading-5 tracking-normal"
            >
              View All
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-scroll hide-scrollbar w-full">
            {coursesLoading ? (
              <Skeleton className="w-full rounded-xl h-40" />
            ) : courses && courses.length > 0 ? (
              <div className="flex gap-3 overflow-x-scroll hide-scrollbar w-full">
                {courses.map((course, index) => (
                  <CourseCard
                    key={course.title + index}
                    name={course.title}
                    thumbnailId={course.thumbnailId}
                    progress={course.UserCourse[0].progress}
                    id={course.id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-low text-base">No courses yet.</p>
            )}
          </div>
        </div>

        {/* <div className="bg-shade-1 rounded-xl p-3 pt-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-high text-base leading-5 tracking-normal">
              Next Course: <span className="font-bold">Arabic</span>
            </p>
          </div>

          <CourseCard name={"Arabic"} thumbnail={""} progress={10} link={""} />
        </div> */}

        <div className="rounded-xl border-2 border-shade-1 bg-white p-4 sm:p-6 lg:col-span-1">
          <h3 className="text-high tracking-wide text-base leading-5 mb-6">Assignments</h3>

          {assignmentsLoading ? (
            <Skeleton className="rounded-xl w-full h-12" />
          ) : (
            <div className="overflow-y-auto max-h-40 hide-scrollbar">
              <div className="flex flex-col gap-3">
                {assignments?.map((assignment: StudentAssignment) => (
                  <AssignmentListItem
                    key={assignment.id + assignment.title}
                    id={assignment.id}
                    title={assignment.title}
                    dueDate={assignment.dueAt}
                    isChecked={assignment.status ? assignment.status !== "pending" : false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <DashboardTimetable />

      {!subscriptionsLoading && !hasActiveSubscription && (
        <div className="flex justify-start">
          <Link
            href="/student/subscription"
            className="group inline-flex w-[206px] h-10 items-center justify-center gap-2 rounded-xl border border-orange bg-orange px-8 py-2 text-center text-sm font-medium text-white shadow-sm transition duration-200 hover:border-burnt hover:bg-burnt hover:shadow-md active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          >
            Subscribe
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}
      {/* <StudentWelcomeModal /> */}
    </section>
  );
}
