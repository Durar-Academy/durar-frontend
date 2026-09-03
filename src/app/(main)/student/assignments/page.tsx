"use client";

import { CalendarIcon, Search } from "lucide-react";
import { useState } from "react";

import { TopBar } from "@/components/shared/top-bar";
import { AssignmentsTable } from "@/components/student/assignment-table";
import { PendingAssignmentCard } from "@/components/student/pending-assignment-card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ASSIGNMENT_STATUSES } from "@/data/constants";
import { format } from "date-fns";
import { useCurrentUser } from "@/hooks/useAccount";
import { useCourses } from "@/hooks/useAdmin";
import { useAssignments } from "@/hooks/useStudent";

export default function AssignmentsPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [subject, setSubject] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const {
    data: courses,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useCourses({ status: "published", page: 1, limit: 100 });

  const { data: assignments, isLoading: assignmentsLoading } = useAssignments({
    status,
    courseId: subject,
    page: 1,
    limit: 20,
  });
 
  const pendingAssignments: StudentAssignment[] = (assignments ?? []).filter((assignment) => {
    const status = assignment.status?.toLowerCase().replaceAll(" ", "_");
    return status === "pending" || status === "not_submitted";
  });

  const subjectCourses = (courses ?? []).filter(
    (course): course is Course => Boolean(course?.id && course?.title),
  );

  const visibleAssignments: StudentAssignment[] = (assignments ?? [])
    .filter((assignment) => {
      const searchTerm = search.trim().toLowerCase();
      if (searchTerm && !assignment.title.toLowerCase().includes(searchTerm)) return false;
      if (!date) return true;

      return format(new Date(assignment.dueAt), "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    })
    .map((assignment) => ({
      ...assignment,
      course: assignment.course ?? courses?.find((course) => course.id === assignment.courseId),
    }));

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar
            subtext={
              pendingAssignments.length > 0
                ? `${pendingAssignments.length} Pending Assignment(s)`
                : "No Pending Assignments"
            }
            user={user as User}
          >
            Assignment
          </TopBar>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {pendingAssignments.map((assignment) => (
          <PendingAssignmentCard
            key={assignment.id}
            id={assignment.id}
            title={assignment.title}
            mediaId={assignment.mediaId}
          />
        ))}
      </div>

      <div className="rounded-xl p-6 border border-shade-2 bg-white h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base text-high font-semibold">Assignments List</h3>

          <div className="flex gap-3 items-center">
            {/* Search */}
            <div className="relative w-[200px]">
              <Input
                className="w-full text-sm h-10 px-4 pr-10 rounded-lg border border-shade-3 bg-white shadow-none placeholder:text-low focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
                placeholder="Search..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-low" />
            </div>

            {/* Status */}
            <Select
              value={status ?? "__all__"}
              onValueChange={(value) => setStatus(value === "__all__" ? undefined : value)}
            >
              <SelectTrigger className="w-[130px] h-10 text-high bg-white border border-shade-3 rounded-lg text-base px-4 py-3 focus:ring-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="__all__">All</SelectItem>
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

            {/* Subject */}
            <Select
              value={subject ?? "__all__"}
              onValueChange={(value) => setSubject(value === "__all__" ? undefined : value)}
              disabled={coursesLoading || coursesError}
            >
              <SelectTrigger className="w-[140px] h-10 text-high bg-white border border-shade-3 rounded-lg text-base px-4 py-3 focus:ring-0">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="__all__">All Subjects</SelectItem>
                {coursesLoading ? (
                  <SelectItem value="__loading__" disabled>Loading subjects...</SelectItem>
                ) : coursesError ? (
                  <SelectItem value="__error__" disabled>Unable to load subjects</SelectItem>
                ) : subjectCourses.length === 0 ? (
                  <SelectItem value="__empty__" disabled>
                    No published subjects available
                  </SelectItem>
                ) : (
                  subjectCourses.map((course) => (
                    <SelectItem value={course.id} key={course.id} className="capitalize">
                      {course.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!date}
                  className="w-[140px] h-10 justify-start text-left font-normal text-sm text-high border border-shade-3 bg-white shadow-none rounded-lg"
                >
                  <CalendarIcon className="h-4 w-4 text-low shrink-0" />
                  {date ? format(date, "PP") : <span className="text-low">Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {assignmentsLoading ? (
          <Skeleton className="rounded-xl w-full h-64" />
        ) : (
          <AssignmentsTable assignments={visibleAssignments} />
        )}
      </div>
    </section>
  );
}
