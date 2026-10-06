"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/shared/top-bar";
import { OverviewCard } from "@/components/admin/overview-card";
import { StudentsTable } from "@/components/admin/students-table";

import { useCurrentUser } from "@/hooks/useAccount";
import { useStudentsMetrics, useStudentsPage } from "@/hooks/useAdmin";
import { STUDENTS_PAGE_LIMIT } from "@/lib/admin";
import { processStudents, processStudentsMetrics } from "@/utils/processor";

export default function StudentsManagementPage() {
  const [filters, setFilters] = useState<SearchFilters>({ page: 1 });
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: studentsMetrics, isLoading: studentsMetricsLoading } = useStudentsMetrics();

  // The list is server-paginated at STUDENTS_PAGE_LIMIT. `search`/`status` are
  // only sent when set, so "All statuses" asks the API for every status.
  const { data: studentsPage, isLoading: studentsLoading } = useStudentsPage({
    page: filters.page ?? 1,
    limit: STUDENTS_PAGE_LIMIT,
    search: filters.search,
    status: filters.status,
  });

  const handleStatusChange = useCallback((status: SearchFilters["status"] | undefined) => {
    setFilters((current) => ({ ...current, status, page: 1 }));
  }, []);
  const handleSearchChange = useCallback((search: string) => {
    setFilters((current) => ({ ...current, search, page: 1 }));
  }, []);
  const handlePageChange = useCallback((page: number) => {
    setFilters((current) => ({ ...current, page }));
  }, []);

  const allStudentsMetrics = processStudentsMetrics(studentsMetrics ?? []);
  const students = processStudents(studentsPage?.records ?? []);
  const metaData = studentsPage?.metaData;

  // Clamp the page so a filter change that shrinks the list can't leave the
  // admin stranded on an empty page.
  useEffect(() => {
    if (metaData && metaData.pageCount >= 1 && (filters.page ?? 1) > metaData.pageCount) {
      setFilters((current) => ({ ...current, page: metaData.pageCount }));
    }
  }, [metaData, filters.page]);

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

      <div className="flex flex-col gap-4 rounded-xl border border-shade-2 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
              students={students}
              search={filters.search ?? ""}
              status={filters.status}
              onSearchChange={handleSearchChange}
              onStatusChange={handleStatusChange}
              page={metaData?.page ?? 1}
              pageCount={Math.max(1, metaData?.pageCount ?? 1)}
              totalCount={metaData?.totalCount ?? 0}
              hasNextPage={metaData?.hasNextPages ?? false}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </section>
  );
}
