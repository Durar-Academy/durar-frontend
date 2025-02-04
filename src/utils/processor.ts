import React from "react";
import { CheckCircle, CircleDollarSign, Glasses, GraduationCap, Info, List, Users } from "lucide-react";

import { formatDateAndTime, formatToReadableId } from "@/utils/formatter";
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

export const processPayments = (payments: Payment[]) => {
  const extractedPayments = payments.map((payment) => {
    const id = formatToReadableId(payment.chargeId, "INV");
    const amount = payment.charge.amount;
    const { date: dateIssued } = formatDateAndTime(payment.charge.createdAt);
    const { date: dueDate } = formatDateAndTime(payment.charge.dueAt);
    const paymentMethod = payment.provider;
    const status = payment.status;

    return {
      id,
      amount,
      dateIssued,
      dueDate,
      paymentMethod,
      status,
    };
  });

  return extractedPayments;
};

export const processStudentsOverview = (studentsOverview: StudentsOverview): OverviewCardProps[] => {
  return [
    {
      title: "Total Students",
      figure: studentsOverview.students,
      children: React.createElement(List, { key: "icon", className: "w-6 h-6 text-orange" }),
    },

    {
      title: "Active Students",
      figure: studentsOverview.activeStudents,
      children: React.createElement(CheckCircle, { key: "icon", className: "w-6 h-6 text-success" }),
    },

    {
      title: "Graduated",
      figure: studentsOverview.graduatedStudents,
      children: React.createElement(GraduationCap, { key: "icon", className: "w-6 h-6 text-orange" }),
    },

    {
      title: "Inactive",
      figure: studentsOverview.inactiveStudents,
      children: React.createElement(Info, { key: "icon", className: "w-6 h-6 text-danger" }),
    },
  ];
};

export const processStudents = (students: User[]) => {
  const extractedStudents = students.map((student) => {
    const id = formatToReadableId(student.id, "STND");
    const name = `${student.firstName} ${student.lastName}`;
    const category = student?.gender ?? "Unspecified";
    const email = student.email;
    const status = student.status;

    return {
      id,
      name,
      category,
      email,
      status,
    };
  });

  return extractedStudents;
};
