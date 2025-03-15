import { deleteCookie } from "cookies-next";
import {
  Bell,
  BookText,
  Columns2,
  Grid2X2,
  LogOut,
  Settings,
  Table2,
  Wallet,
  Layers2,
  PanelsTopLeft,
} from "lucide-react";
import React from "react";

import { ButtonComponent } from "@/components/admin/button-component";
import { LinkComponent } from "@/components/admin/link-component";
import { SelectComponent } from "@/components/admin/select-component";

import { COUNTRY_DATA } from "./data";

export const TITLES = ["Mr", "Mrs", "Ms", "Dr"] as const;

export const GENDERS = ["Male", "Female"] as const;

export const COUNTRIES = COUNTRY_DATA.map((country) => country.name) as unknown as readonly [
  string,
  ...string[],
];

export const DAILING_CODES = Array.from(
  new Set(COUNTRY_DATA.map((country) => `${country.name} (${country.dialingCode})`)),
) as unknown as readonly [string, ...string[]];

export const STORE_KEY = "durar-academy";

export const ADMIN_SIDEBAR_LINKS: ComponentConfig[] = [
  {
    type: "link",
    component: LinkComponent,
    props: {
      href: "/admin",
      children: [React.createElement(Grid2X2, { key: "icon", className: "h-4 w-4" }), "Dashboard"],
      exact: true,
    },
  },
  {
    type: "select",
    component: SelectComponent,
    props: {
      options: [
        { value: "/admin/students", label: "Students" },
        { value: "/admin/tutors", label: "Tutors" },
      ],
    },
  },
  {
    type: "link",
    component: LinkComponent,
    props: {
      href: "/admin/courses",
      children: [React.createElement(BookText, { key: "icon", className: "h-4 w-4" }), "Courses"],
    },
  },
  {
    type: "link",
    component: LinkComponent,
    props: {
      href: "/admin/timetable",
      children: [React.createElement(Columns2, { key: "icon", className: "h-4 w-4" }), "Timetable"],
    },
  },
  {
    type: "link",
    component: LinkComponent,
    props: {
      href: "/admin/assignments",
      children: [React.createElement(Table2, { key: "icon", className: "h-4 w-4" }), "Assignment"],
    },
  },
  {
    type: "link",
    component: LinkComponent,
    props: {
      href: "/admin/payments",
      children: [React.createElement(Wallet, { key: "icon", className: "h-4 w-4" }), "Payments"],
    },
  },
  {
    type: "link",
    component: LinkComponent,
    props: {
      href: "/admin/notification",
      children: [React.createElement(Bell, { key: "icon", className: "h-4 w-4" }), "Notification"],
    },
  },
  {
    type: "link",
    component: LinkComponent,
    props: {
      href: "/admin/settings",
      children: [React.createElement(Settings, { key: "icon", className: "h-4 w-4" }), "Settings"],
    },
  },
  {
    type: "button",
    component: ButtonComponent,
    props: {
      href: "/auth",
      onClick: () => {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("userRole");
      },
      children: [React.createElement(LogOut, { key: "icon", className: "h-4 w-4" }), "Logout"],
    },
  },
];

export const PAYMENT_STATUSES = [
  { status: "pending", label: "Pending" },
  { status: "failed", label: "Failed" },
  { status: "refunded", label: "Refunded" },
  { status: "completed", label: "Completed" },
];

export const ASSIGNMENT_STATUSES = [
  { status: "pending", label: "Pending" },
  { status: "submitted", label: "Submitted" },
  { status: "graded", label: "Graded" },
];

export const STUDENT_STATUSES = [
  {
    status: "unverified",
    label: "Unverified",
  },

  {
    status: "active",
    label: "Active",
  },

  {
    status: "suspended",
    label: "Suspended",
  },

  {
    status: "deactivated",
    label: "Deactivated",
  },

  {
    status: "graduated",
    label: "Graduated",
  },
];

export const TUTOR_STATUSES = [
  {
    status: "unverified",
    label: "Unverified",
  },

  {
    status: "active",
    label: "Active",
  },

  {
    status: "suspended",
    label: "Suspended",
  },

  {
    status: "deactivated",
    label: "Deactivated",
  },

  {
    status: "invited",
    label: "Invited",
  },
];

export const defaultCreateFormValues = {
  title: "",
  description: "",
  thumbnailId: null,

  category: "",
  Lesson: [{ name: "", video: null, id: 1, type: "video", isLocked: true }],
  language: "",
  difficultyLevel: "",
  enableCertification: false,
  trackProgress: false,
  enableComments: false,
  additionalNotes: "",
  status: "published" as CourseStatus,
};

export const COURSE_LANGUAGE = [
  {
    status: "english",
    label: "English",
  },
  {
    status: "arabic",
    label: "Arabic",
  },
  {
    status: "french",
    label: "French",
  },
];

export const COURSE_CATEGORY = [
  {
    status: "fiqh_hadith",
    label: "Fiqh/Hadith",
  },
  {
    status: "tajweed",
    label: "Tajweed",
  },
  {
    status: "tawheed",
    label: "Tawheed",
  },
  {
    status: "arabic",
    label: "Arabiyyah",
  },
  {
    status: "memorization",
    label: "Memorization",
  },
  {
    status: "nahwu",
    label: "Nahwu",
  },
  {
    status: "surf",
    label: "Surf",
  },
];

export const COURSE_DIFFICULTY = [
  {
    status: "beginner",
    label: "Beginner",
  },

  {
    status: "intermediate",
    label: "Intermediate",
  },

  {
    status: "advanced",
    label: "Advanced",
  },
];

export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Create fixed time slots from 0:00 to 23:00 (12 to 12pm)
export function timeSlots(): string[] {
  const timeSlots: string[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const startHour = hour.toString().padStart(2, "0");
    const endHour = (hour + 1).toString().padStart(2, "0");
    timeSlots.push(`${startHour}:00 - ${endHour}:00`);
  }

  return timeSlots;
}

export const QURAN_ID = "cm80bspne0001f72obj1pt2vi";

export const NEW_ASSIGNMENT_OPTIONS = [
  { label: "Assignment", url: "/admin/assignments/add-assignment" },
  { label: "Quiz", url: "/admin/assignments/add-quiz" },
];

export const createAssignmentDefaultValues: CreateAssignment = {
  title: "",
  courseId: "",
  dueAt: null,
  description: "",
  allowLate: false,
  totalScore: 10,
  thumbnail: null,
};

export const quizLinks = [
  { label: "Quiz Details", icon: PanelsTopLeft, url: `/admin/assignments/add-quiz` },

  {
    label: "Questions",
    icon: Layers2,
    url: `/admin/assignments/add-quiz/questions`,
  },
];

export const createQuizDefaultValues: CreateQuiz = {
  title: "",
  courseId: "",
  dueAt: null,
  description: "",
  allowLate: false,
  totalScore: 10,
  randomnize: false,
  duration: 0,
  autograded: false,

  questions: [
    {
      id: 1,
      questionText: "",
      options: [
        {
          id: 1,
          optionText: "",
        },
      ],
      correctAnswerId: null,
    },
  ],
};
