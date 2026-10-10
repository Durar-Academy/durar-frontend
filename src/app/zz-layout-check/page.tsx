"use client";

import { useEffect, useState } from "react";

import { CourseDetails } from "@/components/admin/course/course-details";
import { CourseList } from "@/components/admin/course/course-list";
import { ReactQueryProvider } from "@/contexts/react-query-provider";

const COURSES = Array.from({ length: 25 }, (_, index) => ({
  id: `course-${index + 1}`,
  title: `Course number ${index + 1}`,
  description: "A temporary description used to exercise the layout checker.",
  thumbnailId: null,
  status: "published",
  language: null,
  category: null,
  difficultyLevel: "beginner",
  enableCertification: false,
  trackProgress: true,
  enableComments: true,
  additionalNotes: null,
  prerequisites: [],
  createdById: "user-1",
  deletedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  Lesson: Array.from({ length: 8 }, (_lesson, lessonIndex) => ({
    id: `lesson-${lessonIndex + 1}`,
    title: `Lesson ${lessonIndex + 1}`,
    createdAt: "2026-01-01T00:00:00.000Z",
    isLocked: lessonIndex % 2 === 0,
  })),
  UserCourse: Array.from({ length: 30 }, (_enrollment, enrollmentIndex) => ({
    id: `enrollment-${enrollmentIndex + 1}`,
    role: "student",
    firstName: `Student${enrollmentIndex + 1}`,
    lastName: "Test",
    progress: (enrollmentIndex * 7) % 101,
    createdAt: "2026-01-01T00:00:00.000Z",
    lastAccessAt: "2026-01-02T10:00:00.000Z",
    user: { firstName: `Student${enrollmentIndex + 1}`, lastName: "Test", role: "student" },
  })),
  averageRating: 4.5,
  CourseRating: [],
  completionRate: 42,
})) as unknown as Course[];

function probe(selector: string) {
  const element = document.querySelector(selector);
  if (!element) return `${selector} :: missing`;
  const style = window.getComputedStyle(element);
  return `${selector} :: clientH=${element.clientHeight} scrollH=${element.scrollHeight} rectH=${Math.round(
    element.getBoundingClientRect().height,
  )} gridRows=${style.gridTemplateRows} overflowY=${style.overflowY}`;
}

function Metrics() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLines([
        `window.innerHeight=${window.innerHeight}`,
        probe('[data-probe="grid"]'),
        probe('[data-probe="list-panel"]'),
        probe('[data-probe="list-panel"] [class*="overflow-y-"]'),
        probe('[data-probe="details-panel"]'),
        probe("main"),
      ]);
    }, 400);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <pre
      data-probe="metrics"
      style={{ position: "fixed", left: 0, top: 0, zIndex: 50, background: "yellow", fontSize: 11 }}
    >
      {lines.join("\n")}
    </pre>
  );
}

export default function LayoutCheckPage() {
  const [selectedCourseId, setSelectedCourseId] = useState(COURSES[0].id);

  return (
    <section className="flex min-h-screen w-full bg-offwhite lg:h-screen lg:overflow-hidden">
      <Metrics />
      <main className="min-w-0 w-full overflow-x-hidden px-4 pb-6 pt-20 sm:px-6 sm:pt-6 lg:h-full lg:overflow-y-auto lg:pt-6">
        <ReactQueryProvider>
          <div
            data-probe="grid"
            className="flex w-full flex-col gap-3 lg:grid lg:h-[600px] lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]"
          >
            <div data-probe="list-panel" className="contents">
              <CourseList
                courses={COURSES}
                courseId={selectedCourseId}
                setCourseId={setSelectedCourseId}
                search=""
                status={undefined}
                onSearchChange={() => undefined}
                onStatusChange={() => undefined}
              />
            </div>

            <div
              data-probe="details-panel"
              className="min-w-0 w-full rounded-xl border border-shade-2 bg-white p-4 sm:p-6"
            >
              <CourseDetails course={COURSES[0]} />
            </div>
          </div>
        </ReactQueryProvider>
      </main>
    </section>
  );
}
