"use client";

import React from "react";
import AssignmentStatCard from "./Assignment-component/AssignmentStatCard";
import AssignmentTable from "./Profile-component/AssignmentTable";
import { useStudentAssignments } from "@/hooks/tutorQueries";
import { processStudentAssignments, processStudentAssignmentMetrics } from "@/utils/processor";
import { Skeleton } from "@/components/ui/skeleton";

interface AssignmentProps {
  studentId: string;
}

const Assignment = ({ studentId }: AssignmentProps) => {
  const { data: assignmentsData, isLoading, error } = useStudentAssignments({
    userId: studentId,
  });

  const assignments = processStudentAssignments(assignmentsData?.records ?? []);
  const metrics = processStudentAssignmentMetrics(assignmentsData?.records ?? []);

  if (error) {
    console.error("Error fetching assignments:", error);
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="rounded-xl p-6 border border-shade-2 flex flex-col gap-4 bg-white">
        <h1 className="text-low font-medium">Assignment Overview</h1>
        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <AssignmentStatCard
                key={index}
                title={metric.title}
                value={metric.value}
              />
            ))}
          </div>
        )}
      </div>
      <div className="rounded-xl p-6 border border-shade-2 flex flex-col gap-4 bg-white">
        {isLoading ? (
          <Skeleton className="h-[400px] rounded-xl" />
        ) : (
          <AssignmentTable assignments={assignments} />
        )}
      </div>
    </section>
  );
};

export default Assignment;
