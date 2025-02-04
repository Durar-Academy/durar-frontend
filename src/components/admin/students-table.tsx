import { Download, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { STUDENT_STATUSES } from "@/data/constants";

export function StudentsTable({ students }: { students: StudentsTableProps }) {
  return (
    <div className="p-6 rounded-xl bg-white h-full border border-shade-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base text-high font-semibold">Students List</h3>

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
            <SelectTrigger className="w-fit h-10 text-high bg-white border border-shade-3 rounded-lg text-base px-4 py-3 focus:ring-0 shadow-none">
              <SelectValue placeholder="Status" className="capitalize" />
            </SelectTrigger>

            <SelectContent>
              {STUDENT_STATUSES.map((studentStatus, index) => (
                <SelectItem value={studentStatus} key={studentStatus + index} className="capitalize">
                  {studentStatus}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            <Button variant={"_outline"} className="text-orange border border-orange shadow-none py-3 px-4 h-10">
              <span>Export List</span>

              <Download />
            </Button>
          </div>
        </div>
      </div>

      <div className="h-[388px] overflow-y-scroll hide-scrollbar">
        {true ? (
          <Table>
            <TableHeader>
              <TableRow className="text-low text-sm font-semibold">
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="space-y-3">
              {students.map((student) => (
                <TableRow className="text-sm text-high bg-offwhite h-12" key={student.id + student.status}>
                  <TableCell className="capitalize">{student.id}</TableCell>
                  <TableCell className="capitalize">{student.name}</TableCell>
                  <TableCell className="capitalize">{student.category}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell
                    className={cn(
                      "capitalize font-medium text-high",
                      student.status === "active" && "text-success",
                      student.status === "inactive" && "text-orange",
                      student.status === "suspended" && "text-danger"
                    )}
                  >
                    {student.status}
                  </TableCell>
                  <TableCell>
                    <button className="font-bold text-orange">View</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No Students Found</p>
        )}
      </div>
    </div>
  );
}
