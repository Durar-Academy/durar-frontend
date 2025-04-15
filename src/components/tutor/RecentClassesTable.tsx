"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { closestIndexTo } from "date-fns";

interface RecentClass {
  date: string;
  student: string;
  category: string;
  time: string;
  start_time: string;
  status: "Hold" | "Missed";
}

interface RecentClassTableProps {
  RecentClasss: RecentClass[];
}

export default function RecentClassesTable({
  RecentClasss,
}: RecentClassTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Hold" | "Missed">(
    "All"
  );

  const filteredRecentClasss = RecentClasss.filter((RecentClass) => {
    const matchesSearch =
      RecentClass.student.toLowerCase().includes(search.toLowerCase()) ||
      RecentClass.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || RecentClass.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Student",
      "Category",
      "Time",
      "Start time",
      "Status",
    ];
    const rows = filteredRecentClasss.map((RecentClass) => [
      RecentClass.date,
      RecentClass.student,
      RecentClass.category,
      RecentClass.time,
      RecentClass.start_time,
      RecentClass.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "RecentClass_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center w-full gap-3">
        <h2 className="text-xl">Recent Classes</h2>
        <span className="flex-1"></span>
        <div className="h-11 rounded-lg border-[#D2D4E0] border-[1px] flex items-center justify-center p-3">
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm  border-none outline-none text-sm"
          />

          <Image
            src="/SVGs/searchIcon.svg"
            alt="search Icon"
            width={16}
            height={16}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-11" variant="outline">
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("All")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Hold")}>
              Hold
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Missed")}>
              Missed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          onClick={exportToCSV}
          className="flex gap-3 text-sm text-orange border-[1px] border-orange p-3 rounded-lg justify-center items-center"
        >
          Export List
          <Image
            src={"/SVGs/exportImg.svg"}
            alt="export icon"
            width={16}
            height={16}
          />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="text-sm min-w-full bg-white border-none border-separate border-spacing-y-3">
          <thead>
            <tr className="text-low text-sm text-left">
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Student</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Time</th>
              <th className="py-3 px-4 font-semibold">Start time</th>
              <th className="py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecentClasss.map((RecentClass, index) => (
              <tr
                key={index}
                className="border-[1px] bg-[#F8F8FA] border-[#D2D4E0] mt-3"
              >
                <td className="text-sm py-4 pl-3 border-[1px] border-[#D2D4E0] rounded-l-xl border-r-0">
                  {RecentClass.date}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {RecentClass.student}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {RecentClass.category}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {RecentClass.time}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {RecentClass.start_time}
                </td>

                <td className="text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl text-orange cursor-pointer hover:underline">
                  <span
                    className={
                      RecentClass.status === "Hold"
                        ? "text-light-green"
                        : "text-red-500"
                    }
                  >
                    {RecentClass.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
