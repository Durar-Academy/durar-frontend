"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { format } from "date-fns";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  formatQuizAnswerValue,
  getStudentApiErrorMessage,
  saveQuizAnswers,
  type QuizReviewEntry,
  type StudentQuizAnswerPayload,
  type StudentQuizAnswerValue,
  type StudentQuizQuestion,
  type StudentQuizSubmission,
} from "@/lib/student";
import { cn } from "@/lib/utils";

/** Unsaved answers are pushed to the draft endpoint about this often. */
const DRAFT_SAVE_INTERVAL_MS = 20_000;

const TRUE_OR_FALSE_OPTIONS = [
  { label: "True", value: "true" },
  { label: "False", value: "false" },
] as const;

const REVIEW_STATUS_CLASS: Record<QuizReviewEntry["status"], string> = {
  correct: "bg-success/20 text-success-light",
  incorrect: "bg-danger/10 text-danger",
  unanswered: "bg-shade-1 text-low",
};

const REVIEW_STATUS_LABEL: Record<QuizReviewEntry["status"], string> = {
  correct: "Correct",
  incorrect: "Incorrect",
  unanswered: "Not answered",
};

type DraftStatus = "idle" | "saving";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapWith]] = [copy[swapWith], copy[index]];
  }

  return copy;
}

/** Radix radio/checkbox values must be non-empty and unique. */
function cleanOptions(options: string[] | null | undefined): string[] {
  if (!Array.isArray(options)) return [];

  return Array.from(new Set(options.filter((option) => typeof option === "string" && option.trim().length > 0)));
}

function isAnswered(value: StudentQuizAnswerValue | undefined): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;

  return typeof value === "boolean";
}

function toAnswerMap(
  answers: StudentQuizAnswerPayload[] | null | undefined,
  validQuestionIds: Set<string>,
): Record<string, StudentQuizAnswerValue> {
  const map: Record<string, StudentQuizAnswerValue> = {};
  if (!Array.isArray(answers)) return map;

  for (const entry of answers) {
    if (!entry || typeof entry.questionId !== "string" || !validQuestionIds.has(entry.questionId)) continue;

    const { answer } = entry;
    if (typeof answer === "string" || typeof answer === "boolean" || Array.isArray(answer)) {
      map[entry.questionId] = answer;
    }
  }

  return map;
}

/** Unanswered questions are left out: the backend grades against every question. */
function toAnswerPayload(
  answers: Record<string, StudentQuizAnswerValue>,
  validQuestionIds: Set<string>,
): StudentQuizAnswerPayload[] {
  return Object.entries(answers)
    .filter(([questionId, value]) => validQuestionIds.has(questionId) && isAnswered(value))
    .map(([questionId, answer]) => ({ questionId, answer }));
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

function isAlreadySubmittedError(message: string): boolean {
  return /already been submitted|already started/i.test(message);
}

type QuizRunnerProps = {
  title: string;
  attemptId: string;
  questions: StudentQuizQuestion[];
  /** Milliseconds: the assignment creation form stores minutes * 60_000. */
  durationMs?: number | null;
  timeStarted?: string | Date | null;
  randomnize?: boolean;
  initialAnswers?: StudentQuizAnswerPayload[] | null;
  onSubmitted?: (submission: StudentQuizSubmission) => void;
  onAlreadySubmitted?: () => void;
};

/**
 * The quiz attempt runner: one question at a time, numbered navigator grid,
 * countdown with auto-submit, and a debounced draft save that never grades.
 */
export function QuizRunner({
  title,
  attemptId,
  questions,
  durationMs,
  timeStarted,
  randomnize = false,
  initialAnswers,
  onSubmitted,
  onAlreadySubmitted,
}: QuizRunnerProps) {
  const questionIds = useMemo(() => new Set(questions.map((question) => question.id)), [questions]);

  const [answers, setAnswers] = useState<Record<string, StudentQuizAnswerValue>>(() =>
    toAnswerMap(initialAnswers, questionIds),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionOrder, setQuestionOrder] = useState<StudentQuizQuestion[]>([]);
  const [optionOrder, setOptionOrder] = useState<Record<string, string[]>>({});
  const [draftStatus, setDraftStatus] = useState<DraftStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  const answersRef = useRef(answers);
  const questionIdsRef = useRef(questionIds);
  const dirtyRef = useRef(false);
  const savingPromiseRef = useRef<Promise<void> | null>(null);
  const finalisingRef = useRef(false);
  const submittedRef = useRef(false);
  const layoutKeyRef = useRef<string | null>(null);
  const onSubmittedRef = useRef(onSubmitted);
  const onAlreadySubmittedRef = useRef(onAlreadySubmitted);
  const submitQuizRef = useRef<((reason: "manual" | "timeout") => void) | null>(null);

  const timerDurationMs = typeof durationMs === "number" && durationMs > 0 ? durationMs : null;

  // The countdown runs off the attempt's own start time, so resuming a quiz
  // does not hand out a fresh clock.
  const deadlineRef = useRef<number | null>(null);
  if (deadlineRef.current === null && timerDurationMs !== null) {
    const startedAtMs = timeStarted ? new Date(timeStarted).getTime() : Number.NaN;
    deadlineRef.current = (Number.isFinite(startedAtMs) ? startedAtMs : Date.now()) + timerDurationMs;
  }
  const deadline = deadlineRef.current;

  const updateAnswer = useCallback((questionId: string, value: StudentQuizAnswerValue) => {
    setAnswers((previous) => ({ ...previous, [questionId]: value }));
    dirtyRef.current = true;
  }, []);

  const toggleMultipleChoice = useCallback((questionId: string, option: string, checked: boolean) => {
    setAnswers((previous) => {
      const current = Array.isArray(previous[questionId]) ? (previous[questionId] as string[]) : [];
      const next = checked ? [...current, option] : current.filter((item) => item !== option);

      return { ...previous, [questionId]: next };
    });
    dirtyRef.current = true;
  }, []);

  /**
   * Draft save: `saveQuizAnswers` without `timeSubmitted` hits the backend
   * `submitQuiz` else-branch, which only stores the answers and leaves grading
   * untouched (gradeQuiz is only reached when `timeSubmitted` is present).
   */
  const flushDraft = useCallback(async () => {
    if (!dirtyRef.current || submittedRef.current || finalisingRef.current) return;

    const payload = toAnswerPayload(answersRef.current, questionIdsRef.current);
    if (payload.length === 0) {
      dirtyRef.current = false;
      return;
    }

    const snapshot = JSON.stringify(payload);
    setDraftStatus("saving");

    const request = saveQuizAnswers(attemptId, { answers: payload })
      .then(() => {
        setLastSavedAt(new Date().toISOString());
        // Only settle as clean when nothing changed while the request was in flight.
        if (JSON.stringify(toAnswerPayload(answersRef.current, questionIdsRef.current)) === snapshot) {
          dirtyRef.current = false;
        }
        setDraftStatus("idle");
      })
      .catch((error) => {
        console.error("Quiz draft save failed:", error);
        setDraftStatus("idle");
      });

    savingPromiseRef.current = request;
    await request;
  }, [attemptId]);

  const submitQuiz = useCallback(
    async (reason: "manual" | "timeout") => {
      if (submittedRef.current || finalisingRef.current) return;

      finalisingRef.current = true;
      setIsSubmitting(true);
      setSubmitError(null);
      setConfirmOpen(false);

      try {
        // A draft that is still in flight must land before the final submit,
        // otherwise it would overwrite the graded answers.
        if (savingPromiseRef.current) await savingPromiseRef.current;

        const submission = await saveQuizAnswers(attemptId, {
          answers: toAnswerPayload(answersRef.current, questionIdsRef.current),
          timeSubmitted: new Date().toISOString(),
        });

        submittedRef.current = true;
        dirtyRef.current = false;
        toast.success(
          reason === "timeout" ? "Time is up — your quiz was submitted." : "Quiz submitted successfully.",
        );
        onSubmittedRef.current?.(submission);
      } catch (error) {
        const message = getStudentApiErrorMessage(error, "Unable to submit your quiz. Please try again.");
        setSubmitError(message);
        toast.error(message);

        if (isAlreadySubmittedError(message)) onAlreadySubmittedRef.current?.();
      } finally {
        finalisingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [attemptId],
  );

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    questionIdsRef.current = questionIds;
  }, [questionIds]);

  useEffect(() => {
    onSubmittedRef.current = onSubmitted;
    onAlreadySubmittedRef.current = onAlreadySubmitted;
  }, [onSubmitted, onAlreadySubmitted]);

  // randomnize: shuffle once per attempt and keep the result in state, so
  // typing, the ticking timer or a draft save can never reshuffle the paper.
  useEffect(() => {
    if (questions.length === 0) return;

    const layoutKey = `${attemptId}:${questions.length}`;
    if (layoutKeyRef.current === layoutKey) return;
    layoutKeyRef.current = layoutKey;

    if (!randomnize) {
      setQuestionOrder(questions);
      setOptionOrder({});
      return;
    }

    setQuestionOrder(shuffle(questions));
    setOptionOrder(
      Object.fromEntries(
        questions.map((question) => [
          question.id,
          question.type === "single_choice" || question.type === "multiple_choice"
            ? shuffle(cleanOptions(question.options))
            : cleanOptions(question.options),
        ]),
      ),
    );
  }, [attemptId, questions, randomnize]);

  useEffect(() => {
    submitQuizRef.current = (reason) => void submitQuiz(reason);
  }, [submitQuiz]);

  // "about every 20 seconds"
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void flushDraft();
    }, DRAFT_SAVE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [flushDraft]);

  // Best-effort save when the student leaves the page mid-attempt.
  useEffect(() => {
    return () => {
      void flushDraft();
    };
  }, [flushDraft]);

  // Auto-submit the moment the countdown reaches zero.
  useEffect(() => {
    if (deadline === null) return;

    let fired = false;

    const tick = () => {
      const left = Math.max(0, deadline - Date.now());
      setRemainingMs(left);

      if (left <= 0 && !fired) {
        fired = true;
        submitQuizRef.current?.("timeout");
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);

    return () => window.clearInterval(intervalId);
  }, [deadline]);

  const orderedQuestions = questionOrder.length > 0 ? questionOrder : questions;
  const safeIndex = Math.min(currentIndex, Math.max(0, orderedQuestions.length - 1));
  const currentQuestion = orderedQuestions[safeIndex];
  const currentValue = currentQuestion ? answers[currentQuestion.id] : undefined;
  const currentOptions = currentQuestion
    ? cleanOptions(optionOrder[currentQuestion.id] ?? currentQuestion.options)
    : [];
  const answeredCount = orderedQuestions.filter((question) => isAnswered(answers[question.id])).length;
  const unansweredCount = orderedQuestions.length - answeredCount;

  const draftLabel = isSubmitting
    ? "Submitting your answers…"
    : draftStatus === "saving"
      ? "Saving draft…"
      : lastSavedAt
        ? `Draft saved ${format(new Date(lastSavedAt), "p")}`
        : "Answers save automatically";

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      // "and on question change"
      void flushDraft();
    },
    [flushDraft],
  );

  const renderAnswerInput = (question: StudentQuizQuestion, value: StudentQuizAnswerValue | undefined) => {
    const options = cleanOptions(optionOrder[question.id] ?? question.options);

    switch (question.type) {
      case "single_choice":
        return (
          <RadioGroup
            className="flex flex-col gap-6"
            value={typeof value === "string" ? value : ""}
            onValueChange={(next) => updateAnswer(question.id, next)}
            disabled={isSubmitting}
          >
            {options.map((option, optionIndex) => (
              <div key={`${question.id}-${optionIndex}`} className="flex items-center gap-3">
                <RadioGroupItem
                  id={`${question.id}-option-${optionIndex}`}
                  value={option}
                  className="h-6 w-6 shadow-none border border-shade-3 focus:outline-0 focus-visible:ring-0 focus:border-2"
                >
                  <div className="h-4 w-4 bg-orange rounded-full" />
                </RadioGroupItem>

                <Label
                  htmlFor={`${question.id}-option-${optionIndex}`}
                  className="text-high text-base font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "multiple_choice":
        return (
          <div className="flex flex-col gap-6">
            {options.map((option, optionIndex) => {
              const checked = Array.isArray(value) && value.includes(option);

              return (
                <div key={`${question.id}-${optionIndex}`} className="flex items-center gap-3">
                  <Checkbox
                    id={`${question.id}-option-${optionIndex}`}
                    checked={checked}
                    disabled={isSubmitting}
                    onCheckedChange={(state) => toggleMultipleChoice(question.id, option, state === true)}
                    className="h-6 w-6 rounded-md border border-shade-3 shadow-none
                      data-[state=checked]:bg-orange data-[state=checked]:border-orange data-[state=checked]:text-white"
                  />

                  <Label
                    htmlFor={`${question.id}-option-${optionIndex}`}
                    className="text-high text-base font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        );

      case "fill_in_the_blank":
        return (
          <div className="flex flex-col gap-3 max-w-xl">
            <Input
              value={typeof value === "string" ? value : ""}
              onChange={(event) => updateAnswer(question.id, event.target.value)}
              disabled={isSubmitting}
              placeholder="Type your answer"
              className="h-12 text-base border-shade-3 bg-white focus-visible:ring-0 focus-visible:border-2 focus-visible:border-orange"
            />

            <p className="text-sm font-normal text-low">
              Checked after trimming spaces and ignoring letter case.
            </p>
          </div>
        );

      case "true_or_false":
        return (
          <RadioGroup
            className="flex flex-col gap-6"
            value={typeof value === "boolean" ? String(value) : ""}
            onValueChange={(next) => updateAnswer(question.id, next === "true")}
            disabled={isSubmitting}
          >
            {TRUE_OR_FALSE_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <RadioGroupItem
                  id={`${question.id}-${option.value}`}
                  value={option.value}
                  className="h-6 w-6 shadow-none border border-shade-3 focus:outline-0 focus-visible:ring-0 focus:border-2"
                >
                  <div className="h-4 w-4 bg-orange rounded-full" />
                </RadioGroupItem>

                <Label
                  htmlFor={`${question.id}-${option.value}`}
                  className="text-high text-base font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return (
          <p className="text-sm font-normal text-danger">
            This question type is not supported in the quiz runner yet.
          </p>
        );
    }
  };

  if (!currentQuestion) return null;

  return (
    <section className="rounded-xl w-full border border-shade-3 p-6 bg-white flex flex-col gap-9">
      <div className="rounded-xl border border-shade-3">
        <div className="bg-shade-1 rounded-t-xl p-6 flex flex-wrap gap-4 justify-between items-center">
          <h1 className="text-high font-semibold text-xl">{title}</h1>

          <div className="flex items-center gap-1 text-xl font-semibold">
            <span className="text-base font-normal">Questions: </span>

            <span className="text-orange">{pad(safeIndex + 1)}</span>

            <span>of {pad(orderedQuestions.length)}</span>
          </div>

          {timerDurationMs !== null && (
            <div className="flex items-center text-xl font-semibold gap-1">
              <p className="text-base font-normal">Time Left: </p>

              <p className={cn(remainingMs !== null && remainingMs <= 60_000 && "text-danger")}>
                {formatRemaining(remainingMs ?? timerDurationMs)}
              </p>
            </div>
          )}
        </div>

        <div className="p-6 flex items-start gap-6">
          <div
            className="border rounded-xl bg-shade-1 border-shade-3
          flex items-center justify-center shrink-0 w-12 h-12 text-xl font-semibold text-high"
          >
            {pad(safeIndex + 1)}
          </div>

          <div className="text-xl text-high py-3 flex-1 min-w-0">
            <h3 className="mb-6 font-semibold">{currentQuestion.body}</h3>

            {renderAnswerInput(currentQuestion, currentValue)}

            {submitError && (
              <div className="mt-6 rounded-lg border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
                {submitError}
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button
                className="bg-orange hover:bg-burnt transition-colors text-white"
                variant="_default"
                type="button"
                onClick={() => goTo(Math.max(0, safeIndex - 1))}
                disabled={safeIndex === 0 || isSubmitting}
              >
                <ArrowLeft className="w-6 h-6" />
                Previous
              </Button>

              <Button
                className="bg-orange hover:bg-burnt transition-colors text-white"
                variant="_default"
                type="button"
                onClick={() => goTo(Math.min(orderedQuestions.length - 1, safeIndex + 1))}
                disabled={safeIndex >= orderedQuestions.length - 1 || isSubmitting}
              >
                Next
                <ArrowRight className="w-6 h-6" />
              </Button>

              <span className="text-sm font-normal text-low">{draftLabel}</span>

              <Button
                className="ml-auto bg-orange hover:bg-burnt transition-colors text-white"
                variant="_default"
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit Quiz"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-low font-semibold text-base">Questions</h3>

        <div className="flex gap-3 flex-wrap">
          {orderedQuestions.map((question, index) => {
            const answered = isAnswered(answers[question.id]);
            const isCurrent = index === safeIndex;

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => goTo(index)}
                aria-current={isCurrent ? "true" : undefined}
                aria-label={`Question ${index + 1}${answered ? " (answered)" : " (unanswered)"}`}
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-xl font-normal text-high bg-light shrink-0 transition-colors",

                  answered && "bg-success/20",
                  isCurrent && "border-2 border-orange text-orange font-semibold",
                )}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit quiz?</DialogTitle>
            <DialogDescription>Your answers can no longer be changed after submitting.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 text-sm text-low">
            <p>
              You have answered {answeredCount} of {orderedQuestions.length} question(s).
            </p>

            {unansweredCount > 0 && (
              <p className="text-danger">
                {unansweredCount} question(s) are still unanswered and will score zero.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="_outline" type="button" onClick={() => setConfirmOpen(false)}>
              Keep working
            </Button>

            <Button
              className="bg-orange hover:bg-burnt text-white"
              variant="_default"
              type="button"
              onClick={() => void submitQuiz("manual")}
              disabled={isSubmitting}
            >
              Submit Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

type QuizResultProps = {
  title: string;
  grade: number | null;
  submittedAt?: string | Date | null;
  totalQuestions?: number | null;
  /** Only available straight from the graded submit response. */
  review?: QuizReviewEntry[] | null;
};

export function QuizResult({ title, grade, submittedAt, totalQuestions, review }: QuizResultProps) {
  const formattedSubmittedAt = submittedAt ? format(new Date(submittedAt), "PPp") : null;
  const correctCount = review?.filter((entry) => entry.status === "correct").length ?? null;

  return (
    <section className="rounded-xl w-full border border-shade-3 p-6 bg-white flex flex-col gap-9">
      <div className="rounded-xl border border-shade-3">
        <div className="bg-shade-1 rounded-t-xl p-6 flex flex-wrap gap-4 justify-between items-center">
          <h1 className="text-high font-semibold text-xl">{title}</h1>

          <span className="rounded-full bg-success/20 px-3 py-1 text-sm font-medium text-success-light">
            Submitted
          </span>
        </div>

        <div className="p-6 flex flex-col items-center gap-2 text-center">
          <CheckCircle2 className="h-14 w-14 text-success" />

          <h2 className="text-xl font-semibold text-high">Quiz submitted</h2>

          {formattedSubmittedAt && <p className="text-sm text-low">Submitted {formattedSubmittedAt}</p>}

          <p className="mt-4 text-5xl font-semibold text-high">
            {typeof grade === "number" ? `${Math.round(grade)}%` : "—"}
          </p>

          <p className="text-sm text-low">
            {correctCount !== null && typeof totalQuestions === "number"
              ? `${correctCount} of ${totalQuestions} questions correct`
              : typeof totalQuestions === "number"
                ? `${totalQuestions} question${totalQuestions === 1 ? "" : "s"}`
                : "Your score"}
          </p>

          {review && review.length > 0 && (
            <div className="mt-8 w-full max-w-2xl text-left">
              <h3 className="text-base text-high font-semibold mb-3">Question breakdown</h3>

              <ul className="flex flex-col divide-y divide-shade-2 rounded-xl border border-shade-2 overflow-hidden">
                {review.map((entry, index) => (
                  <li key={entry.questionId} className="flex items-start gap-3 bg-white p-4">
                    <span className="text-sm text-low w-6 shrink-0">{index + 1}.</span>

                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-sm text-high">{entry.body}</p>

                      {entry.status === "incorrect" && (
                        <p className="text-xs text-low">
                          Your answer: {formatQuizAnswerValue(entry.givenAnswer)} · Correct:{" "}
                          {formatQuizAnswerValue(entry.correctAnswer)}
                        </p>
                      )}

                      {entry.status === "unanswered" && (
                        <p className="text-xs text-low">Not answered — counted as incorrect.</p>
                      )}
                    </div>

                    <span
                      className={cn(
                        "ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        REVIEW_STATUS_CLASS[entry.status],
                      )}
                    >
                      {REVIEW_STATUS_LABEL[entry.status]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button asChild variant="_default" className="bg-orange hover:bg-burnt text-white mt-8">
            <Link href="/student/assignments">Back to Assignments</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
