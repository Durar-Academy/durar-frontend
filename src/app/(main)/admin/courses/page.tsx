"use client";

import {
  Calendar,
  Clock,
  Eye,
  GraduationCap,
  Layers,
  Lock,
  LockOpen,
  MessagesSquare,
  PanelsTopLeft,
  PenLine,
  Plus,
  Search,
  Video,
} from "lucide-react";
import { StarFilledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { format } from "date-fns";

import { OverviewCard } from "@/components/admin/overview-card";
import { TopBar } from "@/components/shared/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { useCurrentUser } from "@/hooks/useAccount";
import { useCoursesMetrics } from "@/hooks/useAdmin";
import { processCoursesMetrics } from "@/utils/processor";
import { sampleCourses } from "@/data/mockData";

function CourseList({
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

function CourseDetails({ course }: { course: Course }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="text-high text-lg font-medium">{course.title}</h3>

        <div className="flex gap-3 items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="font-normal text-sm text-high">Status:</span>

            <Switch
              checked={course.status === "published"}
              disabled
              aria-readonly
              className="disabled:opacity-100"
            />
          </div>

          <Link
            href={""}
            className="flex gap-2 items-center text-orange font-medium hover:underline"
          >
            <Eye className="w-5 h-5 text-inherit shrink-0" />
            <span>Preview</span>
          </Link>

          <Link
            href={""}
            className="flex gap-2 items-center text-orange font-medium hover:underline"
          >
            <PenLine className="w-5 h-5 text-inherit shrink-0" />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full min-h-12 rounded-xl p-4 border border-shade-2 bg-offwhite justify-start text-sm font-normal text-low mb-3">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:text-orange data-[state=active]:bg-transparent data-[state=active]:underline
            data-[state=active]:underline-offset-[16px] decoration-2 bg-transparent rounded-none data-[state=active]:shadow-none gap-2 items-center"
          >
            <PanelsTopLeft className="w-4 h-4 text-inherit" />
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="content"
            className="data-[state=active]:text-orange data-[state=active]:bg-transparent data-[state=active]:underline
            data-[state=active]:underline-offset-[16px] decoration-2 bg-transparent rounded-none data-[state=active]:shadow-none gap-2 items-center"
          >
            <Layers className="w-4 h-4 text-inherit" />
            Content
          </TabsTrigger>

          <TabsTrigger
            value="students"
            className="data-[state=active]:text-orange data-[state=active]:bg-transparent data-[state=active]:underline
            data-[state=active]:underline-offset-[16px] decoration-2 bg-transparent rounded-none data-[state=active]:shadow-none gap-2 items-center"
          >
            <GraduationCap className="w-4 h-4 text-inherit" />
            Students
          </TabsTrigger>

          <TabsTrigger
            value="feedback"
            className="data-[state=active]:text-orange data-[state=active]:bg-transparent data-[state=active]:underline
            data-[state=active]:underline-offset-[16px] decoration-2 bg-transparent rounded-none data-[state=active]:shadow-none gap-2 items-center"
          >
            <MessagesSquare className="w-4 h-4 text-inherit" />
            Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-3">
          <div className="border border-shade-2 rounded-xl p-4 space-y-5">
            <h4 className="text-high font-semibold text-base">Course Statistics</h4>

            <div className="flex gap-3">
              <div className="bg-offwhite border border-shade-3 rounded-xl p-4 min-h-[72px] w-full space-y-4">
                <p className="text-low text-sm font-medium">Enrolled Students</p>
                <p className="text-high text-xl font-semibold">{course.UserCourse.length}</p>
              </div>

              <div className="bg-offwhite border border-shade-3 rounded-xl p-4 min-h-[72px] w-full space-y-4">
                <p className="text-low text-sm font-medium">Average Ratings</p>

                <p className="text-high text-xl font-semibold flex gap-1 items-center">
                  <StarFilledIcon className="text-[#FEDC66] h-6 w-6 shrink-0" />
                  4.5
                </p>
              </div>

              <div className="bg-offwhite border border-shade-3 rounded-xl p-4 min-h-[72px] w-full space-y-4">
                <p className="text-low text-sm font-medium">Completion rate</p>
                <p className="text-high text-xl font-semibold">75%</p>
              </div>
            </div>
          </div>

          <div className="border border-shade-2 rounded-xl p-4 space-y-5">
            <h4 className="text-high font-semibold text-base">Course Information</h4>

            <div className="text-sm font-normal">
              <p className="text-high">Description</p>

              <p className="mt-2 text-low">{course.description}</p>
            </div>

            <div className="text-sm font-normal">
              <p className="text-high">Difficulty Level</p>

              <p className="mt-2 text-low capitalize">
                {course.difficultyLevel ?? "Not Specified"}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="border border-shade-2 rounded-xl p-4 h-full space-y-5">
            <h4 className="text-high font-semibold text-base">Course Content</h4>

            <div className="space-y-6">
              {course.Lesson.map((lesson, index) => (
                <div className="flex gap-3 items-center" key={lesson.id + index}>
                  <div className="w-9 h-9 flex items-center justify-center bg-offwhite rounded-md">
                    <Video className="w-5 h-5 text-orange" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h5>{lesson.title}</h5>

                    <div className="flex gap-3">
                      <p className="flex gap-1 items-center text-low text-sm">
                        <Calendar className="w-4 h-4" />

                        {format(new Date(lesson.createdAt), "PP")}
                      </p>

                      <p className="flex gap-1 items-center text-low text-sm">
                        <Clock className="w-4 h-4" />

                        {format(new Date(lesson.createdAt), "h:mm a")}
                      </p>

                      <p className="flex gap-1 items-center text-low text-sm">
                        {lesson.isLocked ? (
                          <>
                            <Lock className="w-4 h-4 text-orange" />
                            Locked
                          </>
                        ) : (
                          <>
                            <LockOpen className="w-4 h-4 text-orange" />
                            Unlocked
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="students">Change your password here.</TabsContent>

        <TabsContent value="feedback">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}

export default function CoursesManagementPage() {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: coursesMetrics, isLoading: coursesMetricsLoading } = useCoursesMetrics();

  const allCoursesMetrics = processCoursesMetrics(coursesMetrics ?? []);

  const selectedCourse = sampleCourses.find((course) => course.id === selectedCourseId);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext="Manage Courses" user={user as User}>
            <p className="flex items-center gap-1">Courses</p>
          </TopBar>
        )}
      </div>

      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-xl">Courses Overview</h3>

          <Link href={"/admin/courses/new"}>
            <Button variant={"_default"} className="bg-orange hover:bg-burnt px-4 py-2 h-10">
              <Plus className="w-6 h-6" strokeWidth={3} />
              <span>Add Course</span>
            </Button>
          </Link>
        </div>

        <div className="courses-overview-cards">
          {coursesMetricsLoading ? (
            <Skeleton className="w-full rounded-xl h-24" />
          ) : (
            <div className="flex gap-6 h-24">
              {allCoursesMetrics.map((coursesMetrics, index) => (
                <OverviewCard overview={coursesMetrics} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex gap-3 h-[600px]">
        <CourseList
          courses={sampleCourses}
          courseId={selectedCourseId}
          setCourseId={setSelectedCourseId}
        />

        <div className="w-full rounded-xl p-6 border border-shade-2 bg-white">
          {selectedCourse ? (
            <CourseDetails course={selectedCourse} />
          ) : (
            <p className="text-low text-sm mt-3">No course selected.</p>
          )}
        </div>
      </div>
    </section>
  );
}
