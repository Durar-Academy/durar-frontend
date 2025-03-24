"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";
import { CourseCard } from "@/components/student/courses-card";

import { useCurrentUser } from "@/hooks/useAccount";

import { studentCourses } from "@/data/mockData";

export default function CoursesPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

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

      <div className="bg-shade-1 rounded-xl p-6 flex flex-col gap-6">
        <p className="text-high text-base leading-5 tracking-normal">
          Learning Progress: <span className="font-bold">50%</span>
        </p>

        <div className="grid grid-cols-5 gap-3">
          {studentCourses.map((course) => (
            <CourseCard
              key={course.title}
              name={course.title}
              thumbnail={course.image}
              progress={course.progress}
              link={""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
