"use client";
import Image from "next/image";
import { useStudentActivity } from "@/hooks/tutorQueries";
import { processStudentActivity } from "@/utils/tutorProcessor";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ActivityLogProps {
  userId: string;
  page: number;
  setPage: (page: number) => void;
}

const ActivityLog = ({ userId, page, setPage }: ActivityLogProps) => {
  const { data: activityData, isLoading, isError } = useStudentActivity({ userId, page });
  const activities = processStudentActivity(activityData);

  const handlePreviousPage = () => {
    if (activityData?.metaData.hasPreviousPages) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (activityData?.metaData.hasNextPages) {
      setPage(page + 1);
    }
  };

  const totalCount = activityData?.metaData.totalCount?.id ?? 0;
  const perPage = activityData?.metaData.perPage ?? 10;
  const pageCount = Math.ceil(totalCount / perPage);

  return (
    <section className="rounded-lg p-6 border border-shade-3 flex bg-white gap-3 flex-col w-full">
      <h1 className="text-low font-medium mb-3">Recent Activities</h1>
      {isLoading ? (
        <Skeleton className="w-full h-[100px] rounded-xl" />
      ) : isError ? (
        <p className="text-sm text-red-500">Failed to load activities</p>
      ) : activities.length === 0 ? (
        <p className="text-sm text-gray-500">No activities found</p>
      ) : (
        <>
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-[#F8F8FA] border border-shade-3 rounded-xl p-3 flex items-center gap-4"
            >
              <p className="text-sm">{activity.context}</p>
              <p className="text-sm text-low flex items-center gap-1">
                <Image
                  src="/SVGs/dateIcon.svg"
                  alt="Date Icon"
                  height={16}
                  width={16}
                />
                {activity.createdAt}
              </p>
              <span className="flex-1"></span>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={handlePreviousPage}
              disabled={!activityData?.metaData.hasPreviousPages}
              variant="outline"
              className="h-10"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {activityData?.metaData.page ?? 1} of {pageCount || 1}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={!activityData?.metaData.hasNextPages}
              variant="outline"
              className="h-10"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </section>
  );
};

export default ActivityLog;