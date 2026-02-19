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
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon, Eye } from "lucide-react";

interface assignment {
  id: string;
  course: string;
  date: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
}

interface assignmentTableProps {
  assignments: assignment[];
}

export default function AssignmentTable({ assignments }: assignmentTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "pending" | "submitted" | "graded">(
    "All"
  );
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.course.toLowerCase().includes(search.toLowerCase()) ||
      assignment.dueDate.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || assignment.status === statusFilter;

    // Parse the assignment date and compare with filter date
    let matchesDate = true;
    if (dateFilter) {
      try {
        // assignment.date is formatted as "PP" (e.g., "Apr 9, 2025")
        const assignmentDate = parse(assignment.date, "PP", new Date());
        const filterDate = new Date(dateFilter);
        matchesDate = 
          assignmentDate.getDate() === filterDate.getDate() &&
          assignmentDate.getMonth() === filterDate.getMonth() &&
          assignmentDate.getFullYear() === filterDate.getFullYear();
      } catch {
        matchesDate = true; // If date parsing fails, show the assignment
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "graded":
        return "Done";
      case "submitted":
        return "Submitted";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

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
            <DropdownMenuItem onClick={() => setStatusFilter("graded")}>
              Done
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("submitted")}>
              Submitted
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
              Pending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Filter Input */}
        <div className="relative">
          <input
            type="date"
            value={dateFilter ? format(dateFilter, "yyyy-MM-dd") : ""}
            onChange={(e) => setDateFilter(e.target.value ? new Date(e.target.value) : undefined)}
            className="h-11 border border-shade-3 rounded-lg px-3 pr-10 text-sm w-[150px] focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
            placeholder="dd/mm/yyyy"
          />
          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-low pointer-events-none" />
        </div>

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
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-low">No assignments found</p>
          </div>
        ) : (
          <table className="text-sm min-w-full bg-white border-none border-separate border-spacing-y-3">
            <thead>
              <tr className="text-low text-sm text-left">
                <th className="py-3 px-4 font-semibold">Course</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Due Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((assignment) => (
              <tr
                key={assignment.id}
                className="border-[1px] bg-[#F8F8FA] border-[#D2D4E0] mt-3"
              >
                <td className="text-sm py-4 pl-3 border-[1px] border-[#D2D4E0] rounded-l-xl border-r-0">
                  {assignment.course}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {assignment.date}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {assignment.dueDate}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  <span
                    className={
                      assignment.status === "graded"
                        ? "text-light-green"
                        : assignment.status === "submitted"
                        ? "text-high"
                        : "text-orange"
                    }
                  >
                    {getStatusLabel(assignment.status)}
                  </span>
                </td>
                <td className="text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl text-orange cursor-pointer hover:underline">
                  <Link href={`/tutor/assignments/${assignment.id}`}>
                    <Eye className="w-5 h-5 text-orange" />
                  </Link>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
