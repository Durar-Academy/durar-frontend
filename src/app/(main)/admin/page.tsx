"use client";

import { CircleDollarSign, Glasses, User, Users } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";
import { StatCard } from "@/components/admin/stat-card";
import { ActivitiesCard } from "@/components/admin/activities-card";
import { Activity } from "@/components/admin/activity";
import { TutorClass } from "@/components/admin/tutor-class";
import { EnrollmentTrendGraph } from "@/components/admin/enrollment-trend-graph";
import { PaymentsTable } from "@/components/admin/payments-table";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMetrics } from "@/hooks/useMetrics";
import { formatToNaira } from "@/utils/formatter";

import { activities, payments, tutorsClasses } from "@/data/mockData";

export default function AdminPage() {
  const { data: user, isLoading: topbarLoading } = useCurrentUser();

  const { data: metrics, isLoading: statsLoading } = useMetrics();

  const Stats = [
    {
      title: "Students",
      icon: Users,

      main: {
        figure: metrics?.studentsCount ?? 0,
        label: "Total",
      },

      sub: {
        figure: metrics?.activeStudentsCount ?? 0,
        label: "Active",
      },
    },

    {
      title: "Tutors",
      icon: Users,

      main: {
        figure: metrics?.tutorsCount ?? 0,
        label: "Total",
      },

      sub: {
        figure: metrics?.activeTutorsCount ?? 0,
        label: "Active",
      },
    },

    {
      title: "Courses offered",
      icon: Glasses,

      main: {
        figure: metrics?.totalCoursesCount ?? 0,
        label: "Courses",
      },

      sub: {
        figure: metrics?.publishedCoursesCount ?? 0,
        label: "Published",
      },
    },

    {
      title: "Payments",
      icon: CircleDollarSign,

      main: {
        figure: formatToNaira(metrics?.creditedPayments ?? 0),
        label: "Credited",
      },

      sub: {
        figure: formatToNaira(metrics?.pendingPayments ?? 0),
        label: "Pending",
      },
    },
  ];

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {topbarLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={`Welcome Back, ${user?.firstName}`} user={user as User}>
            Dashboard
          </TopBar>
        )}
      </div>

      <div className="stats">
        {statsLoading ? (
          <Skeleton className="w-full rounded-xl h-[140px]" />
        ) : (
          <div className="h-[140px] flex gap-4">
            {Stats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        )}
      </div>

      <div className="graphs-classes-activities">
        <div className="h-[280px] flex gap-4">
          <div className="w-full">
            {statsLoading ? <Skeleton className="w-full h-full" /> : <EnrollmentTrendGraph users={metrics?.users} />}
          </div>

          <div className="w-full max-w-[280px]">
            <ActivitiesCard icon={User} title={"Tutors Class"}>
              {tutorsClasses.map((tutorsClass, index) => (
                <TutorClass classDetail={tutorsClass} key={index} />
              ))}
            </ActivitiesCard>
          </div>

          <div className="w-full max-w-[240px]">
            <ActivitiesCard icon={User} title={"Recent Activities"}>
              {activities.map((activity, index) => (
                <Activity activity={activity} key={index} />
              ))}
            </ActivitiesCard>
          </div>
        </div>
      </div>

      <div>
        <PaymentsTable payments={payments} />
      </div>
    </section>
  );
}
