"use client";

import { useState } from "react";

import { format } from "date-fns";
import {
  Calendar,
  Layers,
  MessagesSquare,
  PanelsTopLeft,
  Search,
} from "lucide-react";
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
import { Top_Bar } from "@/components/tutor/top-bar";
import { GradeSubmissionDialog } from "@/components/tutor/assignment/grade-submission-dialog";
import {
  useQuizSubmissions,
  useStudentSubmissions,
} from "@/hooks/tutorQueries";

const getStudentName = (
  user?: { firstName?: string | null; lastName?: string | null } | null
) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
  "Unnamed student";

export default function SingleAssignmentPage() {
  const { assignmentId } = useParams();

  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: assignmentMetrics, isLoading: assignmentMetricsLoading } =
    useAssignmentMetrics(assignmentId as string);
  const { data: assignment, isLoading: assignmentLoading } = useAssignment(
    assignmentId as string
  );
  const { data: assignmentFeedbacks, isLoading: assignmentFeedbacksLoading } =
    useStudentAssignmentFeedbacks(assignmentId as string);

  const allAssignmentsMetrics = processAssignmentMetrics(
    assignmentMetrics ?? []
  );

  const [submissionsSearch, setSubmissionsSearch] = useState("");
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(
    null
  );

  const isQuiz = assignment?.type === "quiz";

  const { data: submissionsData, isLoading: submissionsLoading } =
    useStudentSubmissions({
      assignmentId: assignmentId as string,
      limit: 100,
      enabled: !isQuiz,
    });
  const { data: quizSubmissions, isLoading: quizSubmissionsLoading } =
    useQuizSubmissions({
      assignmentId: assignmentId as string,
      enabled: isQuiz,
    });

  const normalizedSearch = submissionsSearch.trim().toLowerCase();

  const submissionRows = (submissionsData?.records ?? []).filter((submission) =>
    getStudentName(submission.user).toLowerCase().includes(normalizedSearch)
  );

  const quizSubmissionRows = (quizSubmissions ?? []).filter((submission) =>
    getStudentName(submission.user).toLowerCase().includes(normalizedSearch)
  );

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading || assignmentLoading ? (
          <Skeleton className="w-full rounded-xl h-[100px]" />
        ) : (
          <Top_Bar
            subtext={assignment?.title ?? "Assigment Title"}
            user={user as User}
          >
            <p className="flex items-center gap-1">Assignments</p>
          </Top_Bar>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-shade-2 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-low font-medium text-xl">Assignment Overview</h3>
        </div>

        <div className="assignment-overview-cards">
          {assignmentMetricsLoading ? (
              <Skeleton className="h-24 w-full rounded-xl" />
            ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                    <span className="capitalize">
                      {assignment?.type ?? "Assignment"}
                    </span>
                  </>

                  <>
                    <span>Course</span>

                    <span className="capitalize text-orange">
                      {assignment?.course?.title ?? "Course Title"}
                    </span>
                  </>

                  <>
                    <span>Due Date</span>

                    <span className="capitalize">
                      {format(
                        new Date(assignment?.dueAt ?? Date.now()),
                        "MMM d, yyyy, h:mm a"
                      )}
                    </span>
                  </>

                  <>
                    <span>Max Score</span>

                    <span>{assignment?.totalScore ?? 10}</span>
                  </>

                  <>
                    <span>Late Submission</span>

                    <span>
                      {assignment?.allowLate ? "Allowed" : "Not Allowed"}
                    </span>
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
                    value={submissionsSearch}
                    onChange={(event) => setSubmissionsSearch(event.target.value)}
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-low" />
                </div>
              </div>

              <div className="min-h-[400px] overflow-y-scroll hide-scrollbar">
                {assignmentLoading ||
                (!isQuiz && submissionsLoading) ||
                (isQuiz && quizSubmissionsLoading) ? (
                  <Skeleton className="h-[300px] w-full rounded-xl mt-4" />
                ) : isQuiz ? (
                  quizSubmissionRows.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="text-low text-sm font-semibold">
                          <TableHead>Student Name</TableHead>
                          <TableHead className="text-center">
                            Submission Date
                          </TableHead>
                          <TableHead className="text-center">Score</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody className="space-y-3">
                        {quizSubmissionRows.map((submission) => {
                          const status = submission.gradedAt
                            ? "graded"
                            : submission.timeSubmitted
                              ? "submitted"
                              : "pending";

                          return (
                            <TableRow
                              className="text-sm text-high bg-offwhite h-12"
                              key={submission.id}
                            >
                              <TableCell className="capitalize">
                                {getStudentName(submission.user)}
                              </TableCell>

                              <TableCell className="text-center">
                                {submission.timeSubmitted
                                  ? format(
                                      new Date(submission.timeSubmitted),
                                      "PP"
                                    )
                                  : "—"}
                              </TableCell>

                              <TableCell className="text-center">
                                {submission.grade ?? "—"}
                              </TableCell>

                              <TableCell
                                className={cn(
                                  "text-high text-center capitalize",
                                  status === "submitted" && "text-success",
                                  status === "graded" && "text-high",
                                  status === "pending" && "text-orange"
                                )}
                              >
                                {status}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm mt-4 text-low">
                      {normalizedSearch
                        ? "No submissions match your search."
                        : "No Submissions Found"}
                    </p>
                  )
                ) : submissionRows.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="text-low text-sm font-semibold">
                        <TableHead>Student Name</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">
                          Submission Date
                        </TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody className="space-y-3">
                      {submissionRows.map((submission) => {
                        const status = submission.gradedAt
                          ? "graded"
                          : "submitted";

                        return (
                          <TableRow
                            className="text-sm text-high bg-offwhite h-12"
                            key={submission.id}
                          >
                            <TableCell className="capitalize">
                              {getStudentName(submission.user)}
                            </TableCell>

                            <TableCell
                              className={cn(
                                "text-high text-center capitalize",
                                status === "submitted" && "text-success",
                                status === "graded" && "text-high"
                              )}
                            >
                              {status}
                            </TableCell>

                            <TableCell className="text-center">
                              {format(new Date(submission.createdAt), "PP")}
                            </TableCell>

                            <TableCell className="text-center">
                              {submission.grade ?? "—"}
                            </TableCell>

                            <TableCell className="text-center">
                              <button
                                type="button"
                                className="text-orange hover:underline"
                                onClick={() =>
                                  setGradingSubmissionId(submission.id)
                                }
                              >
                                View
                              </button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm mt-4 text-low">
                    {normalizedSearch
                      ? "No submissions match your search."
                      : "No Submissions Found"}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="feedbacks">
              <div className="flex flex-col gap-4">
                <h3 className="text-high text-base font-normal">
                  Students Feedback
                </h3>

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

                        <p className="text-sm text-high font-normal">
                          {feedback.feedback}
                        </p>
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
      <GradeSubmissionDialog
        submissionId={gradingSubmissionId}
        open={!!gradingSubmissionId}
        onOpenChange={(open) => {
          if (!open) setGradingSubmissionId(null);
        }}
        totalScore={assignment?.totalScore}
      />
    </section>
  );
}
