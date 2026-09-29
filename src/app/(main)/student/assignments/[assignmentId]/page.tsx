"use client";

import { ChevronRight, Plus, SendHorizonalIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

import { TopBar } from "@/components/shared/top-bar";
import { AudioPlayer } from "@/components/student/audio-player";
import { AudioRecorder } from "@/components/student/audio-recorder";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

import { useCurrentUser } from "@/hooks/useAccount";
import { useFile, useStudentAssignment } from "@/hooks/useStudent";
import {
  findActiveQuizSubmission,
  findSubmittedQuizSubmission,
  submitAssignment,
  type StudentAssignmentWithQuiz,
} from "@/lib/student";
import { uploadFile } from "@/lib/storage";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface RecordingItem {
  id: string;
  blob: Blob | null;
  url: string;
  duration: number;
  createdAt: Date;
}

const formatQuizDuration = (durationMs: number) => {
  const minutes = Math.max(1, Math.round(durationMs / 60_000));

  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
};

export default function Assignment() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const router = useRouter();
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: assignment, isLoading: assignmentLoading } = useStudentAssignment(assignmentId);
  const { data: assignmentMedia } = useFile(assignment?.mediaId);
  const assignmentAudioUrl = assignment?.media?.src ?? assignmentMedia?.src;

  // Quizzes replace the submission form with a status card. Their submission
  // rows live under `QuizSubmission` (newest first), because the list payload's
  // own `grade`/`status` fields are mapped from AssignmentSubmission only.
  const assignmentWithQuiz = assignment as StudentAssignmentWithQuiz | undefined;
  const isQuiz = assignmentWithQuiz?.type === "quiz";
  const submittedQuiz = findSubmittedQuizSubmission(assignmentWithQuiz);
  const activeQuiz = findActiveQuizSubmission(assignmentWithQuiz);
  const quizHref = `/student/assignments/${assignmentId}/quiz`;
  const quizCtaLabel = submittedQuiz ? "View Result" : activeQuiz ? "Resume Quiz" : "Start Quiz";
  const quizStatusLabel = submittedQuiz ? "Submitted" : activeQuiz ? "In progress" : "Not started";
  const quizStatusDescription = submittedQuiz
    ? "You have submitted this quiz. Your score is shown above."
    : activeQuiz
      ? "You have an attempt in progress. The timer keeps running while you are away."
      : "This quiz is timed from the moment you start it.";
  const [content, setContent] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [recordings, setRecordings] = useState<RecordingItem[]>(
    Array.from({ length: 10 }).map(() => ({
      id: uuidV4(),
      blob: null,
      url: "",
      duration: 0,
      createdAt: new Date(),
    })),
  );

  const addNewVerseRecorder = () => {
    const newItem: RecordingItem = {
      id: uuidV4(),
      blob: null,
      url: "",
      duration: 0,
      createdAt: new Date(),
    };
    setRecordings((prev) => [...prev, newItem]);
  };

  const handleRecordingComplete = (id: string, blob: Blob, duration: number) => {
    const url = URL.createObjectURL(blob);

    setRecordings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, blob, url, duration } : item)),
    );
  };

  const deleteVerse = (id: string) => {
    const item = recordings.find((r) => r.id === id);
    if (item?.url) URL.revokeObjectURL(item.url);

    setRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSubmit = async () => {
    const completedRecordings = recordings.filter((recording) => recording.blob);
    if (!content.trim() && !submissionLink.trim() && completedRecordings.length === 0) {
      toast.error("Add a response or record at least one verse before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const uploaded = await Promise.all(
        completedRecordings.map((recording, index) =>
          uploadFile(new File([recording.blob as Blob], `verse-${index + 1}.webm`, { type: "audio/webm" })),
        ),
      );
      await submitAssignment(assignmentId, {
        content: content.trim() || undefined,
        submissionLink: submissionLink.trim() || undefined,
        files: [],
        recordings: uploaded.map((file, index) => ({
          position: index + 1,
          fileId: file.id ?? file.storageId,
          duration: completedRecordings[index].duration,
        })),
      });
      toast.success("Assignment submitted successfully.");
      router.push("/student/assignments");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit assignment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up audio URLs on unmount
  useEffect(() => {
    return () => {
      recordings.forEach((r) => {
        if (r.url) URL.revokeObjectURL(r.url);
      });
    };
  }, [recordings]);

  return (
    <section className="flex flex-col gap-3">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={assignment?.title ? `Assignment - ${assignment.title}` : "Assignment"} user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={"/student/assignments"} className="hover:underline">
                Assignments
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span>{isQuiz ? "Quiz" : "Submit Assignment"}</span>
            </p>
          </TopBar>
        )}
      </div>

      <div className="bg-white border border-shade-2 rounded-xl p-6 flex justify-between flex-wrap gap-6">
        <div className="flex flex-col gap-4 font-medium">
          <h3 className="text-high text-sm">
            {assignmentLoading ? "Loading assignment..." : assignment?.title ?? "Assignment"}
          </h3>

          <p className="text-low text-sm">
            {assignmentLoading
              ? "Loading instructions..."
              : assignment?.description || "No instructions provided."}
          </p>

          {assignmentLoading ? (
            <div className="mt-2">
              <Skeleton className="h-14 w-[360px] rounded-full" />
            </div>
          ) : assignmentAudioUrl ? (
            <div className="mt-2">
              <AudioPlayer audioUrl={assignmentAudioUrl} />
            </div>
          ) : null}
        </div>

        <div>
          {isQuiz ? (
            <Button asChild className="bg-orange hover:bg-burnt text-white" variant={"_default"}>
              <Link href={quizHref}>{quizCtaLabel}</Link>
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-orange hover:bg-burnt" variant={"_default"}>
              <SendHorizonalIcon className="size-4" />
              {isSubmitting ? "Submitting..." : "Submit Assignment"}
            </Button>
          )}
        </div>
      </div>

      {isQuiz && (
        <div className="bg-white border border-shade-2 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-base text-high font-semibold">Quiz status</h2>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                submittedQuiz
                  ? "bg-success/20 text-success-light"
                  : activeQuiz
                    ? "bg-light text-orange"
                    : "bg-shade-1 text-low",
              )}
            >
              {quizStatusLabel}
            </span>

            {submittedQuiz && typeof submittedQuiz.grade === "number" && (
              <span className="text-sm text-high font-medium">
                Score: {Math.round(submittedQuiz.grade)}%
              </span>
            )}

            {!submittedQuiz && typeof assignmentWithQuiz?.duration === "number" && assignmentWithQuiz.duration > 0 && (
              <span className="text-sm text-low">
                Time limit: {formatQuizDuration(assignmentWithQuiz.duration)}
              </span>
            )}

            {!submittedQuiz && typeof assignmentWithQuiz?.totalScore === "number" && assignmentWithQuiz.totalScore > 0 && (
              <span className="text-sm text-low">Total score: {assignmentWithQuiz.totalScore}</span>
            )}
          </div>

          <p className="text-sm text-low">{quizStatusDescription}</p>

          <div>
            <Button asChild className="bg-orange hover:bg-burnt text-white" variant={"_default"}>
              <Link href={quizHref}>{quizCtaLabel}</Link>
            </Button>
          </div>
        </div>
      )}

      {!isQuiz && (
      <div className="bg-white border border-shade-2 rounded-xl p-6 space-y-4">
        <h2 className="text-base text-high font-semibold">Written response</h2>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your response..."
          className="min-h-28 w-full rounded-xl border border-shade-3 p-3 text-sm outline-none focus:border-orange"
        />
        <Input value={submissionLink} onChange={(event) => setSubmissionLink(event.target.value)} placeholder="Submission link (optional)" />
      </div>
      )}

      {!isQuiz && (
      <div className="bg-white border border-shade-2 rounded-xl p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-base text-high font-semibold ">Verse Recordings</h2>
            <button
              onClick={addNewVerseRecorder}
              className="bg-white border border-orange text-orange px-3 py-1 rounded-md flex items-center gap-2"
            >
              <Plus size={16} />
              Add Verse
            </button>
          </div>

          {/* Recording List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
            {recordings.map((item, index) => (
              <div key={item.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-700">Verse {index + 1}</p>

                  <button
                    onClick={() => deleteVerse(item.id)}
                    className="text-danger text-sm gap-1 flex items-center"
                    title="Delete this verse"
                  >
                    <Trash2 size={16} />
                    Verse {index + 1}
                  </button>
                </div>

                <AudioRecorder
                  onRecordingComplete={(blob, duration) =>
                    handleRecordingComplete(item.id, blob, duration)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </section>
  );
}
