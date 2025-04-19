"use client";

import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";

import { CourseCard } from "@/components/student/courses-card";
import { AssignmentListItem } from "@/components/student/assignment-list-item";
import { SingleDayFixedTimeSchedule } from "@/components/student/single-day-timetable";

import { useCurrentUser } from "@/hooks/useAccount";
import { formatUserName } from "@/utils/formatter";
import { currentDay } from "@/utils/time";

import { studentAssignments } from "@/data/mockData";
import { useCourses, useSchedules } from "@/hooks/useAdmin";
import { getCumulativeProgress } from "@/utils/processor";

export default function StudentPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: schedules, isLoading: schedulesLoading } = useSchedules();
  const { data: courses, isLoading: coursesLoading } = useCourses({ status: "published" });

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

      <div className="flex gap-3">
        <div className="bg-shade-1 rounded-xl p-3 pt-6 w-3/4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-high text-base leading-5 tracking-normal">
              Learning Progress: <span className="font-bold">{`${learningProgress}%`}</span>
            </p>

            <Link
              href={"/courses"}
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
                    thumbnail={course.thumbnailId ?? ""}
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

        <div className="bg-white p-6 rounded-xl border-2 border-shade-1">
          <h3 className="text-high tracking-wide text-base leading-5 mb-6">Assignments</h3>

          <div className="overflow-y-auto max-h-40 hide-scrollbar">
            <div className="flex flex-col gap-3">
              {studentAssignments.map(({ id, text, dueDate, isChecked }) => (
                <AssignmentListItem
                  key={id}
                  id={id}
                  text={text}
                  dueDate={dueDate}
                  isChecked={isChecked}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-shade-1 rounded-xl p-6 pb-3">
        <div className="flex justify-between items-center mb-6">
          <p className="text-high text-base leading-5 tracking-normal">Time Table</p>

          <Link
            href={"/timetable"}
            className="text-orange hover:underline text-balance leading-5 tracking-normal"
          >
            View All
          </Link>
        </div>

        {schedulesLoading ? (
          <Skeleton className="rounded-xl w-full h-40" />
        ) : (
          <SingleDayFixedTimeSchedule schedules={schedules.records} selectedDay={currentDay} />
        )}
      </div>
    </section>
  );
}
