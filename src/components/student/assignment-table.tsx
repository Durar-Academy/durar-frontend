import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

import { cn } from "@/lib/utils";

export function AssignmentsTable({ assignments }: { assignments: Assignment[] }) {
  return (
    <div className="h-screen overflow-y-scroll hide-scrollbar">
      {assignments.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="text-low text-sm font-semibold">
              <TableHead>Assignment Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Issued - Due Date</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Total Score</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="space-y-3">
            {assignments.map((assignment) => (
              <TableRow
                className="text-sm text-high bg-offwhite h-12"
                key={assignment.id + assignment.status}
              >
                <TableCell className="capitalize">{assignment.title}</TableCell>
                <TableCell className="capitalize">{assignment.course.title}</TableCell>
                <TableCell
                  className={cn(
                    "capitalize font-medium text-high",
                    assignment.type === "assignment" && "text-success",
                    assignment.type === "quiz" && "text-orange",
                  )}
                >
                  {assignment.type}
                </TableCell>
                <TableCell>
                  {format(new Date(assignment.createdAt), "PP")} -{" "}
                  {format(new Date(assignment.dueAt), "PP")}
                </TableCell>
                <TableCell>{assignment.grade}</TableCell>
                <TableCell>{assignment.totalScore}</TableCell>
                <TableCell
                  className={cn(
                    "capitalize font-medium text-high",
                    assignment.status === "graded" && "text-success",
                    assignment.status === "pending" && "text-orange",
                  )}
                >
                  {assignment.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm mt-4 text-low">No Assignments found</p>
      )}
    </div>
  );
}
