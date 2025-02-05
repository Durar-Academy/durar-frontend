"use client";

import { useParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { UserOverviewCard } from "@/components/admin/user-overview-card";

import { useStudent } from "@/hooks/useAdmin";

export default function StudentManagementPage() {
  const { studentId } = useParams();

  const { data: student, isLoading: studentLoading } = useStudent(studentId as string);

  return (
    <div>{studentLoading ? <Skeleton className="h-[200px] rounded-xl" /> : <UserOverviewCard user={student} />}</div>
  );
}
