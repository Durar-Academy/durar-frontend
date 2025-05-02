"use client";
import StudentTable from "@/components/tutor/StudentTable";
import { Top_Bar } from "@/components/tutor/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAccount";
import { useState } from "react";

const Page = () => {
  const students = [
    {
      id: "001",
      name: "Lawal Wahab Babatunde",
      category: "Thanawiyah",
      email: "wabdotmail@gmail.com",
      status: "Active" as "Active",
    },
    {
      id: "01",
      name: "Lawal Wahab Babatunde",
      category: "Idaadiyah",
      email: "wabdotmail@gmail.com",
      status: "Active" as "Active",
    },
    {
      id: "002",
      name: "Lawal Wahab Babatunde",
      category: "Awal temhidi",
      email: "wabdotmail@gmail.com",
      status: "Active" as "Active",
    },
    {
      id: "003",
      name: "Lawal Wahab Babatunde",
      category: "Idaadiyah",
      email: "wabdotmail@gmail.com",
      status: "Active" as "Active",
    },
    {
      id: "004",
      name: "Lawal Wahab Babatunde",
      category: "Idaadiyah",
      email: "wabdotmail@gmail.com",
      status: "Active" as "Active",
    },
    {
      id: "005",
      name: "Akanji Abayomi Biodun",
      category: "Idaadiyah",
      email: "wabdotmail@gmail.com",
      status: "Inactive" as "Inactive",
    },
  ];
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  return (
    <section className="flex flex-col gap-3">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <Top_Bar subtext="Manage students" user={user as User}>
            <p className="flex items-center gap-1">Students</p>
          </Top_Bar>
        )}
      </div>
      <section className="StudentLists p-6 rounded-xl bg-white border-[1px] border-[#E7E8EE]">
        <StudentTable students={students} />
      </section>
    </section>
  );
};

export default Page;
