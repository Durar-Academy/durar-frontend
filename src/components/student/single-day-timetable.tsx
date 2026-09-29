import { useState } from "react";

import { timeSlots as getAllTimeSlots } from "@/data/constants";
import { StudentScheduleDetailModal } from "@/components/student/schedule-detail-modal";

type ProcessedData = {
  [timeSlot: string]: Schedule[];
};

export function SingleDayFixedTimeSchedule({
  schedules,
  selectedDay,
}: {
  schedules: Schedule[];
  selectedDay: string;
}) {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const hasClassesOnDay = schedules.some((_class) => {
    const day = _class?.day?.charAt(0).toUpperCase() + _class?.day?.slice(1);
    return day === selectedDay;
  });

  if (!hasClassesOnDay) {
    return (
      <div className="w-full rounded-xl border border-shade-3 bg-offwhite flex items-center justify-center h-[143px]">
        <p className="text-low text-sm font-medium">No classes available for {selectedDay}</p>
      </div>
    );
  }

  const processSchedules = (schedulesData: Schedule[]): ProcessedData => {
    const processedData: ProcessedData = {};

    if (!schedulesData) return processedData;

    schedulesData.forEach((_class) => {
      if (!_class?.day || !_class?.start || !_class?.end) return;

      const day = _class.day.charAt(0).toUpperCase() + _class.day.slice(1);
      if (day !== selectedDay) return;

      const startHour = _class.start.split(":")[0];
      const endHour = _class.end.split(":")[0];
      const timeSlot = `${startHour.padStart(2, "0")}:00 - ${endHour.padStart(2, "0")}:00`;

      if (!processedData[timeSlot]) {
        processedData[timeSlot] = [];
      }
      processedData[timeSlot].push(_class);
    });

    return processedData;
  };

  const classData = processSchedules(schedules);
  const timeSlots = getAllTimeSlots();

  const COLUMN_WIDTH = 130;

  return (
    <div className="w-full rounded-xl border border-shade-3 overflow-hidden">
      {/* ── Top row: PERIOD header + time slots ── */}
      <div className="flex flex-row h-[59px] shrink-0">
        {/* Sticky header cell */}
        <div className="sticky left-0 z-10 w-[137px] min-w-[137px] h-full bg-low flex items-center pl-[14px] shrink-0">
          <span className="text-[13px] font-semibold tracking-wide text-white">PERIOD</span>
        </div>

        {/* Scrollable time slots */}
        <div className="flex flex-row overflow-x-auto hide-scrollbar">
          {timeSlots.map((timeSlot, i) => (
            <div
              key={timeSlot + i}
              className={`h-full bg-offwhite flex items-center justify-center shrink-0 border-t-0 border-b-0 border-shade-3 ${
                i === timeSlots.length - 1 ? "border-r border-shade-3" : "border-r-0"
              } ${i % 2 === 0 ? "bg-offwhite" : "bg-white"}`}
              style={{ width: COLUMN_WIDTH, minWidth: COLUMN_WIDTH }}
            >
              <span className="text-[11px] text-low font-normal whitespace-nowrap">{timeSlot}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom row: day label + schedule cards ── */}
      <div className="flex flex-row h-[84px] shrink-0 border-t border-shade-3">
        {/* Sticky day label cell */}
        <div className="sticky left-0 z-10 w-[137px] min-w-[137px] h-full bg-offwhite flex items-center justify-center shrink-0 border-r border-shade-3">
          <span className="text-[12px] font-bold text-[#222222] tracking-wide">
            {selectedDay.toUpperCase()}
          </span>
        </div>

        {/* Scrollable schedule cells */}
        <div className="flex flex-row overflow-x-auto hide-scrollbar">
          {timeSlots.map((timeSlot, i) => (
            <div
              key={timeSlot + i}
              className={`h-full flex items-center justify-center shrink-0 ${
                i === timeSlots.length - 1 ? "border-r border-shade-3" : "border-r-0"
              } ${i % 2 === 0 ? "bg-offwhite" : "bg-white"}`}
              style={{ width: COLUMN_WIDTH, minWidth: COLUMN_WIDTH }}
            >
              {classData[timeSlot]?.length ? (
                classData[timeSlot].map((record, idx) => (
                  <button
                    key={record.id + idx}
                    type="button"
                    onClick={() => setSelectedSchedule(record)}
                    className="w-[118px] bg-white border border-shade-1 rounded-lg flex flex-col items-start justify-center px-2.5 py-2 gap-0.5 cursor-pointer hover:border-orange hover:shadow-sm transition-all text-left"
                  >
                    <span className="text-xs font-semibold text-high leading-tight truncate max-w-full">
                      {record.course?.title ?? "Course"}
                    </span>
                    <span className="text-[10px] font-normal text-low leading-tight truncate max-w-full">
                      {record.user?.firstName ?? "Tutor"} {record.user?.lastName ?? ""}
                    </span>
                  </button>
                ))
              ) : (
                <span className="text-shade-3 text-sm font-medium">—</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <StudentScheduleDetailModal
        open={!!selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
        schedule={selectedSchedule}
      />
    </div>
  );
}
