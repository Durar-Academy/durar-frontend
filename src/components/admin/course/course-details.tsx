"use client";

import { StarFilledIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
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
  Search,
  Video,
} from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function CourseDetails({ course }: { course: Course }) {
  const studentCount = course.UserCourse.filter((user) => user.role === "student").length;

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
                <p className="text-high text-xl font-semibold">{studentCount}</p>
              </div>

              <div className="bg-offwhite border border-shade-3 rounded-xl p-4 min-h-[72px] w-full space-y-4">
                <p className="text-low text-sm font-medium">Average Ratings</p>

                <p className="text-high text-xl font-semibold flex gap-1 items-center">
                  <StarFilledIcon className="text-[#FEDC66] h-6 w-6 shrink-0" />
                  {course.averageRating.toFixed(1)}
                </p>
              </div>

              <div className="bg-offwhite border border-shade-3 rounded-xl p-4 min-h-[72px] w-full space-y-4">
                <p className="text-low text-sm font-medium">Completion rate</p>
                <p className="text-high text-xl font-semibold">{course.completionRate}%</p>
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

        <TabsContent value="students">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-high text-base font-normal">Enrolled Students</h3>

              <div className="relative w-[156px]">
                <Input
                  className="w-full text-sm h-10 px-4 pr-10 rounded-lg border border-shade-3 bg-white shadow-none placeholder:text-low


            focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
                  placeholder="Search..."
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-low" />
              </div>
            </div>

            <div className="h-full">
              <div className="h-[390px] overflow-y-scroll hide-scrollbar">
                {course.UserCourse.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="text-low text-sm font-semibold">
                        <TableHead>ID</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="text-center">Progress</TableHead>
                        <TableHead className="text-center">Date Enrolled</TableHead>
                        <TableHead className="text-center">Last Active</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody className="space-y-3">
                      {course.UserCourse.map((student, index) => (
                        <TableRow
                          className="text-sm text-high bg-offwhite h-12"
                          key={student.id + index}
                        >
                          <TableCell>{String(index + 1).padStart(3, "0")}</TableCell>
                          <TableCell className="capitalize">
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-high text-center",
                              student.progress === 100 && "text-success",
                              student.progress === 50 && "text-orange",
                            )}
                          >
                            {student.progress === 100 ? "Completed" : `${student.progress}%`}
                          </TableCell>
                          <TableCell className="text-center">
                            {format(new Date(student.startAt as Date), "PP")}
                          </TableCell>
                          <TableCell className="text-center">
                            {format(new Date(student.lastAccessAt as Date), "PP")} |{" "}
                            {format(new Date(student.lastAccessAt as Date), "h:mm a")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm mt-4 text-low">No Students Found</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <div className="flex flex-col gap-4">
            <h3 className="text-high text-base font-normal">Students Reviews</h3>

            <div className="flex flex-col gap-3 overflow-y-scroll h-[400px] hide-scrollbar">
              {course.CourseRating.length > 0 ? (
                course.CourseRating.map((rating) => (
                  <div
                    key={rating.id}
                    className="border border-shade-2 bg-white rounded-xl p-4 space-y-2 min-h-[74px]"
                  >
                    <div className="text-high text-base font-medium flex items-center gap-3">
                      <span>
                        {rating.firstName} {rating.lastName}
                      </span>

                      <span className="flex items-center gap-1">
                        <StarFilledIcon className="text-[#FEDC66] h-4 w-4 shrink-0" />
                        {rating.rating.toFixed(1)}
                      </span>

                      <span className="flex items-center gap-1 text-low font-normal">
                        <Calendar className="text-inherit  h-4 w-4 shrink-0" />
                        {format(new Date(rating.createdAt), "PP")}
                      </span>
                    </div>
                    <p className="text-low text-sm">{rating.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-low text-sm mt-3">No Ratings Found</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
