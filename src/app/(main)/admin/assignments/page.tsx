"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { OverviewCard } from "@/components/admin/overview-card";
import { TopBar } from "@/components/shared/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { AssignmentListTable } from "@/components/admin/assignment-list-table";

import { useCurrentUser } from "@/hooks/useAccount";
import { useAssignmentsMetrics, useAssignments } from "@/hooks/useAdmin";
import { processAssignmentsMetrics, processAssignmentsPage } from "@/utils/processor";
import { NEW_ASSIGNMENT_OPTIONS } from "@/data/constants";

export default function AssignmentPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: assignmentMetrics, isLoading: assignmentMetricsLoading } = useAssignmentsMetrics();
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments();
  const router = useRouter();

  const allAssignmentsMetrics = processAssignmentsMetrics(assignmentMetrics ?? []);
  const assignmentsRecords = processAssignmentsPage(assignments?.records ?? []);

  const handleValueChange = (value: string) => {
    const selectedOption = NEW_ASSIGNMENT_OPTIONS.find((option) => option.label === value);
    if (selectedOption) {
      router.push(selectedOption.url);
    }
  };

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

          <Select onValueChange={handleValueChange}>
            <SelectTrigger className="w-fit h-10 bg-orange text-white rounded-xl text-sm px-4 py-3 focus:ring-0">
              <SelectValue
                placeholder={
                  <p className="flex gap-1 items-center">
                    <Plus className="w-5 h-5" /> <span>Add New</span>
                  </p>
                }
              />
            </SelectTrigger>

            <SelectContent>
              {NEW_ASSIGNMENT_OPTIONS.map((option, index) => (
                <SelectItem value={option.label} key={option.label + index} className="capitalize">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
