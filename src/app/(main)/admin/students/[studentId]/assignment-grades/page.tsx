"use client";

import { Search } from "lucide-react";
import { useParams } from "next/navigation";

import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentAssignmentsTable } from "@/components/admin/student-assignments-table";

import { ASSIGNMENT_STATUSES } from "@/data/constants";
import { useStudentAssignments } from "@/hooks/useAdmin";
import { processStudentAssignments } from "@/utils/processor";

export default function StudentManangementAssignmentGradePage() {
  const { studentId } = useParams();
  const { data: assignments, isLoading: assignmentsLoading } = useStudentAssignments(
    studentId as string
  );

  const studentAssignments = processStudentAssignments(assignments?.records ?? []);

  return (
    <div className="p-6 rounded-xl bg-white border border-shade-2">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-low font-medium text-base leading-5">Assignments</h3>

        <div className="flex gap-3 items-center">
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
              {ASSIGNMENT_STATUSES.map((assignmentStatus, index) => (
                <SelectItem
                  value={assignmentStatus.status}
                  key={assignmentStatus.status + index}
                  className="capitalize"
                >
                  {assignmentStatus.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            <DatePicker />
          </div>
        </div>
      </div>

      <div className="h-[606px]">
        {assignmentsLoading ? (
          <Skeleton className="h-full rounded-xl" />
        ) : (
          <StudentAssignmentsTable assignments={studentAssignments} />
        )}
      </div>
    </div>
  );
}
