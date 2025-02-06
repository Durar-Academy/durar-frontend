import React from "react";
import {
  CheckCircle,
  CircleDollarSign,
  Glasses,
  GraduationCap,
  Info,
  Layers2,
  List,
  Logs,
  MessageSquareText,
  NotepadText,
  PanelsTopLeft,
  Users,
} from "lucide-react";

import { formatDateAndTime, formatToNaira } from "@/utils/formatter";

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
    const id = payment.charge.id;
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

export const processStudentsMetrics = (studentsMetrics: StudentsMetrics): OverviewCardProps[] => {
  return [
    {
      title: "Total Students",
      figure: String(studentsMetrics.students),
      children: React.createElement(List, { key: "icon", className: "w-6 h-6 text-orange" }),
    },

    {
      title: "Active Students",
      figure: String(studentsMetrics.activeStudents),
      children: React.createElement(CheckCircle, { key: "icon", className: "w-6 h-6 text-success" }),
    },

    {
      title: "Graduated",
      figure: String(studentsMetrics.graduatedStudents),
      children: React.createElement(GraduationCap, { key: "icon", className: "w-6 h-6 text-orange" }),
    },

    {
      title: "Inactive",
      figure: String(studentsMetrics.inactiveStudents),
      children: React.createElement(Info, { key: "icon", className: "w-6 h-6 text-danger" }),
    },
  ];
};

export const processStudents = (students: Student[]) => {
  const extractedStudents = students.map((student) => {
    const id = student.id;
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

export const processStudentManagementLinks = (studentId: string) => {
  return [
    { label: "Overview Section", icon: PanelsTopLeft, url: `/admin/students/${studentId}` },

    { label: "Course Information", icon: Layers2, url: `/admin/students/${studentId}/course-information` },

    { label: "Activity Log", icon: Logs, url: `/admin/students/${studentId}/activity-log` },

    { label: "Payment Information", icon: CircleDollarSign, url: `/admin/students/${studentId}/payment-information` },

    { label: "Assignment & Grades", icon: NotepadText, url: `/admin/students/${studentId}/assignment-grades` },

    { label: "Comments & Notes", icon: MessageSquareText, url: `/admin/students/${studentId}/comments-notes` },
  ];
};

export const processStudentMetrics = (studentMetrics: StudentsMetrics): OverviewCardProps[] => {
  return [
    {
      title: "Total Courses",
      figure: String(studentMetrics.coursesCount),
      children: React.createElement(List, { key: "icon", className: "w-6 h-6 text-orange" }),
    },

    {
      title: "Completion",
      figure: `${studentMetrics.completion ?? 0}%`,
      children: React.createElement(CheckCircle, { key: "icon", className: "w-6 h-6 text-success" }),
    },

    {
      title: "Courses Completed",
      figure: String(studentMetrics.coursesCompleted),
      children: React.createElement(GraduationCap, { key: "icon", className: "w-6 h-6 text-orange" }),
    },
  ];
};

export const processStudentCourses = (courses: Courses[]) => {
  const extractedCourses = courses.map(({ course }) => {
    const id = course.id;
    const courseTitle = course.title;
    const progress = "-";
    const startDate = "-";
    const dueDate = "-";
    const completionDate = "-";

    return {
      id,
      courseTitle,
      progress,
      startDate,
      dueDate,
      completionDate,
    };
  });

  return extractedCourses;
};
