"use client";

import { useCallback, useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/shared/top-bar";
import { OverviewCard } from "@/components/admin/overview-card";
import { StudentsTable } from "@/components/admin/students-table";

import { useCurrentUser } from "@/hooks/useAccount";
import { useStudents, useStudentsMetrics } from "@/hooks/useAdmin";
import { processStudents, processStudentsMetrics } from "@/utils/processor";

export default function StudentsManagementPage() {
  const [filters, setFilters] = useState<SearchFilters>({ page: 1, limit: 20 });
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: studentsMetrics, isLoading: studentsMetricsLoading } = useStudentsMetrics();
  // Keep the unfiltered view broad, but send a selected status to the API.
  const studentQueryFilters = filters.status ? { status: filters.status } : undefined;
  const { data: students, isLoading: studentsLoading } = useStudents(studentQueryFilters);

  const handleStatusChange = useCallback((status: SearchFilters["status"] | undefined) => {
    setFilters((current) => ({ ...current, status, page: 1 }));
  }, []);
  const handlePageChange = useCallback((page: number) => {
    setFilters((current) => ({ ...current, page }));
  }, []);

  const allStudentsMetrics = processStudentsMetrics(studentsMetrics ?? []);
  const allStudents = processStudents(students ?? []);

  // The full list is fetched once and shown unfiltered until a status is picked,
  // so selecting "All statuses" always returns to every student.
  const filteredStudents = filters.status
    ? allStudents.filter((student) => student.status === filters.status)
    : allStudents;

  const pageSize = filters.limit ?? 20;
  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  // Clamp the page so a list that shrinks after a refetch can't leave the admin
  // stranded on an empty page.
  const currentPage = Math.min(Math.max(filters.page ?? 1, 1), pageCount);
  const pageStart = (currentPage - 1) * pageSize;
  const paginatedStudents = filteredStudents.slice(pageStart, pageStart + pageSize);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext="View & manage all students" user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={"/admin"} className="hover:underline">
                Users
              </Link>
              <ChevronRight className="h-4 w-4" /> <span>Students</span>
            </p>
          </TopBar>
        )}
      </div>

      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-xl">Students Overview</h3>

          <Button asChild className="h-10 rounded-lg px-4">
            <Link href="/admin/students/add-student" className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Student
            </Link>
          </Button>
        </div>

        <div className="students-overview-cards">
          {studentsMetricsLoading ? (
            <Skeleton className="w-full rounded-xl h-24" />
          ) : (
            <div className="flex gap-6 h-24">
              {allStudentsMetrics.map((studentMetrics, index) => (
                <OverviewCard overview={studentMetrics} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        {studentsLoading ? (
          <Skeleton className="w-full h-[500px] rounded-xl" />
        ) : (
          <div className="h-[500px]">
            <StudentsTable
              students={paginatedStudents}
              status={filters.status}
              onStatusChange={handleStatusChange}
              page={currentPage}
              hasNextPage={currentPage < pageCount}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </section>
  );
}
