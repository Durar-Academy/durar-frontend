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

interface SubmissionList {
  studentName: string;
  status: "Submitted" | "Pending";
  SubmissionDate: string;
  grade: string;
}

interface SubmissionListTableProps {
  SubmissionList: SubmissionList[];
}

export default function SubmissionLists({
  SubmissionList,
}: SubmissionListTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Submitted" | "Pending"
  >("All");

  const FilteredSubmissionList = SubmissionList.filter((SubmissionList) => {
    const matchesSearch =
      SubmissionList.studentName.toLowerCase().includes(search.toLowerCase()) ||
      SubmissionList.grade.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || SubmissionList.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ["Student Name", "Status", "Submission date", "Grade"];
    const rows = FilteredSubmissionList.map((SubmisionList) => [
      SubmisionList.studentName,
      SubmisionList.status,
      SubmisionList.SubmissionDate,
      SubmisionList.grade,
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "SubmissionList_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center w-full gap-3">
        <h2 className="text-xl">Submission List</h2>
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
            <DropdownMenuItem onClick={() => setStatusFilter("Submitted")}>
              Submitted
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>
              Pending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          onClick={exportToCSV}
          className="flex gap-3 text-sm text-orange border-[1px] border-orange p-3 rounded-lg justify-center items-center"
        >
          Download
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
              <th className="py-3 px-4 font-semibold">Student Name</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Submission Date</th>
              <th className="py-3 px-4 font-semibold">Grade</th>
              <th className="py-3 px-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {FilteredSubmissionList.map((SubmissionList, index) => (
              <tr
                key={index}
                className="border-[1px] bg-[#F8F8FA] border-[#D2D4E0] mt-3"
              >
                <td className="text-sm py-4 pl-3 border-[1px] border-[#D2D4E0] rounded-l-xl border-r-0">
                  {SubmissionList.studentName}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  <span
                    className={
                      SubmissionList.status === "Submitted"
                        ? "text-light-green"
                        : "text-red-500"
                    }
                  >
                    {SubmissionList.status}
                  </span>
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {SubmissionList.SubmissionDate}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  <span className="flex justify-center items-center w-[54px] h-[26px] bg-white rounded-lg border border-shade-2">{SubmissionList.grade}</span>
                </td>

                <td className="text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl text-orange cursor-underline cursor-pointer hover:underline">
                  View
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
