import React from "react";
import {
  CheckCircle,
  CircleDollarSign,
  Glasses,
  GraduationCap,
  Info,
  Layers2,
  LineChart,
  List,
  Logs,
  MessageSquareText,
  NotepadText,
  PanelsTopLeft,
  ScanFace,
  Users,
} from "lucide-react";

import { formatDateAndTime, formatAmount } from "@/utils/formatter";
import { format } from "date-fns";

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
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

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
        figure: formatAmount(metrics?.creditedPayments ?? 0),
        label: "Credited",
      },

      sub: {
        figure: formatAmount(metrics?.pendingPayments ?? 0),
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
      children: React.createElement(CheckCircle, {
        key: "icon",
        className: "w-6 h-6 text-success",
      }),
    },

    {
      title: "Graduated Students",
      figure: String(studentsMetrics.graduatedStudents),
      children: React.createElement(GraduationCap, {
        key: "icon",
        className: "w-6 h-6 text-orange",
      }),
    },

    {
      title: "Inactive Students",
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

    {
      label: "Course Information",
      icon: Layers2,
      url: `/admin/students/${studentId}/course-information`,
    },

    { label: "Activity Log", icon: Logs, url: `/admin/students/${studentId}/activity-log` },

    {
      label: "Payment Information",
      icon: CircleDollarSign,
      url: `/admin/students/${studentId}/payment-information`,
    },

    {
      label: "Assignment & Grades",
      icon: NotepadText,
      url: `/admin/students/${studentId}/assignment-grades`,
    },

    {
      label: "Comments & Notes",
      icon: MessageSquareText,
      url: `/admin/students/${studentId}/comments-notes`,
    },
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
      children: React.createElement(CheckCircle, {
        key: "icon",
        className: "w-6 h-6 text-success",
      }),
    },

    {
      title: "Courses Completed",
      figure: String(studentMetrics.coursesCompleted),
      children: React.createElement(GraduationCap, {
        key: "icon",
        className: "w-6 h-6 text-orange",
      }),
    },
  ];
};

export const processStudentCourses = (courses: Courses[]) => {
  const extractedCourses = courses.map((course) => {
    const id = course.course.id;
    const courseTitle = course.course.title;
    const progress = course.progress;
    const startDate = format(new Date(course.startAt as Date), "PP");
    const completionDate = format(new Date(course.completeAt as Date), "PP");

    return {
      id,
      courseTitle,
      progress,
      startDate,
      completionDate,
    };
  });

  return extractedCourses;
};

export const processStudentPaymentOverview = (
  studentPaymentOverview: StudentsMetrics,
): OverviewCardProps[] => {
  const planFigure = studentPaymentOverview.currentBillingPlan
    ? `${formatAmount(
        studentPaymentOverview.currentBillingPlan.billingPlan.amount,
        studentPaymentOverview.currentBillingPlan.currency,
      )} ${studentPaymentOverview.currentBillingPlan.billingPlan.interval ?? ""}`
    : "-";

  const planStartDate = studentPaymentOverview.lastPayment
    ? format(new Date(studentPaymentOverview.lastPayment.createdAt), "PP")
    : "-";

  const planEndDate = studentPaymentOverview.upcomingChargeDate
    ? format(new Date(studentPaymentOverview.upcomingChargeDate), "PP")
    : "-";

  return [
    {
      title: "Plan",
      figure: planFigure,
      children: React.createElement(List, { key: "icon", className: "w-6 h-6 text-orange" }),
    },

    {
      title: "Last Payment",
      figure: planStartDate,
      children: React.createElement(CheckCircle, {
        key: "icon",
        className: "w-6 h-6 text-success",
      }),
    },

    {
      title: "Upcoming Payment",
      figure: planEndDate,
      children: React.createElement(GraduationCap, {
        key: "icon",
        className: "w-6 h-6 text-orange",
      }),
    },
  ];
};

export const processUserPayments = (payments: Payment[]) => {
  const extractedPayments = payments.map((payment) => {
    const id = payment.charge.id;
    const date = format(new Date(payment.charge.createdAt), "PP");

    const amount = payment.charge.amount;
    const status = payment.status;

    return {
      id,
      date,

      amount,
      status,
    };
  });

  return extractedPayments;
};

export const processStudentAssignments = (
  assignments: Assignment[],
): StudentAssignmentsTableProps => {
  const extractedAssignments = assignments.map((assignment) => {
    const id = assignment.id;
    const course = assignment.title;
    const date = format(new Date(assignment.createdAt), "PP");
    const status = assignment.status;

    const score = assignment.AssignmentSubmission?.[0]?.grade
      ? (assignment.AssignmentSubmission[0].grade / assignment.totalScore) * 100
      : assignment.QuizSubmission?.[0]?.grade
      ? (assignment.QuizSubmission[0].grade / assignment.totalScore) * 100
      : 0;

    return {
      id,
      course,
      date,
      score,
      status,
    };
  });

  return extractedAssignments;
};

export const processTutorsMetrics = (tutorsMetrics: TutorsMetrics): OverviewCardProps[] => {
  return [
    {
      title: "Total Tutors",
      figure: String(tutorsMetrics.tutorsCount),
      children: React.createElement(List, { key: "icon", className: "w-6 h-6 text-orange" }),
    },

    {
      title: "Active Tutors",
      figure: String(tutorsMetrics.activeTutorsCount),
      children: React.createElement(CheckCircle, {
        key: "icon",
        className: "w-6 h-6 text-success",
      }),
    },

    {
      title: "Inactive Tutors",
      figure: String(tutorsMetrics.inActiveTutorsCount),
      children: React.createElement(Info, { key: "icon", className: "w-6 h-6 text-danger" }),
    },
  ];
};

export const processTutors = (tutors: Tutor[]) => {
  const extractedTutors = tutors.map((tutor) => {
    const id = tutor.id;
    const name = `${tutor.firstName} ${tutor.lastName}`;

    const email = tutor.email;
    const status = tutor.status;

    return {
      id,
      name,
      email,
      status,
    };
  });

  return extractedTutors;
};

export const processTutorManagementLinks = (tutorId: string) => {
  return [
    { label: "Overview Section", icon: PanelsTopLeft, url: `/admin/tutors/${tutorId}` },

    {
      label: "Courses Managed",
      icon: Layers2,
      url: `/admin/tutors/${tutorId}/courses-managed`,
    },

    {
      label: "Performance Metrics",
      icon: LineChart,
      url: `/admin/tutors/${tutorId}/performance-metrics`,
    },

    {
      label: "Payment & Earnings",
      icon: CircleDollarSign,
      url: `/admin/tutors/${tutorId}/payment-earnings`,
    },

    { label: "Activity Log", icon: Logs, url: `/admin/tutors/${tutorId}/activity-log` },

    {
      label: "Verification Docs",
      icon: ScanFace,
      url: `/admin/tutors/${tutorId}/verification-docs`,
    },

    {
      label: "Notes",
      icon: MessageSquareText,
      url: `/admin/tutors/${tutorId}/notes`,
    },
  ];
};

export const processTutorMetrics = (tutorMetrics: TutorsMetrics): OverviewCardProps[] => {
  return [
    {
      title: "Total Courses",
      figure: String(tutorMetrics.coursesCount),
      children: React.createElement(List, { key: "icon", className: "w-6 h-6 text-orange" }),
    },

    {
      title: "Total Students",
      figure: String(tutorMetrics.totalStudents),
      children: React.createElement(CheckCircle, {
        key: "icon",
        className: "w-6 h-6 text-success",
      }),
    },

    {
      title: "Courses Completed",
      figure: String(tutorMetrics.totalCompletedClasses),
      children: React.createElement(GraduationCap, {
        key: "icon",
        className: "w-6 h-6 text-orange",
      }),
    },
  ];
};

export const processTutorCourses = (courses: Courses[]) => {
  const extractedCourses = courses.map((course) => {
    const id = course.course.id;
    const courseTitle = course.course.title;
    const progress = course.progress;
    const startDate = format(new Date(course.startAt as Date), "PP");
    const completionDate = format(new Date(course.completeAt as Date), "PP");
    const noOfStudents = course.course.UserCourse.length;

    return {
      id,
      courseTitle,
      progress,
      startDate,
      completionDate,
      noOfStudents,
    };
  });

  return extractedCourses;
};

export const processTutorPaymentOverview = (
  tutorPaymentOverview: TutorsMetrics,
): OverviewCardProps[] => {
  const totalEarnings = tutorPaymentOverview.totalEarnings
    ? `${formatAmount(tutorPaymentOverview.totalEarnings)}`
    : "-";

  const pendingEarnings = tutorPaymentOverview.pendingEarnings
    ? `${formatAmount(tutorPaymentOverview.pendingEarnings)}`
    : "-";

  return [
    {
      title: "Total Earnings",
      figure: totalEarnings,
      children: React.createElement(List, { key: "icon", className: "w-6 h-6 text-orange" }),
    },

    {
      title: "Pending Payments",
      figure: pendingEarnings,
      children: React.createElement(CheckCircle, {
        key: "icon",
        className: "w-6 h-6 text-success",
      }),
    },
  ];
};

export const processTutorPeformance = (tutorMetrics: TutorsMetrics): OverviewCardProps[] => {
  return [
    {
      title: "Avg Course Ratings",
      figure: String(tutorMetrics.avgCourseRating),
      children: React.createElement(List, { key: "icon", className: "w-6 h-6 text-orange" }),
    },

    {
      title: "Total Students Taught",
      figure: String(tutorMetrics.totalStudentsTaught),
      children: React.createElement(CheckCircle, {
        key: "icon",
        className: "w-6 h-6 text-success",
      }),
    },

    {
      title: "Total Classess",
      figure: String(tutorMetrics.totalClasses),
      children: React.createElement(GraduationCap, {
        key: "icon",
        className: "w-6 h-6 text-orange",
      }),
    },
  ];
};
