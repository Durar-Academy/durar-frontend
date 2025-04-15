"use client";
import DashboardTable from "@/components/tutor/DashboardTable";
import RecentNotificatin from "@/components/tutor/Recent-notificatin";
import { Top_Bar } from "@/components/tutor/top-bar";
import TutorStatCard from "@/components/tutor/tutor-stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const page = () => {
  const [loading, setLoading] = useState(false);

  interface StatDataInterface {
    title: string;
    active: number;
    img: string;
    active2: string;
    total: number;
    total2: string;
  }

  const StatData: StatDataInterface[] = [
    {
      title: "Students",
      active: 25,
      img: "/SVGs/students.svg",
      active2: "Active",
      total: 250,
      total2: "Total",
    },
    {
      title: "Student Enrolled",
      active: 4,
      img: "/SVGs/enrolled-students.svg",
      active2: "Active",
      total: 12,
      total2: "Courses",
    },
    {
      title: "Student Enrolled",
      active: 4,
      img: "/SVGs/assignment.svg",
      active2: "Pending",
      total: 12,
      total2: "Total Assignment",
    },
  ];

  return (
    <section className="flex flex-col gap-3">
      <Top_Bar subtext={`Manage classes and students`}>Dashboard</Top_Bar>
      <section className="stats">
        {loading ? (
          <Skeleton className="w-full rounded-xl h-[140px]" />
        ) : (
          <div className="grid grid-cols-3 gap-[18px]">
            {StatData.map((stat, i) => (
              <TutorStatCard key={i} {...stat} />
            ))}
          </div>
        )}
      </section>

      <section className="UpcomingClasses grid grid-cols-3 gap-3">
        <aside className="col-span-2 bg-white p-6 border-[1px] border-[#E7E8EE] rounded-xl">
          <DashboardTable />
        </aside>
        <aside className="col-span-1 bg-white p-4 border-[1px] border-[#E7E8EE] rounded-xl">
          <RecentNotificatin />
        </aside>
      </section>
    </section>
  );
};

export default page;
