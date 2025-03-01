import { useState } from "react";
import Select, { MultiValue } from "react-select";

import { daysOfWeek, timeSlots } from "@/data/constants";

type ProcessedData = {
  [day: string]: {
    [timeSlot: string]: Schedule[];
  };
};

type TutorOption = {
  value: string;
  label: string;
};

export function EditTimeSchedule({
  schedules,
  tutors,
  onSave,
}: {
  schedules: Schedule[];
  tutors: Tutor[];
  onSave: (schedules: Schedule[]) => void;
}) {
  const [classSchedule, setClassSchedule] = useState<Schedule[]>(schedules);

  console.log(classSchedule);

  const processSchedules = (schedules: Schedule[]): ProcessedData => {
    const processedData: ProcessedData = {};

    daysOfWeek.forEach((day) => {
      processedData[day] = {};
      timeSlots().forEach((slot) => (processedData[day][slot] = []));
    });

    schedules.forEach((_class) => {
      const day = _class.day.charAt(0).toUpperCase() + _class.day.slice(1);

      const startHour = new Date(_class.startTime).getHours();
      const endHour = new Date(_class.endTime).getHours();

      const timeSlot = `${startHour.toString().padStart(2, "0")}:00 - ${endHour
        .toString()
        .padStart(2, "0")}:00`;

      if (processedData[day]?.[timeSlot]) {
        processedData[day][timeSlot].push(_class);
      }
    });

    return processedData;
  };

  const classData = processSchedules(classSchedule);
  console.log(classData);

  const tutorOptions: TutorOption[] = tutors.map((tutor) => ({
    value: tutor.id,
    label: `${tutor.firstName} ${tutor.lastName}`,
  }));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSave = () => {
    onSave(classSchedule);
  };

  const handleTutorChange = (
    day: string,
    timeSlot: string,
    selectedOptions: MultiValue<TutorOption>,
  ) => {
    // Filter out all existing schedules for the current day and time slot
    let updatedSchedules = classSchedule.filter((schedule) => {
      const scheduleDay = schedule.day.charAt(0).toUpperCase() + schedule.day.slice(1);
      if (scheduleDay !== day) return true;

      const startHour = new Date(schedule.startTime).getHours();
      const endHour = new Date(schedule.endTime).getHours();
      const scheduleTimeSlot = `${startHour.toString().padStart(2, "0")}:00 - ${endHour
        .toString()
        .padStart(2, "0")}:00`;

      return scheduleTimeSlot !== timeSlot;
    });

    // Add new schedules for each selected tutor
    selectedOptions.forEach((option) => {
      const tutor = tutors.find((t) => t.id === option.value);
      if (!tutor) return;

      const [start, end] = timeSlot.split(" - ");
      const startHour = parseInt(start.split(":")[0]);
      const endHour = parseInt(end.split(":")[0]);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentDay = now.getDate();

      const startTime = new Date(
        Date.UTC(currentYear, currentMonth, currentDay, startHour - 1, 0, 0),
      ).toISOString();
      const endTime = new Date(
        Date.UTC(currentYear, currentMonth, currentDay, endHour - 1, 0, 0),
      ).toISOString();

      const newSchedule: Schedule = {
        id: tutor.id, // Ensure this is unique; consider using a different id if necessary
        day: day.toLowerCase(),
        startTime: startTime as unknown as Date,
        endTime: endTime as unknown as Date,
        user: tutor,
        // Include other necessary Schedule properties with appropriate defaults or values
        courseId: "",
        status: "",
        userId: tutor.id,
        createdAt: "",
        updatedAt: "",
        deletedAt: null,
        course: {
          id: "",
          title: "",
          description: "",
          thumbnailId: null,
          status: "published",
          language: null,
          category: null,
          difficultyLevel: null,
          enableCertification: false,
          trackProgress: false,
          enableComments: false,
          additionalNotes: null,
          prerequisites: [],
          createdById: "",
          deletedAt: null,
          createdAt: "",
          updatedAt: "",
          Lesson: [],
          UserCourse: [],
          averageRating: 0,
          CourseRating: [],
          completionRate: 0,
        },
      };

      updatedSchedules = [...updatedSchedules, newSchedule];
    });

    setClassSchedule(updatedSchedules);
  };

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
                {daysOfWeek.map((day, index) => {
                  const selectedTutors = classData[day][timeSlot] || [];

                  const selectedOptions = selectedTutors.map((schedule) => ({
                    value: schedule.user.id,
                    label: `${schedule.user.firstName} ${schedule.user.lastName}`,
                  }));

                  return (
                    <td key={`${day}-${timeSlot}-${index}`} className="border p-6">
                      <Select
                        isMulti
                        options={tutorOptions}
                        value={selectedOptions}
                        onChange={(selected) => handleTutorChange(day, timeSlot, selected || [])}
                        placeholder="Select Tutors..."
                        className="react-select-container mb-2 text-high"
                        classNamePrefix="react-select"
                      />

                      {classData[day] &&
                      classData[day][timeSlot] &&
                      classData[day][timeSlot].length > 0
                        ? classData[day][timeSlot].map((record, index) => (
                            <div
                              key={record.id + index}
                              className="text-center bg-offwhite rounded-lg text-high p-3 mb-2"
                            >
                              {record.user.firstName} {record.user.lastName}
                              {/* <div className="text-sm text-gray-600">{record.course.title}</div> */}
                            </div>
                          ))
                        : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
