"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { TopBar } from "@/components/shared/top-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EditTimeSchedule } from "@/components/admin/edit-quran-timetable";

import { useCurrentUser } from "@/hooks/useAccount";
import { useTutors, useStudents, useCourses, useCreateSchedules } from "@/hooks/useAdmin";
import { QURAN_ID } from "@/data/constants";

export default function AddTimetable() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: tutors, isLoading: tutorsLoading, error: tutorsError } = useTutors();
  const { data: students, isLoading: studentsLoading, error: studentsError } = useStudents();
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useCourses();

  // Start with an empty array — this is an add-only page
  const [newSchedules, setNewSchedules] = useState<Schedule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const createMutation = useCreateSchedules();

  const handleSave = async () => {
    // Only submit entries that have the minimum required fields
    const classesPayload = newSchedules
      .filter((s) => s.day && s.start && s.end && s.userId)
      .map((s) => ({
        day: s.day.toLowerCase(),
        start: s.start,
        end: s.end,
        userId: s.userId,
        studentId: s.studentId || undefined,
        link: s.link || "",
        courseId: s.courseId || QURAN_ID,
        status: "scheduled" as const,
      }));

    if (classesPayload.length === 0) {
      toast.error("Please add at least one class with a tutor assigned before saving.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createMutation.mutateAsync({
        classes: classesPayload,
        courseId: classesPayload[0].courseId, // Assuming all classes are for the same course
      });

      toast.success("Class created successfully");
      router.back();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to create class. Please try again.";

      console.error("Error creating class:", error?.response?.data ?? error);
      toast.error(message, { duration: 6000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = tutorsLoading || studentsLoading || coursesLoading;
  const hasError = tutorsError || studentsError || coursesError;

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext="Add Class" user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={"/admin/timetable"} className="hover:underline">
                Timetable
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span>Add Class</span>
            </p>
          </TopBar>
        )}
      </div>

      <div className="rounded-xl bg-white p-6 h-full border border-shade-2 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-xl">Add New Classes</h3>

          <div className="flex gap-2 items-center">
            <Button
              variant={"_outline"}
              className="text-orange hover:text-burnt px-4 py-2 h-10"
              onClick={() => handleSave()}
              disabled={isSubmitting}
            >
              <Plus className="w-6 h-6" strokeWidth={3} />
              <span>{isSubmitting ? "Saving..." : "Add Class"}</span>
            </Button>
          </div>
        </div>

        <div className="h-[1024px] overflow-y-scroll hide-scrollbar">
          {hasError ? (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-red-800 font-medium">Error loading data</p>
              <p className="text-red-700 text-sm mt-1">
                Failed to fetch tutor and course data. Please try refreshing the page.
              </p>
            </div>
          ) : isLoading ? (
            <Skeleton className="rounded-xl h-full" />
          ) : (
            <EditTimeSchedule
              schedules={newSchedules}
              tutors={tutors?.records ?? []}
              students={students ?? []}
              courses={courses ?? []}
              onSave={setNewSchedules}
            />
          )}
        </div>
      </div>
    </section>
  );
}
