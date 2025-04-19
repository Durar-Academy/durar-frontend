"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";

import { FullTimeSchedule } from "@/components/student/full-timetable";

import { useCurrentUser } from "@/hooks/useAccount";
import { formatUserName } from "@/utils/formatter";
import { useSchedules } from "@/hooks/useAdmin";

// import { schedules } from "@/data/mockData";

export default function TimetablePage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: schedules, isLoading: schedulesLoading } = useSchedules();

  const { firstName } = formatUserName(user);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={`Welcome Back, ${firstName}`} user={user as User}>
            Timetable
          </TopBar>
        )}
      </div>

      <div className="bg-shade-1 rounded-xl p-6 pb-3">
        <div className="flex justify-between items-center mb-6">
          <p className="text-high text-base leading-5 tracking-normal font-bold">Time Table</p>
        </div>

        {schedulesLoading ? (
          <Skeleton className="rounded-xl w-full h-screen" />
        ) : (
          <FullTimeSchedule schedules={schedules.records} />
        )}
      </div>
    </section>
  );
}
