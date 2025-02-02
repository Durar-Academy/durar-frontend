"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CircleDollarSign, Glasses, Users } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { formatToNaira } from "@/utils/formatter";
import { useMetrics } from "@/hooks/useMetrics";

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
    </section>
  );
}
