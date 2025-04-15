"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Student {
  id: string;
  name: string;
  category: string;
  email: string;
  status: "Active" | "Inactive";
}

interface StudentTableProps {
  students: Student[];
}

export default function StudentTable({ students }: StudentTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ["Student ID", "Name", "Category", "Email", "Status"];
    const rows = filteredStudents.map((student) => [
      student.id,
      student.name,
      student.category,
      student.email,
      student.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "student_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center w-full gap-3">
        <h2 className="text-xl">Student Lists</h2>
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
            <DropdownMenuItem onClick={() => setStatusFilter("Active")}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Inactive")}>
              Inactive
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
              <th className="py-3 px-4 font-semibold">Student ID</th>
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Email</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="border-[1px] bg-[#F8F8FA] border-[#D2D4E0] mt-3"
              >
                <td className="text-sm py-4 pl-3 border-[1px] border-[#D2D4E0] rounded-l-xl border-r-0">
                  {student.id}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {student.name}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {student.category}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {student.email}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  <span
                    className={
                      student.status === "Active"
                        ? "text-light-green"
                        : "text-red-500"
                    }
                  >
                    {student.status}
                  </span>
                </td>
                <td className="text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl text-orange cursor-pointer hover:underline">
                  <Link href="/tutor/students/profile">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
