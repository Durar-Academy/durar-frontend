"use client";

import { useCallback, useMemo } from "react";
import Select from "react-select";
import { GraduationCap, Link2, Plus, Trash2, UserRound } from "lucide-react";

import { daysOfWeek, timeSlots } from "@/data/constants";
import { Button } from "@/components/ui/button";

/** Compute the hourly grid slot for a schedule based on its start hour. */
function getTimeSlotForSchedule(s: { start: string }): string {
  const startHour = s.start.split(":")[0];
  return `${startHour.padStart(2, "0")}:00 - ${(parseInt(startHour) + 1).toString().padStart(2, "0")}:00`;
}

/** Capitalise the first letter of a day string. */
function capitaliseDay(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

type ProcessedData = {
  [day: string]: {
    [timeSlot: string]: Schedule[];
  };
};

type SelectOption = {
  value: string;
  label: string;
};

const statusColor: Record<string, string> = {
  scheduled: "bg-success",
  cancelled: "bg-destructive",
  completed: "bg-low",
  in_progress: "bg-orange",
};

export function EditTimeSchedule({
  schedules,
  tutors,
  students,
  courses,
  onSave,
}: {
  schedules: Schedule[];
  tutors: Tutor[];
  students: Student[];
  courses: Course[];
  onSave: (schedules: Schedule[]) => void;
}) {
  const processSchedules = useCallback(
    (schedulesData: Schedule[] | Record<string, Schedule[]> | null | undefined): ProcessedData => {
      const processedData: ProcessedData = {};

      daysOfWeek.forEach((day) => {
        processedData[day] = {};
        timeSlots().forEach((slot) => (processedData[day][slot] = []));
      });

      if (!schedulesData) return processedData;

      const processClass = (_class: Schedule) => {
        if (!_class?.day || !_class?.start || !_class?.end) return;

        const day =
          _class.day.charAt(0).toUpperCase() + _class.day.slice(1);
        const timeSlot = getTimeSlotForSchedule(_class);

        if (processedData[day]?.[timeSlot]) {
          processedData[day][timeSlot].push(_class);
        }
      };

      if (Array.isArray(schedulesData)) {
        schedulesData.forEach(processClass);
      } else if (typeof schedulesData === "object") {
        Object.values(schedulesData).forEach((dayArray: unknown) => {
          if (Array.isArray(dayArray)) {
            dayArray.forEach(processClass);
          }
        });
      }

      return processedData;
    },
    [],
  );

  const classData = useMemo(
    () => processSchedules(schedules),
    [schedules, processSchedules],
  );

  const tutorOptions: SelectOption[] = useMemo(
    () =>
      tutors.map((tutor) => ({
        value: tutor.id,
        label: `${tutor.firstName} ${tutor.lastName}`,
      })),
    [tutors],
  );

  const studentOptions: SelectOption[] = useMemo(
    () =>
      students.map((student) => ({
        value: student.id,
        label: `${student.firstName} ${student.lastName}`,
      })),
    [students],
  );

  const courseOptions: SelectOption[] = useMemo(
    () =>
      courses.map((course) => ({
        value: course.id,
        label: course.title,
      })),
    [courses],
  );

  const handleUpdateEntry = (
    day: string,
    timeSlot: string,
    entryIndex: number,
    field: "userId" | "studentId" | "courseId" | "link",
    value: string,
  ) => {
    const updatedSchedules = schedules.map((schedule) => {
      if (capitaliseDay(schedule.day) !== day) return schedule;
      if (getTimeSlotForSchedule(schedule) !== timeSlot) return schedule;

      // Match the specific entry by index within this cell
      const cellEntries = classData[day][timeSlot];
      const targetEntry = cellEntries[entryIndex];
      if (schedule.id !== targetEntry?.id) return schedule;

      return { ...schedule, [field]: value };
    });

    onSave(updatedSchedules);
  };

  const handleRemoveEntry = (day: string, timeSlot: string, entryIndex: number) => {
    const cellEntries = classData[day][timeSlot];
    const targetEntry = cellEntries[entryIndex];

    // Filter out the removed entry by matching its id
    const updatedSchedules = schedules.filter((schedule) => {
      if (capitaliseDay(schedule.day) !== day) return true;
      if (getTimeSlotForSchedule(schedule) !== timeSlot) return true;

      return schedule.id !== targetEntry?.id;
    });

    onSave(updatedSchedules);
  };

  const handleAddEntry = (day: string, timeSlot: string) => {
    const [start, end] = timeSlot.split(" - ");

    const newSchedule: Schedule = {
      id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      day: day.toLowerCase(),
      start,
      end,
      userId: "",
      studentId: "",
      link: "",
      courseId: "",
      status: "scheduled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      course: courses[0] ?? {
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
      user: tutors[0] ?? {
        id: "",
        email: "",
        firstName: "",
        lastName: "",
        gender: "male",
        phone: "",
        country: "",
        emailVerifiedAt: null,
        status: "active",
        lastLoginAt: null,
        role: "tutor",
        profilePictureId: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        paypalCustomerId: null,
        paypalCardCustomerId: null,
      },
    };

    onSave([...schedules, newSchedule]);
  };

  const getEntryCourse = (entry: Schedule) => {
    return courses.find((c) => c.id === entry.courseId);
  };

  const getEntryTutor = (entry: Schedule) => {
    return tutors.find((t) => t.id === entry.userId);
  };

  const getEntryStudent = (entry: Schedule) => {
    if (entry.student) return entry.student;
    return students.find((s) => s.id === entry.studentId);
  };

  return (
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
                  className="border p-4 text-high font-semibold text-sm leading-5 bg-white min-w-[240px]"
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

                {daysOfWeek.map((day, dayIdx) => {
                  const entries = classData[day]?.[timeSlot] ?? [];

                  return (
                    <td
                      key={`${day}-${timeSlot}-${dayIdx}`}
                      className="border p-2 align-top"
                    >
                      <div className="flex flex-col gap-2">
                        {entries.map((entry, entryIdx) => {
                          const entryCourse = getEntryCourse(entry);
                          const entryTutor = getEntryTutor(entry);
                          const entryStudent = getEntryStudent(entry);

                          return (
                            <div
                              key={entry.id + entryIdx}
                              className="rounded-lg border border-shade-2 bg-offwhite p-3 flex flex-col gap-2"
                            >
                              {/* Status indicator + Course select */}
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    statusColor[entry.status] ?? "bg-low"
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <Select
                                    options={courseOptions}
                                    value={
                                      entryCourse
                                        ? {
                                            value: entryCourse.id,
                                            label: entryCourse.title,
                                          }
                                        : null
                                    }
                                    onChange={(option) =>
                                      option &&
                                      handleUpdateEntry(
                                        day,
                                        timeSlot,
                                        entryIdx,
                                        "courseId",
                                        option.value,
                                      )
                                    }
                                    placeholder="Select course..."
                                    className="react-select-container text-xs"
                                    classNamePrefix="react-select"
                                    isSearchable
                                    menuPortalTarget={
                                      typeof document !== "undefined"
                                        ? document.body
                                        : undefined
                                    }
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        minHeight: "28px",
                                        fontSize: "12px",
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        fontSize: "12px",
                                      }),
                                      valueContainer: (base) => ({
                                        ...base,
                                        padding: "0 4px",
                                      }),
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Tutor select */}
                              <div className="flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5 shrink-0 text-low" />
                                <div className="flex-1 min-w-0">
                                  <Select
                                    options={tutorOptions}
                                    value={
                                      entryTutor
                                        ? {
                                            value: entryTutor.id,
                                            label: `${entryTutor.firstName} ${entryTutor.lastName}`,
                                          }
                                        : null
                                    }
                                    onChange={(option) =>
                                      option &&
                                      handleUpdateEntry(
                                        day,
                                        timeSlot,
                                        entryIdx,
                                        "userId",
                                        option.value,
                                      )
                                    }
                                    placeholder="Select tutor..."
                                    className="react-select-container text-xs"
                                    classNamePrefix="react-select"
                                    isSearchable
                                    menuPortalTarget={
                                      typeof document !== "undefined"
                                        ? document.body
                                        : undefined
                                    }
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        minHeight: "28px",
                                        fontSize: "12px",
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        fontSize: "12px",
                                      }),
                                      valueContainer: (base) => ({
                                        ...base,
                                        padding: "0 4px",
                                      }),
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Student select + Remove button */}
                              <div className="flex items-center gap-1.5">
                                <UserRound className="w-3.5 h-3.5 shrink-0 text-low" />
                                <div className="flex-1 min-w-0">
                                  <Select
                                    options={studentOptions}
                                    value={
                                      entryStudent
                                        ? {
                                            value: entryStudent.id,
                                            label: `${entryStudent.firstName} ${entryStudent.lastName}`,
                                          }
                                        : null
                                    }
                                    onChange={(option) =>
                                      option &&
                                      handleUpdateEntry(
                                        day,
                                        timeSlot,
                                        entryIdx,
                                        "studentId",
                                        option.value,
                                      )
                                    }
                                    placeholder="Select student..."
                                    className="react-select-container text-xs"
                                    classNamePrefix="react-select"
                                    isSearchable
                                    menuPortalTarget={
                                      typeof document !== "undefined"
                                        ? document.body
                                        : undefined
                                    }
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        minHeight: "28px",
                                        fontSize: "12px",
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        fontSize: "12px",
                                      }),
                                      valueContainer: (base) => ({
                                        ...base,
                                        padding: "0 4px",
                                      }),
                                    }}
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveEntry(day, timeSlot, entryIdx)
                                  }
                                  className="shrink-0 p-1 rounded-md text-low hover:text-destructive hover:bg-destructive/10 transition-colors"
                                  title="Remove entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Meeting link */}
                              <div className="flex items-center gap-1.5">
                                <Link2 className="w-3.5 h-3.5 shrink-0 text-low" />
                                <input
                                  type="url"
                                  value={entry.link ?? ""}
                                  onChange={(event) =>
                                    handleUpdateEntry(
                                      day,
                                      timeSlot,
                                      entryIdx,
                                      "link",
                                      event.target.value,
                                    )
                                  }
                                  placeholder="Meeting link..."
                                  className="min-w-0 flex-1 rounded-md border border-shade-2 bg-white px-2 py-1 text-xs text-high placeholder:text-low focus:border-orange focus:outline-none"
                                />
                              </div>
                            </div>
                          );
                        })}

                        {/* Add button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddEntry(day, timeSlot)}
                          className="flex items-center gap-1 text-xs text-low hover:text-orange w-full border border-dashed border-shade-2 rounded-lg"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add
                        </Button>
                      </div>
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
