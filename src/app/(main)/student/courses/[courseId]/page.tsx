"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, Lock, Tv, Unlock } from "lucide-react";

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
import { TopBar } from "@/components/shared/top-bar";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoPlayer } from "@/components/student/video-player";

import { useCurrentUser } from "@/hooks/useAccount";
import { useCourse } from "@/hooks/useAdmin";

export default function SingleCoursePage() {
  const { courseId } = useParams();
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: course, isLoading: courseLoading } = useCourse(courseId as string);

  const unfinishedLesson = course?.Lesson.find((lesson) => lesson.progress < 100);
  const [currentLessonId, setCurrentLessonId] = useState(unfinishedLesson?.id || "");
  const currentLesson = course?.Lesson.find((lesson) => lesson.id === currentLessonId);

  const handleSelectLesson = (lesson: Lesson) => {
    if (lesson.isLocked) return;
    setCurrentLessonId(lesson.id);
  };

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={currentLesson?.title ?? "Current Lesson"} user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={"/courses"} className="hover:underline">
                Courses
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span>{course?.title ?? "Title"}</span>
            </p>
          </TopBar>
        )}
      </div>

      <div className="w-full flex gap-4 h-screen">
        {courseLoading ? (
          <Skeleton className="rounded-xl h-full w-full" />
        ) : (
          <>
            <div className="w-full">
              <VideoPlayer lesson={currentLesson} />

              <div className="p-4 bg-white mt-4 border border-shade-1 rounded-xl">
                <h3 className="text-high text-lg font-medium">{currentLesson?.title}</h3>

                <span className="text-low flex items-center gap-2">
                  <Tv className="w-4 h-4" />
                  {currentLesson?.duration ?? 0} min
                </span>
              </div>

              {/* <div className="mt-4">
                <Accordion
                  type="single"
                  collapsible
                  className="px-6 rounded-xl border border-shade-2 bg-white"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-high text-base">Transcript</AccordionTrigger>
                    <AccordionContent className="text-low text-sm">Some Text Here</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div> */}
            </div>

            <div className="w-full max-w-[300px] flex-col bg-white rounded-xl border border-shade-2 overflow-y-scroll hide-scrollbar hidden xl:flex">
              <h3 className="text-low font-semibold p-4">Course Content</h3>

              <div>
                {course?.Lesson.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson)}
                    className={`p-4 w-full border-b flex flex-col gap-3 ${
                      lesson.isLocked
                        ? "bg-offwhite pointer-events-none"
                        : "cursor-pointer bg-white"
                    }`}
                  >
                    <p className="flex gap-2">
                      <Checkbox
                        className="h-5 w-5 border border-shade-3 shadow-none data-[state=checked]:bg-orange data-[state=checked]:text-white"
                        checked={lesson.isCompleted}
                      />
                      <span className="text-xs font-normal text-high">{lesson.title}</span>
                    </p>

                    <p className="flex items-center justify-between text-xs">
                      <span className="text-low flex items-center gap-2">
                        <Tv className="w-4 h-4" />
                        Duration: {(lesson?.duration / 60).toFixed(1) ?? 0} min
                      </span>

                      <span className="w-4 h-4 text-orange">
                        {lesson.isLocked ? (
                          <Lock className="w-full h-full" />
                        ) : (
                          <Unlock className="w-full h-full" />
                        )}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
