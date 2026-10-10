"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";

import { FullTimeSchedule } from "@/components/student/full-timetable";

import { useCurrentUser } from "@/hooks/useAccount";
import { formatUserName } from "@/utils/formatter";
import { useStudentTimetable } from "@/hooks/useStudent";
import { useSubscriptions } from "@/hooks/useSubscription";
import Link from "next/link";

// import { schedules } from "@/data/mockData";

export default function TimetablePage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const hasActiveSubscription = (subscriptions ?? []).some((subscription) => subscription.status === "active");
  const { data: schedules, isLoading: schedulesLoading } = useStudentTimetable({
    enabled: !subscriptionsLoading && hasActiveSubscription,
  });

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

        {schedulesLoading || subscriptionsLoading ? (
          <Skeleton className="rounded-xl w-full h-64" />
        ) : !hasActiveSubscription ? (
          <div className="relative min-h-[300px] overflow-hidden rounded-xl">
            <div aria-hidden="true" className="pointer-events-none select-none blur-md opacity-60">
              <div className="grid grid-cols-3 gap-3 p-4">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="h-24 rounded-lg bg-white shadow-sm" />
                ))}
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60 p-6 text-center backdrop-blur-[2px]">
              <p className="text-lg font-semibold text-high">Subscribe to access your timetable</p>
              <p className="max-w-md text-sm text-low">Your enrolled classes will appear here after you activate a subscription.</p>
              <Link href="/student/subscription" className="rounded-lg bg-orange px-5 py-2 text-sm font-medium text-white hover:bg-burnt">
                Subscribe
              </Link>
            </div>
          </div>
        ) : (
          <FullTimeSchedule schedules={schedules ?? []} />
        )}
      </div>
    </section>
  );
}
