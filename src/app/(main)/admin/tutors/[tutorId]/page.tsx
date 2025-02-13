"use client";

import { useParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { UserOverviewCard } from "@/components/admin/user-overview-card";

import { useTutor } from "@/hooks/useAdmin";

export default function StudentManagementPage() {
  const { tutorId } = useParams();

  const { data: tutor, isLoading: tutorLoading } = useTutor(tutorId as string);

  return (
    <div>
      {tutorLoading ? (
        <Skeleton className="h-[200px] rounded-xl" />
      ) : (
        <UserOverviewCard user={tutor} />
      )}
    </div>
  );
}
