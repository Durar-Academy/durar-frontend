"use client";

import { useParams } from "next/navigation";

import { DisplayList } from "@/components/admin/display-list";
import { Skeleton } from "@/components/ui/skeleton";

import { useStudentActivities } from "@/hooks/useAdmin";

export default function StudentManagementActivityLogPage() {
  const { studentId } = useParams();
  const { data: studentActivities, isLoading: studentActivitiesLoading } = useStudentActivities(studentId as string);

  const allStudentActivities: Activity[] = studentActivities?.records ?? [];

  return (
    <div className="p-6 rounded-xl bg-white border border-shade-2">
      <div className="mb-6">
        <h3 className="text-low font-medium text-base leading-5">Recent Activities</h3>
      </div>

      <div className="flex flex-col gap-3">
        {studentActivitiesLoading ? (
          <>
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </>
        ) : allStudentActivities.length > 0 ? (
          allStudentActivities.map((studentActivity) => (
            <DisplayList text={studentActivity.context} date={studentActivity.createdAt as unknown as Date} />
          ))
        ) : (
          <p className="text-low text-sm">No Activities Found</p>
        )}
      </div>
    </div>
  );
}
