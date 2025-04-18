"use client";

import { TopBar } from "@/components/shared/top-bar";
import { CourseCard } from "@/components/student/courses-card";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAccount";
import { useCourses } from "@/hooks/useAdmin";

export default function CoursesPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: courses, isLoading: coursesLoading } = useCourses({ status: "published" });

  console.log("ALL COURSES", courses);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={"Choose your desired course"} user={user as User}>
            Courses
          </TopBar>
        )}
      </div>

      {/* <p className="text-high text-base leading-5 tracking-normal">
          Learning Progress: <span className="font-bold">50%</span>
          </p> */}

      <div>
        {coursesLoading ? (
          <Skeleton className="rounded-xl h-40" />
        ) : (
          <div className="bg-white rounded-xl p-6 flex flex-col gap-6">
            {courses && courses.length > 0 ? (
              <div className="grid grid-cols-5 gap-3">
                {courses.map((course, index) => (
                  <CourseCard
                    key={course.title + index}
                    name={course.title}
                    thumbnail={course.thumbnailId ?? ""}
                    progress={course.UserCourse[0].progress}
                    id={course.id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-low text-base">No courses yet.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
