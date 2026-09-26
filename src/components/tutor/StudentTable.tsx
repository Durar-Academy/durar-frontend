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
import { useTutorStudents } from "@/hooks/tutorQueries";
import { processTutorStudents } from "@/utils/tutorProcessor";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentTable({ page, setPage }: StudentTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");

  const { data: studentsData, isLoading } = useTutorStudents({
    page,
    search: search.trim() || undefined,
  });
  const students = processTutorStudents(studentsData);

  const filteredStudents = students.filter((student) => {
    const matchesStatus =
      statusFilter === "All" || student.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesStatus;
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

  const handlePreviousPage = () => {
    if (studentsData?.metaData.hasPreviousPages) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (studentsData?.metaData.hasNextPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
        <h2 className="text-xl font-semibold">Student Lists</h2>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:ml-auto lg:w-auto lg:items-center">
        <div className="flex h-11 min-w-0 w-full items-center justify-center rounded-lg border border-[#D2D4E0] p-3 sm:w-auto">
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-0 w-full border-none text-sm outline-none sm:w-48"
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
            <Button className="h-11 w-full sm:w-auto" variant="outline">
              {statusFilter === "All" ? "Status" : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6}>
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
          className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-orange p-3 text-sm text-orange sm:w-auto"
        >
          Export List
          <Image
            src="/SVGs/exportImg.svg"
            alt="export icon"
            width={16}
            height={16}
          />
        </button>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="w-full h-[300px] rounded-xl" />
      ) : (
        <>
          <div className="w-full min-w-0 overflow-x-auto rounded-lg">
            <table className="w-full min-w-[960px] table-auto border-separate border-spacing-y-3 bg-white text-sm">
              <colgroup>
                <col className="w-[18%]" />
                <col className="w-[20%]" />
                <col className="w-[17%]" />
                <col className="w-[27%]" />
                <col className="w-[10%]" />
                <col className="w-[8%]" />
              </colgroup>
              <thead>
                <tr className="text-low text-sm text-left">
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Student ID</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Name</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Category</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Email</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-sm text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="mt-3 border-[1px] border-[#D2D4E0] bg-[#F8F8FA]"
                    >
                      <td className="whitespace-nowrap rounded-l-xl border-[1px] border-r-0 border-[#D2D4E0] py-4 pl-4 pr-4 text-sm">
                        {student.id}
                      </td>
                      <td className="whitespace-nowrap border-y-[1px] border-[#D2D4E0] px-4 py-4 text-sm">
                        {student.name}
                      </td>
                      <td className="whitespace-nowrap border-y-[1px] border-[#D2D4E0] px-4 py-4 text-sm">
                        {student.category}
                      </td>
                      <td className="whitespace-nowrap border-y-[1px] border-[#D2D4E0] px-4 py-4 text-sm">
                        {student.email}
                      </td>
                      <td className="whitespace-nowrap border-y-[1px] border-[#D2D4E0] px-4 py-4 text-sm">
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
                      <td className="whitespace-nowrap rounded-r-xl border-[1px] border-l-0 border-[#D2D4E0] px-4 py-4 text-sm text-orange hover:underline">
                        <Link href={`/tutor/students/profile/${student.id}`}>View</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Button
              onClick={handlePreviousPage}
              disabled={!studentsData?.metaData.hasPreviousPages}
              variant="outline"
              className="h-10"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {studentsData?.metaData.page ?? 1} of {studentsData?.metaData.pageCount ?? 1}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={!studentsData?.metaData.hasNextPages}
              variant="outline"
              className="h-10"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
