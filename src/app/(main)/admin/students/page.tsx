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
  const { data: students, isLoading: studentsLoading } = useStudents(filters);
  const handleSearchChange = useCallback((search: string) => {
    setFilters((current) => ({ ...current, search, page: 1 }));
  }, []);
  const handleStatusChange = useCallback((status: SearchFilters["status"] | undefined) => {
    setFilters((current) => ({ ...current, status, page: 1 }));
  }, []);

  const allStudentsMetrics = processStudentsMetrics(studentsMetrics ?? []);
  const allStudents = processStudents(students ?? []);

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
              students={allStudents}
              search={filters.search ?? ""}
              status={filters.status}
              onSearchChange={handleSearchChange}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </div>
    </section>
  );
}
