"use client";

import { OverviewCard } from "@/components/admin/overview-card";
import { TopBar } from "@/components/shared/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { AssignmentListTable } from "@/components/admin/assignment-list-table";

import { useCurrentUser } from "@/hooks/useAccount";
import { useAssignmentsMetrics, useAssignments } from "@/hooks/useAdmin";
import { processAssignmentsMetrics, processAssignmentsPage } from "@/utils/processor";

export default function AssignmentPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: assignmentMetrics, isLoading: assignmentMetricsLoading } = useAssignmentsMetrics();
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments();

  const allAssignmentsMetrics = processAssignmentsMetrics(assignmentMetrics ?? []);
  const assignmentsRecords = processAssignmentsPage(assignments?.records ?? []);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext="Manage Assignments" user={user as User}>
            <p className="flex items-center gap-1">Assignments</p>
          </TopBar>
        )}
      </div>

      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-xl">Assignment Overview</h3>
        </div>

        <div className="assignment-overview-cards">
          {assignmentMetricsLoading ? (
            <Skeleton className="w-full rounded-xl h-24" />
          ) : (
            <div className="flex gap-6 h-24">
              {allAssignmentsMetrics.map((assignemnt, index) => (
                <OverviewCard overview={assignemnt} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-[600px]">
        {assignmentsLoading ? (
          <Skeleton className="w-full h-full rounded-xl" />
        ) : (
          <AssignmentListTable assignments={assignmentsRecords} />
        )}
      </div>
    </section>
  );
}
