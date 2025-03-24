"use client";

import { useState } from "react";
import { ChevronRight, Lock, Tv, Unlock } from "lucide-react";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useCurrentUser } from "@/hooks/useAccount";
import { studentCourse } from "@/data/mockData";

import { VideoPlayer } from "@/components/student/video-player";

export default function SingleCoursePage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

  const [currentLessonId, setCurrentLessonId] = useState(studentCourse.currentLessonId);
  const currentLesson = studentCourse.lessons.find((lesson) => lesson.id === currentLessonId);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={currentLesson?.title ?? "Random Lesson"} user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={"/courses"} className="hover:underline">
                Courses
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span>{studentCourse.courseTitle}</span>
            </p>
          </TopBar>
        )}
      </div>

      <div className="w-full flex gap-4 h-screen">
        <div className="w-full">
          <VideoPlayer lesson={currentLesson} />

          <div className="p-4 bg-white">
            <h3 className="text-high text-lg font-medium">{currentLesson?.title}</h3>

            <span className="text-low flex items-center gap-2">
              <Tv className="w-4 h-4" />
              {currentLesson?.duration} min
            </span>
          </div>

          <div className="mt-4">
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
          </div>
        </div>

        <div
          className="w-full max-w-[300px] flex-col bg-white rounded-xl border
        border-shade-2 overflow-y-scroll hide-scrollbar hidden xl:flex"
        >
          <h3 className="text-low font-semibold p-4">Course Content</h3>

          <div>
            {studentCourse.lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => {
                  if (!lesson.locked) setCurrentLessonId(lesson.id);
                }}
                className={`p-4 w-full border-b flex flex-col gap-3 ${
                  lesson.locked ? "bg-offwhite pointer-events-none" : "cursor-pointer bg-white"
                }`}
              >
                <p className="flex gap-2">
                  <Checkbox
                    className="h-5 w-5 border border-shade-3 shadow-none data-[state=checked]:bg-orange data-[state=checked]:text-white"
                    checked={lesson.completed}
                  />
                  <span className="text-xs font-normal text-high">{lesson.title}</span>
                </p>

                <p className="flex items-center justify-between text-xs">
                  <span className="text-low flex items-center gap-2">
                    <Tv className="w-4 h-4" />
                    {lesson.duration} min
                  </span>

                  <span className="w-4 h-4 text-orange">
                    {lesson.locked ? (
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
      </div>
    </section>
  );
}
