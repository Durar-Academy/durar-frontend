import { Eye } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

export function StudentAssignmentsTable({
  assignments,
}: {
  assignments: StudentAssignmentsTableProps;
}) {
  return (
    <div className="h-full overflow-y-scroll hide-scrollbar">
      {assignments.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="text-low text-sm font-semibold">
              <TableHead>Course</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="space-y-3">
            {assignments.map((assignment) => (
              <TableRow
                className="text-sm text-high bg-offwhite h-12"
                key={assignment.id + assignment.course}
              >
                <TableCell className="capitalize">{assignment.course}</TableCell>
                <TableCell>{assignment.date}</TableCell>
                <TableCell>{assignment.score !== undefined ? `${assignment.score}%` : "-"}</TableCell>
                <TableCell
                  className={cn(
                    "capitalize",
                    assignment.status === "pending" && "text-orange",
                    assignment.status === "submitted" && "text-high",
                    assignment.status === "graded" && "text-success"
                  )}
                >
                  {assignment.status}
                </TableCell>
                <TableCell>
                  <button className="font-bold text-orange">
                    <Eye className="w-4 h-4 text-inherit" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm mt-4 text-low">No Assignments Found</p>
      )}
    </div>
  );
}
