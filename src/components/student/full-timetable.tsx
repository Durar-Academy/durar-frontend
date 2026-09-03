import { useState } from "react";

import { daysOfWeek, timeSlots } from "@/data/constants";
import { StudentScheduleDetailModal } from "@/components/student/schedule-detail-modal";

type ProcessedData = {
  [day: string]: {
    [timeSlot: string]: Schedule[];
  };
};

export function FullTimeSchedule({ schedules }: { schedules: Schedule[] }) {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const processSchedules = (schedulesData: any): ProcessedData => {
    const processedData: ProcessedData = {};

    if (!schedulesData) return processedData;

    const processClass = (_class: any) => {
      if (!_class?.day || !_class?.start || !_class?.end) return;

      const day = _class.day.charAt(0).toUpperCase() + _class.day.slice(1);

      const startHour = _class.start.split(":")[0];
      const endHour = _class.end.split(":")[0];

      const timeSlot = `${startHour.padStart(2, "0")}:00 - ${endHour.padStart(2, "0")}:00`;

      if (!processedData[day]) processedData[day] = {};
      if (!processedData[day][timeSlot]) processedData[day][timeSlot] = [];

      processedData[day][timeSlot].push(_class);
    };

    if (Array.isArray(schedulesData)) {
      schedulesData.forEach(processClass);
    } else if (typeof schedulesData === "object") {
      Object.values(schedulesData).forEach((dayArray: any) => {
        if (Array.isArray(dayArray)) {
          dayArray.forEach(processClass);
        }
      });
    }

    return processedData;
  };

  const classData = processSchedules(schedules);

  // Extract only the time slots that contain data
  const filteredTimeSlots = timeSlots().filter((slot) =>
    daysOfWeek.some((day) => classData[day] && classData[day][slot]),
  );

  return (
    <div className="w-full mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border text-high font-semibold text-base leading-5 p-6 bg-offwhite">
                PERIOD
              </th>
              {daysOfWeek.map((day) => (
                <th
                  key={day}
                  className="border p-6 text-high font-semibold text-base leading-5 bg-white"
                >
                  {day.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredTimeSlots.map((timeSlot, index) => (
              <tr key={timeSlot + index}>
                <td className="border p-6 font-medium">{timeSlot}</td>
                {daysOfWeek.map((day, index) => (
                  <td key={`${day}-${timeSlot}-${index}`} className="border p-6">
                    {classData[day] && classData[day][timeSlot] ? (
                      classData[day][timeSlot].map((record, index) => (
                        <button
                          key={record.id + index}
                          type="button"
                          onClick={() => setSelectedSchedule(record)}
                          className="w-full text-center bg-offwhite rounded-lg text-high p-3 mb-2 cursor-pointer hover:border hover:border-orange hover:shadow-sm transition-all"
                        >
                          {record.course?.title ?? "Course"}
                        </button>
                      ))
                    ) : (
                      <p className="text-low text-sm font-medium text-center">No class</p>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StudentScheduleDetailModal
        open={!!selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
        schedule={selectedSchedule}
      />
    </div>
  );
}
