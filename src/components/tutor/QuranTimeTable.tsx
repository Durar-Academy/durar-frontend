"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTutorTimetable } from "@/hooks/tutorQueries";
import { processTutorTimetable } from "@/utils/tutorProcessor";

import {
  ScheduleDetailModal,
  type ScheduleDetailData,
} from "@/components/admin/schedule-detail-modal";

function getMeetingUrl(link?: string | null) {
  const value = link?.trim();
  if (!value) return null;

  const markdownLink = value.match(/^\[[^\]]+\]\((https?:\/\/[^\s)]+)\)$/);
  return markdownLink ? markdownLink[1] : value;
}

type RawRecord = NonNullable<
  NonNullable<ReturnType<typeof useTutorTimetable>["data"]>["records"]
>[number];

export default function QuranTimetable() {
  const tableRef = useRef<HTMLDivElement>(null);

  const { data: timetableData, isLoading: loading, error: queryError } = useTutorTimetable({});

  const timetable = processTutorTimetable(timetableData);
  const error = queryError ? "Failed to load timetable. Please try again." : "";

  const days = ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"];

  const [selectedRecord, setSelectedRecord] = useState<RawRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDownload = async () => {
    if (tableRef.current) {
      const dataUrl = await toPng(tableRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "quran-timetable.png";
      link.click();
    }
  };

  const buildDetailData = (record: RawRecord): ScheduleDetailData => ({
    courseTitle: record.course?.title ?? "Untitled",
    status: record.status,
    day: record.day,
    start: record.start,
    end: record.end,
    link: record.link,
    tutorName: `${record.user?.firstName ?? ""} ${record.user?.lastName ?? ""}`.trim(),
    tutorEmail: record.user?.email ?? "",
    studentName: record.student
      ? `${record.student.firstName} ${record.student.lastName}`
      : null,
    studentEmail: record.student?.email ?? null,
  });

  return (
    <>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Quran Timetable</h2>
          <Button
            className="bg-orange text-sm font-medium text-white hover:bg-orange/90 flex justify-center items-center gap-1.5"
            onClick={handleDownload}
          >
            <Image
              src={"/SVGs/download.svg"}
              width={20}
              height={20}
              alt="download icon"
            />
            <span>Download</span>
          </Button>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="text-red-500 font-medium p-4 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className="h-10 bg-gray-200 animate-pulse rounded"
              ></div>
            ))}
          </div>
        ) : (
          <div
            ref={tableRef}
            className="overflow-x-auto rounded-lg border p-4 bg-white"
          >
            <table className="w-full text-sm text-center border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">PERIOD</th>
                  {days.map((day) => (
                    <th key={day} className="border p-2">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timetable.map((entry, index) => (
                  <tr key={index}>
                    <td className="border p-2 font-medium">{entry.period}</td>
                    {days.map((day) => {
                      const schedule = entry.schedule[day];
                      const meetingUrl = getMeetingUrl(schedule?.link);

                      return (
                      <td key={day} className="border p-2">
                        {schedule ? (
                          <div className="space-y-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const record = timetableData?.records?.find(
                                (r) => r.id === schedule.id,
                              );
                              if (record) {
                                setSelectedRecord(record);
                                setModalOpen(true);
                              }
                            }}
                            className="w-full text-left cursor-pointer hover:bg-orange/5 rounded-lg transition-colors p-1 -m-1"
                          >
                            <p className="font-medium">{schedule.studentName}</p>
                          </button>

                          {meetingUrl ? (
                            <a
                              href={meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange text-xs underline"
                            >
                              Start Class
                            </a>
                          ) : (
                            <p className="text-low text-xs">No class link</p>
                          )}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-xs">N/A</p>
                        )}
                      </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ScheduleDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        schedule={selectedRecord ? buildDetailData(selectedRecord) : null}
      />
    </>
  );
}
