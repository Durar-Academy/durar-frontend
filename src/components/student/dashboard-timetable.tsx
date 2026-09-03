"use client";

import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { SingleDayFixedTimeSchedule } from "@/components/student/single-day-timetable";

import { useStudentTimetable } from "@/hooks/useStudent";
import { currentDay } from "@/utils/time";

export function DashboardTimetable() {
  const { data: schedules, isLoading: schedulesLoading } = useStudentTimetable();

  return (
    <div className="bg-shade-1 rounded-xl p-6 pb-3">
      <div className="flex justify-between items-center mb-6">
        <p className="text-high text-base leading-5 tracking-normal">Time Table</p>

        <Link
          href={"/student/timetable"}
          className="text-orange hover:underline text-balance leading-5 tracking-normal"
        >
          View All
        </Link>
      </div>

      {schedulesLoading ? (
        <Skeleton className="rounded-xl w-full h-40" />
      ) : (
        <SingleDayFixedTimeSchedule schedules={schedules ?? []} selectedDay={currentDay} />
      )}
    </div>
  );
}
