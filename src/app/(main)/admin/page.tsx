"use client";

import { User } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";
import { StatCard } from "@/components/admin/stat-card";
import { ActivitiesCard } from "@/components/admin/activities-card";
import { Activity } from "@/components/admin/activity";
import { TutorClass } from "@/components/admin/tutor-class";
import { EnrollmentTrendGraph } from "@/components/admin/enrollment-trend-graph";
import { PaymentsTable } from "@/components/admin/payments-table";

import { useCurrentUser } from "@/hooks/useAccount";
import { useActivities, useMetrics, useSchedules } from "@/hooks/useDashboard";

import { payments } from "@/data/mockData";
import { processActivities, processDashboardMetrics, processSchedules } from "@/utils/processor";

export default function AdminPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: metrics, isLoading: metricsLoading } = useMetrics();
  const { data: schedules, isLoading: schedulesLoading } = useSchedules();
  const { data: activities, isLoading: activitiesLoading } = useActivities();

  const dashboardMetrics = processDashboardMetrics(metrics) ?? [];
  const tutorsClasses = processSchedules(schedules?.records ?? []);
  const recentActivities = processActivities(activities?.records ?? []);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={`Welcome Back, ${user?.firstName}`} user={user as User}>
            Dashboard
          </TopBar>
        )}
      </div>

      <div className="dashboardMetrics">
        {metricsLoading ? (
          <Skeleton className="w-full rounded-xl h-[140px]" />
        ) : (
          <div className="h-[140px] flex gap-4">
            {dashboardMetrics.map((dashboardMetric, index) => (
              <StatCard key={index} stat={dashboardMetric} />
            ))}
          </div>
        )}
      </div>

      <div className="graphs-classes-activities">
        <div className="h-[280px] flex gap-4">
          <div className="w-full">
            {metricsLoading ? <Skeleton className="w-full h-full" /> : <EnrollmentTrendGraph users={metrics?.users} />}
          </div>

          <div className="w-full max-w-[280px]">
            {schedulesLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ActivitiesCard icon={User} title={"Tutors Class"}>
                {tutorsClasses.length > 0 ? (
                  tutorsClasses.map((tutorsClass, index) => <TutorClass classDetail={tutorsClass} key={index} />)
                ) : (
                  <p className="text-sm">No Classes</p>
                )}
              </ActivitiesCard>
            )}
          </div>

          <div className="w-full max-w-[240px]">
            {activitiesLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ActivitiesCard icon={User} title={"Recent Activities"}>
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => <Activity activity={activity} key={index} />)
                ) : (
                  <p className="text-sm">No Recent Activity</p>
                )}
              </ActivitiesCard>
            )}
          </div>
        </div>
      </div>

      <div>
        <PaymentsTable payments={payments} />
      </div>
    </section>
  );
}
