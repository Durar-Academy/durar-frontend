"use client";

import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { OverviewCard } from "@/components/admin/overview-card";
import { TopBar } from "@/components/shared/top-bar";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAccount";
import { useAssignment, useAssignmentMetrics } from "@/hooks/useAdmin";
import { processAssignmentMetrics } from "@/utils/processor";

export default function SingleAssignmentPage() {
  const { assignmentId } = useParams();

  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: assignmentMetrics, isLoading: assignmentMetricsLoading } = useAssignmentMetrics(
    assignmentId as string,
  );
  const { data: assignment, isLoading: assignmentLoading } = useAssignment(assignmentId as string);

  const allAssignmentsMetrics = processAssignmentMetrics(assignmentMetrics ?? []);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading || assignmentLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext={assignment?.title ?? "Assigment Title"} user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={"/admin/assignments"} className="hover:underline">
                Assignments
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span>View Details</span>
            </p>
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
    </section>
  );
}
