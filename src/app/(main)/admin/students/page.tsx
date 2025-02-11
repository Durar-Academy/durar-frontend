"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";
import { OverviewCard } from "@/components/admin/overview-card";
import { StudentsTable } from "@/components/admin/students-table";

import { useCurrentUser } from "@/hooks/useAccount";
import { useStudents, useStudentsMetrics } from "@/hooks/useAdmin";
import { processStudents, processStudentsMetrics } from "@/utils/processor";

export default function StudentsManagementPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: studentsMetrics, isLoading: studentsMetricsLoading } = useStudentsMetrics();
  const { data: students, isLoading: studentsLoading } = useStudents();

  const allStudentsMetrics = processStudentsMetrics(studentsMetrics ?? []);
  const allStudents = processStudents(students?.records ?? []);

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
            <StudentsTable students={allStudents} />
          </div>
        )}
      </div>
    </section>
  );
}
