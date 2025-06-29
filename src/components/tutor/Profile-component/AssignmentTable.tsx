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
import Link from "next/link";

interface assignment {
  course: string;
  date: string; // example: "2025-04-09"
  score: string;
  status: "Done" | "Pending";
}

interface assignmentTableProps {
  assignments: assignment[];
}

export default function AssignmentTable({ assignments }: assignmentTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Done" | "Pending">(
    "All"
  );
  const [dateFilter, setDateFilter] = useState("");

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.course.toLowerCase().includes(search.toLowerCase()) ||
      assignment.score.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || assignment.status === statusFilter;

    const matchesDate = dateFilter === "" || assignment.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center w-full gap-3">
        <h2 className="text-xl text-orange">Assignments</h2>
        <span className="flex-1"></span>

        {/* Search Box */}
        <div className="h-11 rounded-lg border-[#D2D4E0] border-[1px] flex items-center justify-center p-3 w-[10rem]">
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[7rem] border-none outline-none text-sm"
          />
          <Image
            src="/SVGs/searchIcon.svg"
            alt="search Icon"
            width={16}
            height={16}
          />
        </div>

        {/* Status Filter */}
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
            <DropdownMenuItem onClick={() => setStatusFilter("Done")}>
              Done
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>
              Pending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Filter Input */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-11 border rounded-lg px-3 text-sm"
        />

        {/* Create Assignment Button */}
        <Link
          href="/tutor/assignments/add-assignment"
          className="flex gap-3 text-sm bg-orange border-[1px] border-orange text-white p-3 rounded-lg justify-center items-center"
        >
          Create Assignment
          <Image
            src={"/SVGs/arrow.svg"}
            alt="export icon"
            width={16}
            height={16}
          />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="text-sm min-w-full bg-white border-none border-separate border-spacing-y-3">
          <thead>
            <tr className="text-low text-sm text-left">
              <th className="py-3 px-4 font-semibold">Course</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Score</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.map((assignment, i) => (
              <tr
                key={i}
                className="border-[1px] bg-[#F8F8FA] border-[#D2D4E0] mt-3"
              >
                <td className="text-sm py-4 pl-3 border-[1px] border-[#D2D4E0] rounded-l-xl border-r-0">
                  {assignment.course}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {assignment.date}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {assignment.score}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  <span
                    className={
                      assignment.status === "Done"
                        ? "text-light-green"
                        : "text-orange"
                    }
                  >
                    {assignment.status}
                  </span>
                </td>
                <td className="text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl text-orange cursor-pointer hover:underline">
                  <Image
                    src={"/SVGs/view.svg"}
                    height={24}
                    width={24}
                    alt="view Icon"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
