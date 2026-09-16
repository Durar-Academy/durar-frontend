"use client";

import { Search } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CourseList({
  courses,
  courseId,
  setCourseId,
  search,
  status,
  onSearchChange,
  onStatusChange,
}: {
  courses?: Course[];
  courseId: string;
  setCourseId: Dispatch<SetStateAction<string>>;
  search: string;
  status?: CourseStatus;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CourseStatus | undefined) => void;
}) {
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (searchInput !== search) onSearchChange(searchInput);
    }, 350);
    return () => window.clearTimeout(timeoutId);
  }, [searchInput, search, onSearchChange]);

  function handleListClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const courseElement = target.closest("[data-course-id]");

    if (courseElement) {
      const courseId = courseElement.getAttribute("data-course-id");
      if (courseId) {
        setCourseId(courseId);
      }
    }
  }

  return (
    <div className="flex min-h-[360px] min-w-0 w-full flex-col gap-6 rounded-xl border border-shade-2 bg-white p-4 sm:p-6 lg:h-full lg:min-h-0 lg:max-w-[360px]">
      <div className="flex flex-col gap-3">
        <h4 className="text-low font-semibold text-base">Courses List</h4>

        <div className="relative w-full">
          <Input
            className="w-full text-sm h-10 px-4 pr-10 rounded-lg border border-shade-3 bg-white shadow-none placeholder:text-low focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
            placeholder="Search..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-low" />
        </div>
        <Select value={status ?? "all"} onValueChange={(value) => onStatusChange(value === "all" ? undefined : value as CourseStatus)}>
          <SelectTrigger className="h-10 w-full"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-full flex flex-col gap-4 overflow-hidden">
        <h5 className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-3 text-sm font-semibold text-low">
          <span>ID</span>
          <span>Name</span>
        </h5>

        <div
          className="h-full overflow-y-scroll hide-scrollbar flex flex-col gap-3"
          onClick={handleListClick}
        >
          {(courses ?? []).length > 0 ? (
            (courses ?? []).map((course, index: number) => (
              <div
                key={course.id + course.title}
                data-course-id={course.id}
                className={cn(
                  "grid min-h-12 grid-cols-[3rem_minmax(0,1fr)] items-center gap-3 rounded-xl border border-shade-3 bg-offwhite p-3 text-sm text-high cursor-pointer transition-colors",
                  courseId === course.id && "text-orange bg-light border-orange/10",
                )}
              >
                <span>{String(index + 1).padStart(3, "0")}</span>
                <span className="min-w-0 truncate">{course.title}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-low mt-3">No courses yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
