"use client";

import { useParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { OverviewCard } from "@/components/admin/overview-card";
import { StudentCoursesTable } from "@/components/admin/student-courses-table";

import { useStudentCourses, useStudentMetrics } from "@/hooks/useAdmin";
import { processStudentCourses, processStudentMetrics } from "@/utils/processor";

export default function StudentManagementCourseInfoPage() {
  const { studentId } = useParams();
  const { data: studentMetrics, isLoading: studentMetricsLoading } = useStudentMetrics(studentId as string);
  const { data: studentCourses, isLoading: studentCoursesLoading } = useStudentCourses(studentId as string);

  const allStudentMetrics = processStudentMetrics(studentMetrics ?? []);
  const allStudentCourses = processStudentCourses(studentCourses?.records ?? []);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-base">Course Overview</h3>
        </div>

        <div className="students-overview-cards">
          {studentMetricsLoading ? (
            <Skeleton className="w-full rounded-xl h-24" />
          ) : (
            <div className="flex gap-6 h-24">
              {allStudentMetrics.map((studentMetric, index) => (
                <OverviewCard overview={studentMetric} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        {studentCoursesLoading ? (
          <Skeleton className="h-[522px] rounded-xl" />
        ) : (
          <div className="h-[522px]">
            <StudentCoursesTable courses={allStudentCourses} />
          </div>
        )}
      </div>
    </div>
  );
}
