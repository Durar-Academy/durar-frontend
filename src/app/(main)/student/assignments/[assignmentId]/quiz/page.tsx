"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { TopBar } from "@/components/shared/top-bar";
import { QuizResult, QuizRunner } from "@/components/student/quiz";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAccount";
import { useQuizQuestions, useStartQuizAttempt, useStudentAssignment } from "@/hooks/useStudent";
import {
  buildQuizReview,
  findActiveQuizSubmission,
  findSubmittedQuizSubmission,
  getStudentApiErrorMessage,
  type StudentAssignmentWithQuiz,
  type StudentQuizSubmission,
} from "@/lib/student";

function QuizStateCard({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="bg-white border border-shade-2 rounded-xl p-6 flex flex-col gap-3">
      <h2 className="text-base text-high font-semibold">{title}</h2>

      {text && <p className="text-sm text-low">{text}</p>}

      <div className="flex flex-wrap gap-3">
        {action}

        <Button asChild variant="_outline" className="bg-white border border-shade-3 text-high">
          <Link href="/student/assignments">Back to Assignments</Link>
        </Button>
      </div>
    </div>
  );
}

export default function StudentQuizPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const queryClient = useQueryClient();
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const {
    data: assignment,
    isLoading: assignmentLoading,
    isError: assignmentError,
    refetch,
  } = useStudentAssignment(assignmentId);

  // The student assignment payload embeds the caller's own QuizSubmission rows,
  // so an existing attempt can be detected without a dedicated endpoint.
  const assignmentWithQuiz = assignment as StudentAssignmentWithQuiz | undefined;
  const submittedSubmission = useMemo(
    () => findSubmittedQuizSubmission(assignmentWithQuiz),
    [assignmentWithQuiz],
  );
  const activeSubmission = useMemo(
    () => findActiveQuizSubmission(assignmentWithQuiz),
    [assignmentWithQuiz],
  );
  const isQuiz = assignmentWithQuiz?.type === "quiz";

  const [startedAttempt, setStartedAttempt] = useState<StudentQuizSubmission | null>(null);
  const [gradedSubmission, setGradedSubmission] = useState<StudentQuizSubmission | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const startRequestedRef = useRef(false);

  const attempt = startedAttempt ?? activeSubmission;

  // Questions do not depend on the attempt, so they load in parallel with the
  // start call. A submitted attempt never needs them.
  const questionsQuery = useQuizQuestions(assignmentId, {
    enabled: Boolean(assignmentWithQuiz) && isQuiz && !submittedSubmission,
  });
  const questions = questionsQuery.data ?? [];

  const { mutate: startQuiz } = useStartQuizAttempt();

  const beginAttempt = useCallback(() => {
    setStartError(null);

    startQuiz(assignmentId, {
      onSuccess: (submission) => {
        // The API answers 201 for a first start and for a resume alike.
        if (submission?.id) setStartedAttempt(submission);
        else setStartError("The quiz attempt could not be started. Please try again.");
      },
      onError: async (error) => {
        // Defensive against the older start behaviour: a second call can fail
        // even though an attempt exists. Re-read the payload and adopt it.
        const refreshed = await refetch();
        const recovered = findActiveQuizSubmission(refreshed.data as StudentAssignmentWithQuiz | undefined);

        if (recovered) {
          setStartedAttempt(recovered);
          return;
        }

        setStartError(getStudentApiErrorMessage(error, "Unable to start this quiz. Please try again."));
      },
    });
  }, [assignmentId, refetch, startQuiz]);

  useEffect(() => {
    if (!assignmentWithQuiz || !isQuiz || submittedSubmission || attempt) return;
    if (startRequestedRef.current) return;

    startRequestedRef.current = true;
    beginAttempt();
  }, [assignmentWithQuiz, isQuiz, submittedSubmission, attempt, beginAttempt]);

  const retryStart = () => {
    startRequestedRef.current = true;
    beginAttempt();
  };

  let content: ReactNode;

  if (currentUserLoading || assignmentLoading) {
    content = <Skeleton className="rounded-xl w-full h-[420px]" />;
  } else if (assignmentError || !assignmentWithQuiz) {
    content = (
      <QuizStateCard
        title="Assignment unavailable"
        text="We could not load this assignment. Please go back and try again."
      />
    );
  } else if (!isQuiz) {
    content = (
      <QuizStateCard
        title="This assignment is not a quiz"
        text="Written assignments are submitted from their own page."
      />
    );
  } else if (gradedSubmission) {
    content = (
      <QuizResult
        title={assignmentWithQuiz.title}
        grade={gradedSubmission.grade}
        submittedAt={gradedSubmission.timeSubmitted}
        totalQuestions={gradedSubmission.totalQuestions}
        review={buildQuizReview(questions, gradedSubmission)}
      />
    );
  } else if (submittedSubmission) {
    content = (
      <QuizResult
        title={assignmentWithQuiz.title}
        grade={submittedSubmission.grade}
        submittedAt={submittedSubmission.timeSubmitted}
        totalQuestions={submittedSubmission.totalQuestions}
      />
    );
  } else if (startError) {
    content = (
      <QuizStateCard
        title="We could not start your quiz"
        text={startError}
        action={
          <Button className="bg-orange hover:bg-burnt text-white" variant="_default" onClick={retryStart}>
            Try again
          </Button>
        }
      />
    );
  } else if (questionsQuery.isError) {
    content = (
      <QuizStateCard
        title="We could not load the questions"
        text="Check your connection and try again."
        action={
          <Button
            className="bg-orange hover:bg-burnt text-white"
            variant="_default"
            onClick={() => void questionsQuery.refetch()}
          >
            Try again
          </Button>
        }
      />
    );
  } else if (!attempt || questionsQuery.isLoading) {
    content = <Skeleton className="rounded-xl w-full h-[420px]" />;
  } else if (questions.length === 0) {
    // Submitting an empty quiz would divide by zero while grading.
    content = (
      <QuizStateCard
        title="No questions yet"
        text="This quiz does not have any questions yet. Please check back later."
      />
    );
  } else {
    content = (
      <QuizRunner
        title={assignmentWithQuiz.title}
        attemptId={attempt.id}
        questions={questions}
        durationMs={assignmentWithQuiz.duration ?? null}
        timeStarted={attempt.timeStarted ?? null}
        randomnize={Boolean(assignmentWithQuiz.randomnize)}
        initialAnswers={attempt.answers ?? null}
        onSubmitted={(submission) => {
          setGradedSubmission(submission);
          queryClient.invalidateQueries({ queryKey: ["student-assignment", assignmentId] });
          queryClient.invalidateQueries({ queryKey: ["all-student-assignments"] });
        }}
        onAlreadySubmitted={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar
            subtext={assignment?.title ? `Quiz - ${assignment.title}` : "Quiz"}
            user={user as User}
          >
            <p className="flex items-center gap-1">
              <Link href={"/student/assignments"} className="hover:underline">
                Assignments
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span>Quiz</span>
            </p>
          </TopBar>
        )}
      </div>

      {content}
    </section>
  );
}
