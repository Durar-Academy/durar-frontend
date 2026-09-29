"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { ChevronRight, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import { TopBar } from "@/components/shared/top-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EditTimeSchedule } from "@/components/admin/edit-quran-timetable";

import { useCurrentUser } from "@/hooks/useAccount";
import {
  useSchedules,
  useTutors,
  useStudents,
  useCourses,
  useCreateSchedules,
  useUpdateSchedules,
  useDeleteSchedule,
} from "@/hooks/useAdmin";
import { QURAN_ID } from "@/data/constants";

export default function EditTimetable() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: schedules, isLoading: schedulesLoading, error: schedulesError } = useSchedules();
  const { data: tutors, isLoading: tutorsLoading, error: tutorsError } = useTutors();
  const { data: students, isLoading: studentsLoading, error: studentsError } = useStudents();
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useCourses();

  // Local state for the working copy of schedules being edited
  const [editedSchedules, setEditedSchedules] = useState<Schedule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const originalScheduleIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);
  const router = useRouter();

  // React Query mutations — they handle API calls and cache invalidation
  const createMutation = useCreateSchedules();
  const updateMutation = useUpdateSchedules();
  const deleteMutation = useDeleteSchedule();

  // Initialise the working copy once from server data
  useEffect(() => {
    if (!schedules || initializedRef.current) return;
    initializedRef.current = true;

    originalScheduleIdsRef.current = new Set(
      schedules.filter((s) => s.id).map((s) => s.id),
    );

    setEditedSchedules(schedules);
  }, [schedules]);

  /** Compute what needs to be created, updated, and deleted. */
  function computeChanges() {
    const quranSchedules = editedSchedules.filter(
      (s) => !s.courseId || s.courseId === QURAN_ID,
    );

    const currentIds = new Set(
      editedSchedules
        .filter((s) => s.id && !s.id.startsWith("new-"))
        .map((s) => s.id),
    );

    const deletedIds = Array.from(originalScheduleIdsRef.current).filter(
      (id) => !currentIds.has(id),
    );

    const toCreate = quranSchedules
      .filter((s) => !s.id || s.id.startsWith("new-"))
      .map((s) => ({
        day: s.day.toLowerCase(),
        start: s.start,
        end: s.end,
        userId: s.userId,
        studentId: s.studentId || undefined,
        link: s.link || "",
        courseId: s.courseId || QURAN_ID,
        status: "scheduled",
      }));

    const toUpdate = quranSchedules
      .filter((s) => s.id && !s.id.startsWith("new-"))
      .map((s) => ({
        id: s.id,
        day: s.day.toLowerCase(),
        start: s.start,
        end: s.end,
        courseId: s.courseId || QURAN_ID,
        userId: s.userId,
        studentId: s.studentId || undefined,
        link: s.link || "",
        status: "scheduled",
      }));

    return { deletedIds, toCreate, toUpdate };
  }

  const handleSave = async () => {
    setIsSubmitting(true);

    const { deletedIds, toCreate, toUpdate } = computeChanges();

    try {
      const apiCalls: Promise<unknown>[] = [
        ...deletedIds.map((id) => deleteMutation.mutateAsync(id)),
        ...(toCreate.length > 0
          ? [createMutation.mutateAsync({ classes: toCreate, courseId: QURAN_ID })]
          : []),
        ...(toUpdate.length > 0
          ? [updateMutation.mutateAsync({ classes: toUpdate })]
          : []),
      ];

      if (apiCalls.length === 0) {
        toast("No changes to save.");
        router.back();
        return;
      }

      const results = await Promise.allSettled(apiCalls);

      const failures = results.filter(
        (r): r is PromiseRejectedResult => r.status === "rejected",
      );

      if (failures.length > 0) {
        // Log the actual API error for debugging
        failures.forEach((f) =>
          console.error("Schedule save error:", f.reason?.response?.data ?? f.reason),
        );

        const errorMessages = failures
          .map((f) => {
            const data = f.reason?.response?.data;
            return data?.message || data?.error || "Unknown error";
          })
          .filter(Boolean);

        toast.error(
          `Unable to save ${failures.length} schedule(s). ${errorMessages.join("; ")}`,
          { duration: 6000 },
        );
      } else {
        toast.success("Schedules saved successfully");
        router.back();
      }
    } catch (error) {
      console.error("Unexpected error during save:", error);
      toast.error("Unable to save schedules. Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading =
    schedulesLoading || tutorsLoading || studentsLoading || coursesLoading;
  const hasError = schedulesError || tutorsError || studentsError || coursesError;

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext="Edit Timetable" user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={"/admin/timetable"} className="hover:underline">
                Timetable
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span>Edit Timetable</span>
            </p>
          </TopBar>
        )}
      </div>

      <div className="rounded-xl bg-white p-6 h-full border border-shade-2 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-xl">Quran Timetable</h3>

          <div className="flex gap-2 items-center">
            <Button
              variant={"_outline"}
              className="text-orange hover:text-burnt px-4 py-2 h-10"
              onClick={() => handleSave()}
              disabled={isSubmitting}
            >
              <Save className="w-6 h-6" strokeWidth={3} />
              <span>{isSubmitting ? "Saving..." : "Save"}</span>
            </Button>
          </div>
        </div>

        <div className="h-[1024px] overflow-y-scroll hide-scrollbar">
          {hasError ? (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-red-800 font-medium">Error loading data</p>
              <p className="text-red-700 text-sm mt-1">
                Failed to fetch timetable data. Please try refreshing the page.
              </p>
            </div>
          ) : isLoading ? (
            <Skeleton className="rounded-xl h-full" />
          ) : (
            <EditTimeSchedule
              schedules={editedSchedules}
              tutors={tutors?.records ?? []}
              students={students ?? []}
              courses={courses ?? []}
              onSave={setEditedSchedules}
            />
          )}
        </div>
      </div>
    </section>
  );
}
