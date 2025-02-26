"use client";

import { useParams } from "next/navigation";

import { DisplayList } from "@/components/admin/display-list";
import { Skeleton } from "@/components/ui/skeleton";

import { useTutorActivities } from "@/hooks/useAdmin";

export default function TutorManagementActivityLogPage() {
  const { tutorId } = useParams();
  const { data: tutorActivities, isLoading: tutorActivitiesLoading } = useTutorActivities(
    tutorId as string,
  );

  const allTutorActivities: Activity[] = tutorActivities?.records ?? [];

  return (
    <div className="p-6 rounded-xl bg-white border border-shade-2">
      <div className="mb-6">
        <h3 className="text-low font-medium text-base leading-5">Recent Activities</h3>
      </div>

      <div className="flex flex-col gap-3">
        {tutorActivitiesLoading ? (
          <>
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </>
        ) : allTutorActivities.length > 0 ? (
          allTutorActivities.map((tutorActivity, index) => (
            <DisplayList
              text={tutorActivity.context}
              date={tutorActivity.createdAt as unknown as Date}
              key={index}
            />
          ))
        ) : (
          <p className="text-low text-sm">No Activities Found</p>
        )}
      </div>
    </div>
  );
}
