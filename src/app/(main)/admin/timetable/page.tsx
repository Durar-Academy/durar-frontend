"use client";

import { Download, Edit3Icon } from "lucide-react";
import Link from "next/link";

import { FixedTimeSchedule } from "@/components/admin/quran-timetable";
import { TopBar } from "@/components/shared/top-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAccount";
import { useSchedules } from "@/hooks/useAdmin";

export default function ViewTimetable() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: schedules, isLoading: schedulesLoading } = useSchedules();

  console.log("SCHDEULES", schedules);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext="View Timetable" user={user as User}>
            <p className="flex items-center gap-1">Timetable</p>
          </TopBar>
        )}
      </div>

      <div className="rounded-xl bg-white p-6 h-full border border-shade-2 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-xl">Quran Timetable</h3>

          <div className="flex gap-2 items-center">
            <Link href="/admin/timetable/edit">
              <Button variant={"_outline"} className="text-orange hover:text-burnt px-4 py-2 h-10">
                <Edit3Icon className="w-6 h-6" strokeWidth={3} />
                <span>Edit</span>
              </Button>
            </Link>

            <Button variant={"_default"} className="bg-orange hover:bg-burnt px-4 py-2 h-10">
              <Download className="w-6 h-6" strokeWidth={3} />
              <span>Download</span>
            </Button>
          </div>
        </div>

        <div className="h-[1024px] overflow-y-scroll hide-scrollbar">
          {schedulesLoading ? (
            <Skeleton className="rounded-xl h-full" />
          ) : (
            <FixedTimeSchedule schedules={schedules.records} />
          )}
        </div>
      </div>
    </section>
  );
}
