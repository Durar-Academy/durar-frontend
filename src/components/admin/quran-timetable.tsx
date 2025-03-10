import { daysOfWeek, timeSlots } from "@/data/constants";

type ProcessedData = {
  [day: string]: {
    [timeSlot: string]: Schedule[];
  };
};

export function FixedTimeSchedule({ schedules }: { schedules: Schedule[] }) {
  const processSchedules = (schedules: Schedule[]): ProcessedData => {
    // Process data into a format for easy lookup by day and time
    const processedData: ProcessedData = {};

    // Instantiate the slots
    daysOfWeek.forEach((day) => {
      processedData[day] = {};

      timeSlots().forEach((slot) => (processedData[day][slot] = []));
    });

    console.log(processedData);

    schedules.forEach((_class) => {
      const day = _class.day.charAt(0).toUpperCase() + _class.day.slice(1);

      // Extract hours from ISO time strings
      // const startHour = new Date(_class.start).getHours();
      // const endHour = new Date(_class.end).getHours();
      const startHour = _class.start.split(":")[0];
      const endHour = _class.end.split(":")[0];

      // Format for lookup
      const timeSlot = `${startHour.toString().padStart(2, "0")}:00 - ${endHour
        .toString()
        .padStart(2, "0")}:00`;

      // Add record to the appropriate slot if it exists
      if (processedData[day] && processedData[day][timeSlot]) {
        processedData[day][timeSlot].push(_class);
      }
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
            {timeSlots().map((timeSlot, index) => (
              <tr key={timeSlot + index}>
                <td className="border p-6 font-medium">{timeSlot}</td>
                {daysOfWeek.map((day, index) => (
                  <td key={`${day}-${timeSlot}-${index}`} className="border p-6">
                    {classData[day] &&
                    classData[day][timeSlot] &&
                    classData[day][timeSlot].length > 0
                      ? classData[day][timeSlot].map((record, index) => (
                          <div
                            key={record.id + index}
                            className="text-center bg-offwhite rounded-lg text-high p-3 mb-2"
                          >
                            {record.user?.firstName ?? "Tutor"} {record.user?.lastName ?? "Tutor"}
                            {/* <div className="text-sm text-gray-600">{record.course.title}</div> */}
                          </div>
                        ))
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
