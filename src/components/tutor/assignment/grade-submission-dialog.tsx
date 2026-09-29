"use client";

import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import toast from "react-hot-toast";

import type { SubmissionUser } from "@/api/tutorApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateAssignmentFeedback,
  useGradeSubmission,
  useSubmissionDetail,
} from "@/hooks/tutorQueries";

const getStudentName = (user?: SubmissionUser | null) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unnamed student";

const formatDuration = (duration?: number | null) => {
  if (duration == null || Number.isNaN(duration)) return "";
  const totalSeconds = Math.max(0, Math.round(duration));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

interface GradeSubmissionDialogProps {
  submissionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalScore?: number;
}

export function GradeSubmissionDialog({
  submissionId,
  open,
  onOpenChange,
  totalScore,
}: GradeSubmissionDialogProps) {
  const queryClient = useQueryClient();
  const {
    data: submission,
    isLoading,
    isError,
  } = useSubmissionDetail({ submissionId, enabled: open });
  const { mutateAsync: saveGrade, isPending: isSavingGrade } =
    useGradeSubmission();
  const { mutateAsync: saveFeedback, isPending: isSavingFeedback } =
    useCreateAssignmentFeedback();

  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!open) return;
    setGrade(submission?.grade != null ? String(submission.grade) : "");
    setFeedback("");
    // Re-seed the form on open (and once the detail finishes loading).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, submission?.id]);

  const studentName = getStudentName(submission?.user);
  const recordedFeedbacks =
    submission?.AssignmentFeedback ?? submission?.feedbacks ?? [];
  const recordings = [...(submission?.recordings ?? [])].sort(
    (a, b) => a.position - b.position
  );
  const maxScore =
    totalScore ?? submission?.assignment?.totalScore ?? undefined;
  const isSaving = isSavingGrade || isSavingFeedback;

  const finishSave = () => {
    queryClient.invalidateQueries({ queryKey: ["student-submissions"] });
    queryClient.invalidateQueries({
      queryKey: ["submission-detail", submissionId],
    });
    queryClient.invalidateQueries({ queryKey: ["single-assignment-metrics"] });
    onOpenChange(false);
  };

  const handleSave = async () => {
    if (!submissionId) return;

    const parsedGrade = Number(grade);
    if (!grade.trim() || Number.isNaN(parsedGrade) || parsedGrade < 0) {
      toast.error("Enter a valid grade (0 or above).");
      return;
    }

    try {
      await saveGrade({ submissionId, grade: parsedGrade });
    } catch {
      toast.error("Could not save the grade. Please try again!");
      return;
    }

    if (feedback.trim()) {
      try {
        await saveFeedback({ feedback: feedback.trim(), submissionId });
      } catch {
        toast.error("Grade saved, but the feedback could not be sent.");
        finishSave();
        return;
      }
    }

    toast.success("Submission graded successfully!");
    finishSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[720px]">
        <DialogHeader>
          <DialogTitle>{submission ? studentName : "Submission"}</DialogTitle>
          <DialogDescription>
            Review the submission, then save a grade and feedback.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-40 rounded-lg" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
        ) : isError || !submission ? (
          <p className="text-sm text-low py-6">
            Could not load this submission. Please try again.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-medium text-high">{studentName}</span>
              <span className="flex items-center gap-2 text-low">
                <Calendar className="w-4 h-4" />
                {format(new Date(submission.createdAt), "PP")}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-high text-sm font-medium">Submission</h4>

              <p className="text-sm text-high whitespace-pre-wrap rounded-xl border border-shade-3 bg-offwhite px-3 py-3">
                {submission.content?.trim() || "No text response provided."}
              </p>

              {submission.submissionLink ? (
                <a
                  href={submission.submissionLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-orange underline break-all w-fit"
                >
                  {submission.submissionLink}
                </a>
              ) : null}

              {(submission.files ?? []).length > 0 ? (
                <div className="flex flex-col gap-1">
                  <span className="text-low text-sm">Attached files</span>
                  <div className="flex flex-wrap gap-3">
                    {submission.files?.map((file) => (
                      <a
                        key={file.id}
                        href={file.src ?? file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-orange underline w-fit"
                      >
                        {file.fileName ?? file.filename ?? "Attachment"}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {recordings.length > 0 ? (
              <div className="flex flex-col gap-3">
                <h4 className="text-high text-sm font-medium">Recordings</h4>

                {recordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="flex flex-col gap-1 rounded-xl border border-shade-3 bg-offwhite px-3 py-3"
                  >
                    <span className="text-sm text-high">
                      Recording {recording.position}
                      {formatDuration(recording.duration)
                        ? ` (${formatDuration(recording.duration)})`
                        : ""}
                    </span>
                    <audio
                      controls
                      src={recording.file?.src ?? recording.file?.url}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            ) : null}

            {recordedFeedbacks.length > 0 ? (
              <div className="flex flex-col gap-2">
                <h4 className="text-high text-sm font-medium">
                  Previous feedback
                </h4>

                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto hide-scrollbar">
                  {recordedFeedbacks.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-xl border border-shade-3 bg-offwhite px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="font-medium text-high">
                          {getStudentName(entry.user)}
                        </span>
                        <span className="flex items-center gap-1 text-low">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(entry.createdAt), "PP")}
                        </span>
                      </div>

                      <p className="text-sm text-high mt-1 whitespace-pre-wrap">
                        {entry.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-4 border-t border-shade-3 pt-4">
              <div>
                <Label htmlFor="submission-grade">Grade</Label>

                <Input
                  id="submission-grade"
                  type="number"
                  min={0}
                  max={maxScore}
                  inputMode="decimal"
                  placeholder="Enter score"
                  className="rounded-xl text-high mt-1"
                  value={grade}
                  onChange={(event) => setGrade(event.target.value)}
                  disabled={isSaving}
                />

                <p className="text-xs text-low mt-1">
                  {typeof maxScore === "number"
                    ? `Out of ${maxScore}`
                    : "The score must be 0 or above."}
                </p>
              </div>

              <div>
                <Label htmlFor="submission-feedback">Feedback (optional)</Label>

                <Textarea
                  id="submission-feedback"
                  placeholder="Write feedback for the student..."
                  className="h-28 rounded-xl resize-none text-high mt-1"
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="_outline"
              className="text-orange px-6 py-2 h-10 bg-white border border-shade-3 hover:bg-offwhite"
              disabled={isSaving}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant="_default"
            className="bg-orange hover:bg-burnt px-4 py-2 h-10"
            type="button"
            disabled={isSaving || isLoading || !submission}
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : "Save Grade"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
