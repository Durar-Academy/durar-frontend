import { CircleDollarSign, Glasses, Users } from "lucide-react";

import { formatDateAndTime } from "@/utils/formatter";
import { formatToNaira } from "@/utils/formatter";

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

export const processEnrollmentData = (users: User[]): EnrollmentData => {
  const enrollmentData: EnrollmentData = {};
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  users.forEach((user) => {
    const createdAt = new Date(user.createdAt);
    if (isNaN(createdAt.getTime())) return;

    const year = createdAt.getUTCFullYear().toString();
    const monthIndex = createdAt.getUTCMonth();

    if (!enrollmentData[year]) {
      enrollmentData[year] = months.map((month) => ({ month, value: 0 }));
    }

    enrollmentData[year][monthIndex].value += 1;
  });

  return enrollmentData;
};

export const processDashboardMetrics = (metrics: Metrics): StatCardProps[] => {
  return [
    {
      title: "Students",
      icon: Users,

      main: {
        figure: String(metrics?.studentsCount ?? 0),
        label: "Total",
      },

      sub: {
        figure: String(metrics?.activeStudentsCount ?? 0),
        label: "Active",
      },
    },

    {
      title: "Tutors",
      icon: Users,

      main: {
        figure: String(metrics?.tutorsCount ?? 0),
        label: "Total",
      },

      sub: {
        figure: String(metrics?.activeTutorsCount ?? 0),
        label: "Active",
      },
    },

    {
      title: "Courses offered",
      icon: Glasses,

      main: {
        figure: String(metrics?.totalCoursesCount ?? 0),
        label: "Courses",
      },

      sub: {
        figure: String(metrics?.publishedCoursesCount ?? 0),
        label: "Published",
      },
    },

    {
      title: "Payments",
      icon: CircleDollarSign,

      main: {
        figure: formatToNaira(metrics?.creditedPayments ?? 0),
        label: "Credited",
      },

      sub: {
        figure: formatToNaira(metrics?.pendingPayments ?? 0),
        label: "Pending",
      },
    },
  ];
};

export const processActivities = (activities: Activity[]) => {
  const processedActivities = activities.map((activity) => activity.action);

  return processedActivities;
};
