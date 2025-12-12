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
import { useTutorAssignments } from "@/hooks/tutorQueries";
import { processTutorAssignments } from "@/utils/tutorProcessor";
import { Skeleton } from "@/components/ui/skeleton";

interface AssignmentTableProps {
  page: number;
  setPage: (page: number) => void;
}

export default function AssignmentTable({
  page,
  setPage,
}: AssignmentTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Completed" | "Pending"
  >("All");
  const [courseFilter, setCourseFilter] = useState("All");

  const { data: assignmentsData, isLoading } = useTutorAssignments({ page });
  const assignments = processTutorAssignments(assignmentsData);

  const courses = Array.from(
    new Set(assignments.map((assignment) => assignment.course))
  ).sort();

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(search.toLowerCase()) ||
      assignment.course.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || assignment.status === statusFilter;
    const matchesCourse =
      courseFilter === "All" || assignment.course === courseFilter;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const handlePreviousPage = () => {
    if (assignmentsData?.metaData.hasPreviousPages) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (assignmentsData?.metaData.hasNextPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center w-full gap-3">
        <h2 className="text-xl font-semibold">Assignment Lists</h2>
        <span className="flex-1"></span>
        <div className="h-11 rounded-lg border-[#D2D4E0] border-[1px] flex items-center justify-center p-3">
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm border-none outline-none text-sm"
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
              {statusFilter === "All" ? "Status" : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("All")}>
              All
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
            {courses.map((course, i) => (
              <DropdownMenuItem key={i} onClick={() => setCourseFilter(course)}>
                {course}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <Skeleton className="w-full h-[300px] rounded-xl" />
      ) : (
        <>
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
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-4 text-sm text-gray-500"
                    >
                      No assignments found
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <tr
                      key={assignment.id}
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
                        {assignment.dueDate}
                      </td>
                      <td className="text-sm py-4 pl-8 border-y-[1px] border-[#D2D4E0]">
                        {assignment.submissions}
                      </td>
                      <td className="text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl text-orange cursor-pointer hover:underline">
                        <Link href={`/tutor/assignments/${assignment.id}`}>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={handlePreviousPage}
              disabled={!assignmentsData?.metaData.hasPreviousPages}
              variant="outline"
              className="h-10"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {assignmentsData?.metaData.page ?? 1} of{" "}
              {assignmentsData?.metaData.pageCount ?? 1}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={!assignmentsData?.metaData.hasNextPages}
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
