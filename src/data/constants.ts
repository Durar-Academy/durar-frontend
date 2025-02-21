import React from "react";
import { Bell, BookText, Columns2, Grid2X2, LogOut, Settings, Table2, Wallet } from "lucide-react";
import { deleteCookie } from "cookies-next";

import { LinkComponent } from "@/components/admin/link-component";
import { SelectComponent } from "@/components/admin/select-component";
import { ButtonComponent } from "@/components/admin/button-component";

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
      href: "/admin/assignment",
      children: [React.createElement(Table2, { key: "icon", className: "h-4 w-4" }), "Assignment"],
    },
  },
  {
    type: "link",
    component: LinkComponent,
    props: {
      href: "/admin/payment",
      children: [React.createElement(Wallet, { key: "icon", className: "h-4 w-4" }), "Payment"],
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
