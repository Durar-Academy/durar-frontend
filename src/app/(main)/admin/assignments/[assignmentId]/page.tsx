"use client";

import { format } from "date-fns";
import {
  Calendar,
  ChevronRight,
  Layers,
  MessagesSquare,
  PanelsTopLeft,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OverviewCard } from "@/components/admin/overview-card";
import { TopBar } from "@/components/shared/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useCurrentUser } from "@/hooks/useAccount";
import {
  useAssignment,
  useAssignmentMetrics,
  useStudentAssignmentFeedbacks,
} from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { processAssignmentMetrics } from "@/utils/processor";

export default function SingleAssignmentPage() {
  const { assignmentId } = useParams();

  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: assignmentMetrics, isLoading: assignmentMetricsLoading } = useAssignmentMetrics(
    assignmentId as string,
  );
  const { data: assignment, isLoading: assignmentLoading } = useAssignment(assignmentId as string);
  const { data: assignmentFeedbacks, isLoading: assignmentFeedbacksLoading } =
    useStudentAssignmentFeedbacks(assignmentId as string);

  const allAssignmentsMetrics = processAssignmentMetrics(assignmentMetrics ?? []);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading || assignmentLoading ? (
          <Skeleton className="w-full rounded-xl h-[100px]" />
        ) : (
          <TopBar subtext={assignment?.title ?? "Assigment Title"} user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={"/admin/assignments"} className="hover:underline">
                Assignments
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span>View Details</span>
            </p>
          </TopBar>
        )}
      </div>

      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-xl">Assignment Overview</h3>
        </div>

        <div className="assignment-overview-cards">
          {assignmentMetricsLoading ? (
            <Skeleton className="w-full rounded-xl h-24" />
          ) : (
            <div className="flex gap-6 h-24">
              {allAssignmentsMetrics.map((assignemnt, index) => (
                <OverviewCard overview={assignemnt} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl p-6 border border-shade-2 bg-white">
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
              value="submissions"
              className="data-[state=active]:text-orange data-[state=active]:bg-transparent data-[state=active]:underline
            data-[state=active]:underline-offset-[16px] decoration-2 bg-transparent rounded-none data-[state=active]:shadow-none gap-2 items-center"
            >
              <Layers className="w-4 h-4 text-inherit" />
              Submissions
            </TabsTrigger>

            <TabsTrigger
              value="feedbacks"
              className="data-[state=active]:text-orange data-[state=active]:bg-transparent data-[state=active]:underline
            data-[state=active]:underline-offset-[16px] decoration-2 bg-transparent rounded-none data-[state=active]:shadow-none gap-2 items-center"
            >
              <MessagesSquare className="w-4 h-4 text-inherit" />
              Feedbacks
            </TabsTrigger>
          </TabsList>

          <div className="p-4 rounded-xl border border-shade-2">
            <TabsContent value="overview" className="flex flex-col gap-4">
              <div className="space-y-2">
                <h3 className="text-high text-base font-medium">Description</h3>

                <p className="text-low text-sm font-normal">
                  {assignment?.description ?? "Some Description"}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-high text-base font-medium">Details</h3>

                <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-low text-sm font-normal w-fit">
                  <>
                    <span>Type</span>
                    <span className="capitalize">{assignment?.type ?? "Assignment"}</span>
                  </>

                  <>
                    <span>Course</span>

                    <span className="capitalize text-orange">
                      {assignment?.course.title ?? "Course Title"}
                    </span>
                  </>

                  <>
                    <span>Due Date</span>

                    <span className="capitalize">
                      {format(new Date(assignment?.dueAt ?? Date.now()), "MMM d, yyyy, h:mm a")}
                    </span>
                  </>

                  <>
                    <span>Max Score</span>

                    <span>{assignment?.totalScore ?? 10}</span>
                  </>

                  <>
                    <span>Late Submission</span>

                    <span>{assignment?.allowLate ? "Allowed" : "Not Allowed"}</span>
                  </>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="submissions">
              <div className="flex items-center justify-between">
                <h3 className="text-high text-base font-normal">Submissions</h3>

                <div className="relative w-[156px]">
                  <Input
                    className="w-full text-sm h-10 px-4 pr-10 rounded-lg border border-shade-3 bg-white shadow-none placeholder:text-low focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
                    placeholder="Search..."
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-low" />
                </div>
              </div>

              <div className="min-h-[400px] overflow-y-scroll hide-scrollbar">
                {assignment && assignment.AssignmentSubmission.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="text-low text-sm font-semibold">
                        <TableHead>Student Name</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Submission Date</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody className="space-y-3">
                      {assignment.AssignmentSubmission.map((submission, index) => (
                        <TableRow
                          className="text-sm text-high bg-offwhite h-12"
                          key={submission.id + index}
                        >
                          <TableCell className="capitalize">Awaiting</TableCell>

                          <TableCell
                            className={cn(
                              "text-high text-center capitalize",
                              submission.status === "submitted" && "text-success",
                              submission.status === "graded" && "text-high",
                              submission.status === "pending" && "text-orange",
                            )}
                          >
                            {submission.status}
                          </TableCell>

                          <TableCell className="text-center">
                            {format(new Date(submission.createdAt as Date), "PP")}
                          </TableCell>

                          <TableCell className="text-center">{submission.grade ?? 0}</TableCell>

                          <TableCell className="text-center text-orange">View</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm mt-4 text-low">No Submissions Found</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="feedbacks">
              <div className="flex flex-col gap-4">
                <h3 className="text-high text-base font-normal">Students Feedback</h3>

                <div className="flex flex-col gap-3 overflow-y-scroll min-h-[400px] hide-scrollbar">
                  {assignmentFeedbacksLoading ? (
                    <Skeleton className="h-full rounded-xl" />
                  ) : assignmentFeedbacks && assignmentFeedbacks.length > 0 ? (
                    assignmentFeedbacks.map((feedback) => (
                      <div
                        className="w-full rounded-xl border border-shade-3 bg-offwhite flex flex-col gap-6 px-3 py-4"
                        key={feedback.id}
                      >
                        <div className="flex justify-between items-center text-sm text-high">
                          <p className="flex flex-col gap-2 font-semibold text-base">
                            {feedback.user.firstName} {feedback.user.lastName}
                          </p>

                          <p className="flex gap-2 items-center shrink-0 text-high">
                            <Calendar className="w-4 h-4 text-low" />
                            {format(new Date(feedback.createdAt), "PP")}
                          </p>
                        </div>

                        <p className="text-sm text-high font-normal">{feedback.feedback}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-low text-sm mt-3">No feedbacks found.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
