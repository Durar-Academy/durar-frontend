"use client";
import DashboardTable from "@/components/tutor/DashboardTable";
import RecentNotificatin from "@/components/tutor/Recent-notificatin";
import RecentClassesTable from "@/components/tutor/RecentClassesTable";
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

  const RecentClassData = [
    {
      date: "12/02/2024",
      student: "Lawal Wahab Babatunde",
      category: "Thanawiyah",
      time: "3:00 PM",
      start_time: "3:00 PM",
      status: "Hold" as "Hold",
    },
    {
      date: "12/02/2024",
      student: "Lawal Wahab Babatunde",
      category: "Thanawiyah",
      time: "3:00 PM",
      start_time: "3:00 PM",
      status: "Hold" as "Hold",
    },
    {
      date: "12/02/2024",
      student: "Lawal Wahab Babatunde",
      category: "Thanawiyah",
      time: "3:00 PM",
      start_time: "3:00 PM",
      status: "Missed" as "Missed",
    },
    {
      date: "12/02/2024",
      student: "Lawal Wahab Babatunde",
      category: "Thanawiyah",
      time: "3:00 PM",
      start_time: "3:00 PM",
      status: "Hold" as "Hold",
    },
    {
      date: "12/02/2024",
      student: "Lawal Wahab Babatunde",
      category: "Thanawiyah",
      time: "3:00 PM",
      start_time: "3:00 PM",
      status: "Missed" as "Missed",
    },
  ];

  return (
    <section className="flex flex-col gap-3">
      <Top_Bar subtext={`Manage classes`}>Classes</Top_Bar>
      <section className="bg-white p-6 border-[1px] border-[#E7E8EE] rounded-xl">
        <DashboardTable />
      </section>
      <section className="bg-white p-6 border-[1px] border-[#E7E8EE] rounded-xl">
        <RecentClassesTable RecentClasss={RecentClassData} />
      </section>
    </section>
  );
};

export default page;
