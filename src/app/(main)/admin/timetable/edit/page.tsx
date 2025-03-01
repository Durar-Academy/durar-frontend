"use client";

import Link from "next/link";
import { ChevronRight, Download, Save } from "lucide-react";

import { TopBar } from "@/components/shared/top-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EditTimeSchedule } from "@/components/admin/edit-quran-timetable";

import { useCurrentUser } from "@/hooks/useAccount";
import { useSchedules, useTutors } from "@/hooks/useAdmin";
import { useEffect, useState } from "react";

export default function EditTimetable() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

  const { data: schedules, isLoading: schedulesLoading } = useSchedules();
  const { data: tutors, isLoading: tutorsLoading } = useTutors();

  // State to track edited schedules
  const [editedSchedules, setEditedSchedules] = useState<Schedule[]>([]);

  // Initialize state when schedules are fetched
  useEffect(() => {
    if (schedules?.records) {
      setEditedSchedules(schedules.records);
    }
  }, [schedules]);

  // Handle Save button click
  const handleSave = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/schedules", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedSchedules),
      });

      if (!response.ok) throw new Error("Failed to save schedules");

      console.log("Schedules saved successfully!");
      // Optional: Invalidate cache or refetch data here
    } catch (error) {
      console.error("Error saving schedules:", error);
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
            >
              <Save className="w-6 h-6" strokeWidth={3} />
              <span>Save</span>
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
