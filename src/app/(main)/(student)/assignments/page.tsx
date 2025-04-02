"use client";

import { TopBar } from "@/components/shared/top-bar";
import { AssignmentsTable } from "@/components/student/assignment-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ASSIGNMENT_STATUSES } from "@/data/constants";
import { assignments } from "@/data/mockData";

import { useCurrentUser } from "@/hooks/useAccount";
import { Search } from "lucide-react";
import Image from "next/image";

export default function AssignmentsPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

  const completedAssignments = assignments.filter((assignment) => assignment.status !== "pending");
  const pendingAssignment = assignments.filter((assignment) => assignment.status === "pending");

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar
            subtext={
              pendingAssignment.length > 0 ? `${1} pending payment(s)` : "No Pending Assignments"
            }
            user={user as User}
          >
            Payments
          </TopBar>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {pendingAssignment.map((assignment, index) => (
          <div
            className="w-full h-[180px] rounded-xl relative flex items-center px-14
            border border-shade-2 overflow-hidden"
            key={assignment.id + index}
          >
            <Image
              fill
              alt="Assignment Thumbnail"
              src={"/"}
              className="object-cover object-center z-[0]"
            />

            <div className="absolute inset-0 z-[1] overlay-bg rounded-xl"></div>

            <div className="z-[2]">
              <h3 className="mb-3 text-black text-lg font-semibold">
                {assignment.assignmentTitle}
              </h3>

              <Button className="bg-orange hover:bg-burnt transition-colors">
                Go to Assignment
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-6 border border-shade-2 bg-white h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base text-high font-semibold">Assignments List</h3>

          <div className="flex gap-3">
            <div className="relative w-[200px]">
              <Input
                className="w-full text-sm h-10 px-4 pr-10 rounded-lg border border-shade-3 bg-white shadow-none placeholder:text-low


            focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
                placeholder="Search..."
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-low" />
            </div>

            <Select>
              <SelectTrigger className="w-fit h-10 text-high bg-white border border-shade-3 rounded-lg text-base px-4 py-3 focus:ring-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                {ASSIGNMENT_STATUSES.map((assignment, index) => (
                  <SelectItem
                    value={assignment.status}
                    key={assignment.status + index}
                    className="capitalize"
                  >
                    {assignment.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <AssignmentsTable assignments={completedAssignments} />
      </div>
    </section>
  );
}
