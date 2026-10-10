"use client";

import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { SingleDayFixedTimeSchedule } from "@/components/student/single-day-timetable";

import { useStudentTimetable } from "@/hooks/useStudent";
import { useSubscriptions } from "@/hooks/useSubscription";
import { currentDay } from "@/utils/time";

export function DashboardTimetable() {
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const hasActiveSubscription = (subscriptions ?? []).some((subscription) => subscription.status === "active");
  const { data: schedules, isLoading: schedulesLoading } = useStudentTimetable({
    enabled: !subscriptionsLoading && hasActiveSubscription,
  });

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

      {schedulesLoading || subscriptionsLoading ? (
        <Skeleton className="rounded-xl w-full h-40" />
      ) : !hasActiveSubscription ? (
        <div className="relative min-h-40 overflow-hidden rounded-lg">
          <div aria-hidden="true" className="grid grid-cols-3 gap-2 p-3 blur-md opacity-60">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-16 rounded-lg bg-white shadow-sm" />
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/60 text-center backdrop-blur-[2px]">
            <p className="text-sm font-semibold text-high">Subscribe to view your timetable</p>
            <Link href="/student/subscription" className="rounded-lg bg-orange px-4 py-2 text-xs font-medium text-white hover:bg-burnt">
              Timetable Unavailable
            </Link>
          </div>
        </div>
      ) : (
        <SingleDayFixedTimeSchedule schedules={schedules ?? []} selectedDay={currentDay} />
      )}
    </div>
  );
}
