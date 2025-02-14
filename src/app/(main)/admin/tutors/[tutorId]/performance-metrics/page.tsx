"use client";

import { Search } from "lucide-react";
import { useParams } from "next/navigation";
import { format } from "date-fns";

import { OverviewCard } from "@/components/admin/overview-card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewList } from "@/components/admin/review-list";

import { useTutorMetrics } from "@/hooks/useAdmin";
import { processTutorPeformance } from "@/utils/processor";
import { tutorReviews } from "@/data/mockData";

export default function TutorManangementPerformaceMetricsPage() {
  const { tutorId } = useParams();
  const { data: tutorMetrics, isLoading: tutorMetricsLoading } = useTutorMetrics(tutorId as string);

  const allTutorMetrics = processTutorPeformance(tutorMetrics ?? []);

  return (
    <div className="flex flex-col gap-3">
      <div className="p-6 rounded-xl bg-white border border-shade-2">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-low font-medium text-base leading-5">Performance Ratings</h3>
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

      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4 h-[518px]">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-base">Reviews</h3>

          <div className="flex gap-3 items-center">
            <div className="relative w-[200px]">
              <Input
                className="w-full text-sm h-10 px-4 pr-10 rounded-lg border border-shade-3 bg-white shadow-none placeholder:text-low


            focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
                placeholder="Search..."
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-low" />
            </div>

            <div>
              <DatePicker />
            </div>
          </div>
        </div>

        <div className="h-full overflow-y-scroll hide-scrollbar grid grid-cols-2 gap-3">
          {tutorReviews.map((review, index) => (
            <div>
              <ReviewList
                key={index}
                studentName={review.student}
                course={review.course}
                date={format(new Date(review.createdAt), "PP")}
                review={review.review}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
