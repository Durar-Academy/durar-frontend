import { Search } from "lucide-react";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { ASSIGNMENT_STATUSES } from "@/data/constants";

export function AssignmentListTable({ assignments }: { assignments: AssignmentsListTableProps }) {
  return (
    <div className="rounded-xl p-6 border border-shade-2 bg-white h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base text-high font-semibold">Assignments</h3>

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

      <div className="min-h-[280px] overflow-y-scroll hide-scrollbar">
        {assignments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="text-low text-sm font-semibold">
                <TableHead>Assignment Title</TableHead>

                <TableHead>Course</TableHead>

                <TableHead>Status</TableHead>

                <TableHead>Due Date</TableHead>

                <TableHead className="text-center">Submissions</TableHead>

                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="space-y-3">
              {assignments.map((assignment) => (
                <TableRow
                  className="text-sm text-high bg-offwhite h-12"
                  key={assignment.id + assignment.status}
                >
                  <TableCell className="capitalize">{assignment.assignmentTitle}</TableCell>

                  <TableCell className="capitalize">{assignment.courseTitle}</TableCell>

                  <TableCell
                    className={cn(
                      "capitalize font-medium text-high",
                      assignment.status === "graded" && "text-success",
                      assignment.status === "pending" && "text-orange",
                    )}
                  >
                    {assignment.status}
                  </TableCell>

                  <TableCell>{assignment.dueDate}</TableCell>

                  <TableCell className="text-center">{assignment.submissions ?? 0}</TableCell>

                  <TableCell>
                    <Link href={`/admin/assignments/${assignment.id}`}>
                      <button className="font-bold text-orange hover:underline">View</button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm mt-4 text-low">No Assignments found</p>
        )}
      </div>
    </div>
  );
}
