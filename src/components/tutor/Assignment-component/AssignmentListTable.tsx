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
  title: string;
  course: string;
  status: "Completed" | "Pending";
  due_date: string;
  submission: number;
}

interface assignmentTableProps {
  assignments: assignment[];
}

export default function AssignmentTable({ assignments }: assignmentTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "Status" | "Completed" | "Pending"
  >("Status");
  const [courseFilter, setCourseFilter] = useState("All");

  const filteredassignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(search.toLowerCase()) ||
      assignment.course.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "Status" || assignment.status === statusFilter;
    const matchesCourse =
      courseFilter === "All" || assignment.course === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  const Courses = ["Nahwu", "Sorf", "Mutun", "Quaran Memorisation"];
  return (
    <div className="space-y-4">
      <div className="flex items-center w-full gap-3">
        <h2 className="text-xl">Assignment Lists</h2>
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
              {statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("Status")}>
              Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>
              Pending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-11" variant="outline">
              {courseFilter === "All" ? "Courses" : courseFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setCourseFilter("All")}>
              All Courses
            </DropdownMenuItem>
            {Courses.map((course, i) => (
              <DropdownMenuItem key={i} onClick={() => setCourseFilter(course)}>
                {course}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-x-auto">
        <table className="text-sm min-w-full bg-white border-none border-separate border-spacing-y-3">
          <thead>
            <tr className="text-low text-sm text-left">
              <th className="py-3 px-4 font-semibold">Assignment Title</th>
              <th className="py-3 px-4 font-semibold">Course</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Due Date</th>
              <th className="py-3 px-4 font-semibold">Submissions</th>
              <th className="py-3 px-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredassignments.map((assignment, i) => (
              <tr
                key={i}
                className="border-[1px] bg-[#F8F8FA] border-[#D2D4E0] mt-3"
              >
                <td className="text-sm py-4 pl-3 border-[1px] border-[#D2D4E0] rounded-l-xl border-r-0">
                  {assignment.title}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {assignment.course}
                </td>

                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  <span
                    className={
                      assignment.status === "Completed"
                        ? "text-light-green"
                        : "text-red-500"
                    }
                  >
                    {assignment.status}
                  </span>
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {assignment.due_date}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {assignment.submission}
                </td>
                <td className="text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl text-orange cursor-pointer hover:underline">
                  <Link href="/tutor/assignments/details">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
