"use client";
import AssignmentTable from "@/components/tutor/Assignment-component/AssignmentListTable";
import { useCurrentUser } from "@/hooks/useAccount";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useTutorAssignments } from "@/hooks/tutorQueries";
import { processTutorAssignments, processTutorAssignmentMetrics } from "@/utils/tutorProcessor";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { NEW_ASSIGNMENT_OPTIONS } from "@/data2/constants";
import { Top_Bar } from "@/components/tutor/top-bar";
import {OverviewCard} from "@/components/tutor/overview-card";

const Page = () => {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: assignmentsData, isLoading: assignmentsLoading } = useTutorAssignments({ page });
  const assignments = processTutorAssignments(assignmentsData);
  const metrics = processTutorAssignmentMetrics(assignments);

  const handleValueChange = (value: string) => {
    const selectedOption = NEW_ASSIGNMENT_OPTIONS.find(
      (option) => option.label === value
    );
    if (selectedOption) {
      router.push(selectedOption.url);
    }
  };
  return (
    <section className="flex flex-col gap-3">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <Top_Bar subtext="Manage Assignments" user={user as User}>
            <p className="flex items-center gap-1">Assignments</p>
          </Top_Bar>
        )}
      </div>

      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-xl">Assignment Overview</h3>

          <Select onValueChange={handleValueChange}>
            <SelectTrigger className="w-fit h-10 bg-orange text-white rounded-xl text-sm px-4 py-3 focus:ring-0">
              <SelectValue
                placeholder={
                  <p className="flex gap-1 items-center">
                    <Plus className="w-5 h-5" /> <span>Add New</span>
                  </p>
                }
              />
            </SelectTrigger>

            <SelectContent>
              {NEW_ASSIGNMENT_OPTIONS.map((option, index) => (
                <SelectItem
                  value={option.label}
                  key={option.label + index}
                  className="capitalize"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="assignment-overview-cards">
          {assignmentsLoading ? (
            <Skeleton className="w-full rounded-xl h-24" />
          ) : (
            <div className="flex gap-6 h-24">
              {metrics.map((metric, index) => (
                <OverviewCard overview={metric} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="bg-white p-6 border-[1px] border-[#E7E8EE] rounded-xl">
        <AssignmentTable page={page} setPage={setPage} />
      </section>
    </section>
  );
};

export default Page;
