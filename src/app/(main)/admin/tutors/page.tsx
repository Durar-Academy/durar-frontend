"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";
import { OverviewCard } from "@/components/admin/overview-card";
import { TutorsTable } from "@/components/admin/tutors-table";
import { AddTutorDialog } from "@/components/admin/add-tutor-dialog";

import { useCurrentUser } from "@/hooks/useAccount";
import { useTutors, useTutorsMetrics } from "@/hooks/useAdmin";
import { processTutors, processTutorsMetrics } from "@/utils/processor";

export default function TutorsManagementPage() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: tutorsMetrics, isLoading: tutorsMetricsLoading } = useTutorsMetrics();
  // `GET /user/tutors` accepts `search` (first/last name) and `status`. The
  // unfiltered request keeps its own cache entry, so the timetable editor's
  // tutor list is unaffected.
  const tutorQueryFilters =
    filters.search || filters.status ? { search: filters.search, status: filters.status } : undefined;
  const { data: tutors, isLoading: tutorsLoading } = useTutors(tutorQueryFilters);

  const handleSearchChange = useCallback((search: string) => {
    setFilters((current) => ({ ...current, search }));
  }, []);
  const handleStatusChange = useCallback((status: SearchFilters["status"] | undefined) => {
    setFilters((current) => ({ ...current, status }));
  }, []);

  const allTutorsMetrics = processTutorsMetrics(tutorsMetrics ?? []);
  const allTutors = processTutors(tutors?.records ?? []);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext="View & manage all tutors" user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={"/admin"} className="hover:underline">
                Users
              </Link>
              <ChevronRight className="h-4 w-4" /> <span>Tutors</span>
            </p>
          </TopBar>
        )}
      </div>

      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-xl">Tutors Overview</h3>

          <div>
            <AddTutorDialog />
          </div>
        </div>

        <div className="tutors-overview-cards">
          {tutorsMetricsLoading ? (
            <Skeleton className="w-full rounded-xl h-24" />
          ) : (
            <div className="flex gap-6 h-24">
              {allTutorsMetrics.map((tutorsMetrics, index) => (
                <OverviewCard overview={tutorsMetrics} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-[500px]">
        {tutorsLoading ? (
          <Skeleton className="w-full rounded-xl h-full" />
        ) : (
          <TutorsTable
            tutors={allTutors}
            search={filters.search ?? ""}
            status={filters.status}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </section>
  );
}
