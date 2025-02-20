"use client";

import { Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function CourseList({
  courses,
  courseId,
  setCourseId,
}: {
  courses: Course[];
  courseId: string;
  setCourseId: Dispatch<SetStateAction<string>>;
}) {
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
    <div className="w-full max-w-[300px] shrink-0 rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h4 className="text-low font-semibold text-base">Courses List</h4>

        <div className="relative w-[120px]">
          <Input
            className="w-full text-sm h-10 px-4 pr-10 rounded-lg border border-shade-3 bg-white shadow-none placeholder:text-low focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
            placeholder="Search..."
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-low" />
        </div>
      </div>

      <div className="h-full flex flex-col gap-4 overflow-hidden">
        <h5 className="flex gap-14 items-center text-low font-semibold text-sm">
          <span>ID</span>
          <span>Name</span>
        </h5>

        <div
          className="h-full overflow-y-scroll hide-scrollbar flex flex-col gap-3"
          onClick={handleListClick}
        >
          {courses.length > 0 ? (
            courses.map((course, index: number) => (
              <div
                key={course.id + course.title}
                data-course-id={course.id}
                className={cn(
                  "rounded-xl border border-shade-3 bg-offwhite min-h-12 p-3 text-high text-sm flex gap-8 items-center cursor-pointer transition-colors",
                  courseId === course.id && "text-orange bg-light border-orange/10",
                )}
              >
                <span>{String(index + 1).padStart(3, "0")}</span>
                <span>{course.title}</span>
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
