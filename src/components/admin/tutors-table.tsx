import Link from "next/link";
// import { Download, Search } from "lucide-react";
import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
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
import { TUTOR_STATUSES } from "@/data/constants";
import { formatToReadableId } from "@/utils/formatter";

export function TutorsTable({ tutors }: { tutors: TutorsTableProps }) {
  return (
    <div className="p-6 rounded-xl bg-white h-full border border-shade-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base text-high font-semibold">Tutors List</h3>
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
            <SelectTrigger className="w-fit h-10 text-high bg-white border border-shade-3 rounded-lg px-4 py-3 focus:ring-0 shadow-none text-sm">
              <SelectValue placeholder="Status" className="capitalize" />
            </SelectTrigger>

            <SelectContent>
              {TUTOR_STATUSES.map((tutorStatus, index) => (
                <SelectItem value={tutorStatus.status} key={tutorStatus.status + index}>
                  {tutorStatus.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <div>
            <Button variant={"_outline"} className="text-orange border border-orange shadow-none py-3 px-4 h-10">
              <span>Export List</span>

              <Download />
            </Button>
          </div> */}
        </div>
      </div>

      <div className="h-[388px] overflow-y-scroll hide-scrollbar">
        {tutors.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="text-low text-sm font-semibold">
                <TableHead>Tutor ID</TableHead>
                <TableHead>Name</TableHead>

                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="space-y-3">
              {tutors.map((tutor) => (
                <TableRow
                  className="text-sm text-high bg-offwhite h-12"
                  key={tutor.id + tutor.status}
                >
                  <TableCell className="capitalize">
                    {formatToReadableId(tutor.id, "TUTR")}
                  </TableCell>
                  <TableCell className="capitalize">{tutor.name}</TableCell>

                  <TableCell>{tutor.email}</TableCell>
                  <TableCell
                    className={cn(
                      "capitalize font-medium text-high",
                      tutor.status === "active" && "text-success",
                      tutor.status === "unverified" && "text-orange",
                      (tutor.status === "suspended" || tutor.status === "deactivated") &&
                        "text-danger",
                      tutor.status === "invited" && "text-success-light",
                    )}
                  >
                    {tutor.status}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/tutors/${tutor.id}`}>
                      <button className="font-bold text-orange hover:underline">View</button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm mt-4 text-low">No Tutors Found</p>
        )}
      </div>
    </div>
  );
}
