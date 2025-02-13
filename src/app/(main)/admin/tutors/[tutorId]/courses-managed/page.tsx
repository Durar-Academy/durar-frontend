"use client";

import { useParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { OverviewCard } from "@/components/admin/overview-card";
import { TutorCoursesTable } from "@/components/admin/tutor-courses-table";

import { useTutorCourses, useTutorMetrics } from "@/hooks/useAdmin";
import { processTutorCourses, processTutorMetrics } from "@/utils/processor";

export default function TutorManagementCourseInfoPage() {
  const { tutorId } = useParams();

  const { data: tutorMetrics, isLoading: tutorMetricsLoading } = useTutorMetrics(tutorId as string);
  const { data: tutorCourses, isLoading: tutorCoursesLoading } = useTutorCourses(tutorId as string);

  console.log(tutorCourses);

  const allTutorMetrics = processTutorMetrics(tutorMetrics ?? []);
  const allTutorCourses = processTutorCourses(tutorCourses?.records ?? []);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-base">Courses Managed</h3>
        </div>

        <div className="tutor-overview-cards">
          {tutorMetricsLoading ? (
            <Skeleton className="w-full rounded-xl h-24" />
          ) : (
            <div className="flex gap-6 h-24">
              {allTutorMetrics.map((tutorMetric, index) => (
                <OverviewCard overview={tutorMetric} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        {tutorCoursesLoading ? (
          <Skeleton className="h-[522px] rounded-xl" />
        ) : (
          <div className="h-[522px]">
            <TutorCoursesTable courses={allTutorCourses} />
          </div>
        )}
      </div>
    </div>
  );
}
