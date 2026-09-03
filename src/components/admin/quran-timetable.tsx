"use client";

import { useState } from "react";
import { GraduationCap, UserRound } from "lucide-react";

import { daysOfWeek, timeSlots } from "@/data/constants";

import {
  ScheduleDetailModal,
  type ScheduleDetailData,
} from "./schedule-detail-modal";

type TimetableEntry = {
  id: string;
  day: string;
  start: string;
  end: string;
  status: string;
  link?: string | null;
  course: {
    id: string;
    title: string;
    category: string | null;
  };
  tutor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

type ProcessedData = {
  [day: string]: {
    [timeSlot: string]: TimetableEntry[];
  };
};

const statusColor: Record<string, string> = {
  scheduled: "bg-success",
  cancelled: "bg-destructive",
  completed: "bg-low",
};

export function FixedTimeSchedule({ schedules }: { schedules: Record<string, TimetableEntry[]> }) {
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const processSchedules = (schedulesData: Record<string, TimetableEntry[]>): ProcessedData => {
    const processedData: ProcessedData = {};

    daysOfWeek.forEach((day) => {
      processedData[day] = {};
      timeSlots().forEach((slot) => (processedData[day][slot] = []));
    });

    if (!schedulesData) return processedData;

    const processClass = (entry: TimetableEntry) => {
      if (!entry?.day || !entry?.start || !entry?.end) return;

      const day = entry.day.charAt(0).toUpperCase() + entry.day.slice(1);
      const startHour = entry.start.split(":")[0];
      const endHour = entry.end.split(":")[0];
      const timeSlot = `${startHour.padStart(2, "0")}:00 - ${endHour.padStart(2, "0")}:00`;

      if (processedData[day] && processedData[day][timeSlot]) {
        processedData[day][timeSlot].push(entry);
      }
    };

    Object.values(schedulesData).forEach((dayArray) => {
      if (Array.isArray(dayArray)) {
        dayArray.forEach(processClass);
      }
    });

    return processedData;
  };

  const classData = processSchedules(schedules);

  const scheduleDetailData: ScheduleDetailData | null = selectedEntry
    ? {
        courseTitle: selectedEntry.course?.title ?? "Untitled",
        status: selectedEntry.status,
        day: selectedEntry.day,
        start: selectedEntry.start,
        end: selectedEntry.end,
        link: selectedEntry.link,
        tutorName: `${selectedEntry.tutor?.firstName ?? ""} ${selectedEntry.tutor?.lastName ?? ""}`.trim(),
        tutorEmail: selectedEntry.tutor?.email ?? "",
        studentName: selectedEntry.student
          ? `${selectedEntry.student.firstName} ${selectedEntry.student.lastName}`
          : null,
        studentEmail: selectedEntry.student?.email ?? null,
      }
    : null;

  return (
    <>
      <div className="w-full mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border text-high font-semibold text-sm leading-5 p-4 bg-offwhite min-w-[100px]">
                  PERIOD
                </th>

                {daysOfWeek.map((day) => (
                  <th
                    key={day}
                    className="border p-4 text-high font-semibold text-sm leading-5 bg-white min-w-[180px]"
                  >
                    {day.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {timeSlots().map((timeSlot, index) => (
                <tr key={timeSlot + index}>
                  <td className="border p-4 text-xs font-medium text-low whitespace-nowrap">
                    {timeSlot}
                  </td>

                  {daysOfWeek.map((day, dayIdx) => (
                    <td key={`${day}-${timeSlot}-${dayIdx}`} className="border p-2 align-top">
                      {classData[day]?.[timeSlot]?.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {classData[day][timeSlot].map((record, recIdx) => (
                            <button
                              key={record.id + recIdx}
                              type="button"
                              onClick={() => {
                                setSelectedEntry(record);
                                setModalOpen(true);
                              }}
                              className="rounded-lg border border-shade-2 bg-offwhite p-3 flex flex-col gap-1.5 text-left w-full cursor-pointer hover:border-orange hover:shadow-sm transition-all"
                            >
                              {/* Status indicator */}
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    statusColor[record.status] ?? "bg-low"
                                  }`}
                                />
                                <p className="text-sm font-semibold text-high leading-tight">
                                  {record.course?.title ?? "Untitled"}
                                </p>
                              </div>

                              {/* Tutor */}
                              <div className="flex items-center gap-1.5 text-xs text-low">
                                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                  {record.tutor?.firstName ?? "Tutor"}{" "}
                                  {record.tutor?.lastName ?? ""}
                                </span>
                              </div>

                              {/* Student */}
                              {record.student && (
                                <div className="flex items-center gap-1.5 text-xs text-low">
                                  <UserRound className="w-3.5 h-3.5 shrink-0" />
                                  <span>
                                    {record.student.firstName} {record.student.lastName}
                                  </span>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ScheduleDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        schedule={scheduleDetailData}
      />
    </>
  );
}
