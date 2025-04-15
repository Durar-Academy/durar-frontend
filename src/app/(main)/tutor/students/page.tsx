"use client";
import StudentTable from "@/components/tutor/StudentTable";
import { Top_Bar } from "@/components/tutor/top-bar";
import { useState } from "react";

const page = () => {
  const [loading, setLoading] = useState(false);

  const students = [
    {
      id: "001",
      name: "Lawal Wahab Babatunde",
      category: "Thanawiyah",
      email: "wabdotmail@gmail.com",
      status: "Active" as "Active",
    },
    {
      id: "001",
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
  return (
    <section className="flex flex-col gap-3">
      <Top_Bar subtext={`Manage students`}>Students</Top_Bar>
      <section className="StudentLists p-6 rounded-xl bg-white border-[1px] border-[#E7E8EE]">
        <StudentTable students={students} />
      </section>
    </section>
  );
};

export default page;
