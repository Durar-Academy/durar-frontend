import { formatDateAndTime } from "./formatter";

export function processSchedules(schedules: Schedule[]) {
  const extractedSchedulesDetails = schedules.map((schedule) => {
    const firstName = schedule.user.firstName;
    const lastName = schedule.user.lastName;
    const startTime = schedule.startTime;

    const { date, time } = formatDateAndTime(startTime);

    return {
      firstName,
      lastName,
      date,
      time,
    };
  });

  return extractedSchedulesDetails;
}
