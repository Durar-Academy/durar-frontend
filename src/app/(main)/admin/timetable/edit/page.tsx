"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { ChevronRight, Download, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import { TopBar } from "@/components/shared/top-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EditTimeSchedule } from "@/components/admin/edit-quran-timetable";

import { useCurrentUser } from "@/hooks/useAccount";
import { useSchedules, useTutors } from "@/hooks/useAdmin";
import { createSchedules, updateSchedules } from "@/lib/admin";
import { QURAN_ID } from "@/data/constants";

export default function EditTimetable() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: schedules, isLoading: schedulesLoading } = useSchedules();
  const { data: tutors, isLoading: tutorsLoading } = useTutors();

  // State to track edited schedules
  const [editedSchedules, setEditedSchedules] = useState<Schedule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize state when schedules are fetched
  useEffect(() => {
    if (schedules?.records) {
      setEditedSchedules(schedules.records);
    }
  }, [schedules]);

  const handleSave = async () => {
    console.log("EDITED SCHEDULE: RAW", editedSchedules);

    setIsSubmitting(true);

    const editedSchedulesQuran = editedSchedules.filter(
      (schedule) => schedule.courseId === QURAN_ID,
    );

    console.log("EDITED SCHEDULE: QURAN ONLY", editedSchedulesQuran);

    const classesToCreate = editedSchedulesQuran
      .filter((schedule) => schedule.id === schedule.userId)
      .map((schedule) => {
        return {
          day: schedule.day.toLowerCase(),
          start: schedule.start,
          end: schedule.start,
          userId: schedule.userId,
          status: "scheduled",
        };
      });

    console.log("EDITED SCHEDULE: TO CREATE", classesToCreate);

    const classesToUpdate = editedSchedulesQuran
      .filter((schedule) => schedule.id !== schedule.userId)
      .map((schedule) => {
        return {
          id: schedule.id,
          day: schedule.day.toLowerCase(),
          start: schedule.start,
          end: schedule.start,
          courseId: schedule.courseId,
          userId: schedule.userId,
          status: "scheduled",
        };
      });

    console.log("EDITED SCHEDULE: TO UPDATE", classesToUpdate);

    try {
      // Prepare API calls
      const apiCalls = [];

      // Add create API call if needed
      if (classesToCreate.length > 0) {
        apiCalls.push(
          createSchedules({
            classes: classesToCreate,
            courseId: QURAN_ID,
          }),
        );
      }

      // Add update API call if needed
      if (classesToUpdate.length > 0) {
        apiCalls.push(
          updateSchedules({
            classes: classesToUpdate,
          }),
        );
      }

      // Execute all API calls in parallel
      if (apiCalls.length > 0) {
        const responses = await Promise.all(apiCalls);
        console.log("CREATE AND UPDATE RESPONSES:", responses);
      }

      toast.success("Schedules saved successfully");

      router.back();
    } catch (error) {
      console.error("Error saving schedules:", error);

      toast.error("Unable to save schedules. Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

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

            <Button variant={"_default"} className="bg-orange hover:bg-burnt px-4 py-2 h-10">
              <Download className="w-6 h-6" strokeWidth={3} />
              <span>Download</span>
            </Button>
          </div>
        </div>

        <div className="h-[1024px] overflow-y-scroll hide-scrollbar">
          {schedulesLoading || tutorsLoading ? (
            <Skeleton className="rounded-xl h-full" />
          ) : (
            <EditTimeSchedule
              schedules={editedSchedules}
              tutors={tutors.records}
              onSave={setEditedSchedules}
            />
          )}
        </div>
      </div>
    </section>
  );
}
