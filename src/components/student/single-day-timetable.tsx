// import { timeSlots } from "@/data/constants";

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
  const processSchedules = (schedules: Schedule[]): ProcessedData => {
    const processedData: ProcessedData = {};

    schedules.forEach((_class) => {
      const day = _class.day.charAt(0).toUpperCase() + _class.day.slice(1);
      if (day !== selectedDay) return;

      const startHour = _class.start.split(":")[0];
      const endHour = _class.end.split(":")[0];
      const timeSlot = `${startHour.toString().padStart(2, "0")}:00 - ${endHour
        .toString()
        .padStart(2, "0")}:00`;

      if (!processedData[timeSlot]) {
        processedData[timeSlot] = [];
      }
      processedData[timeSlot].push(_class);
    });

    return processedData;
  };

  const classData = processSchedules(schedules);

  return (
    <div className="w-full mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border text-high font-semibold text-base leading-5 p-6 bg-offwhite">
                PERIOD
              </th>

              {Object.keys(classData).map((timeSlot, index) => (
                <th className="border p-6 font-medium" key={timeSlot + index}>
                  {timeSlot}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Object.keys(classData).length > 0 ? (
              <tr>
                <td className="border p-6 text-high font-semibold text-base leading-5 bg-white">
                  {selectedDay.toUpperCase()}
                </td>

                {Object.keys(classData).map((timeSlot, index) => (
                  <td className="border p-6" key={timeSlot + index}>
                    {classData[timeSlot].map((record, index) => (
                      <div
                        key={record.id + index}
                        className="text-center bg-offwhite rounded-lg text-high p-3 mb-2"
                      >
                        {record.user?.firstName ?? "Tutor"} {record.user?.lastName ?? "Tutor"}
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            ) : (
              <tr>
                <td colSpan={2} className="text-center text-gray-500 p-6">
                  No classes available for {selectedDay}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
