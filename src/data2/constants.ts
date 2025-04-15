import { deleteCookie } from "cookies-next";
import {
    Bell,
    BookText,
    Columns2,
    Grid2X2,
    User,
    Table2,
    Wallet,
} from "lucide-react";
import React from "react";

// import { ButtonComponent } from "@/components/admin/button-component";
import { LinkComponent } from "@/components/admin/link-component";
// import { SelectComponent } from "@/components/admin/select-component";
export const ADMIN_SIDEBAR_LINKS: ComponentConfig[] = [
    {
        type: "link",
        component: LinkComponent,
        props: {
            href: "/tutor",
            children: [React.createElement(Grid2X2, { key: "icon", className: "h-4 w-4" }), "Dashboard"],
            exact: true,
        },
    },
    //   {
    //     type: "select",
    //     component: SelectComponent,
    //     props: {
    //       options: [
    //         { value: "/admin/students", label: "Students" },
    //         { value: "/admin/tutors", label: "Tutors" },
    //       ],
    //     },
    //   },
    {
        type: "link",
        component: LinkComponent,
        props: {
            href: "/tutor/students",
            children: [React.createElement(User, { key: "icon", className: "h-4 w-4" }), "Students"],
        },
    },
    {
        type: "link",
        component: LinkComponent,
        props: {
            href: "/tutor/classes",
            children: [React.createElement(BookText, { key: "icon", className: "h-4 w-4" }), "Classes"],
        },
    },
    {
        type: "link",
        component: LinkComponent,
        props: {
            href: "/tutor/timetable",

            children: [React.createElement(Columns2, { key: "icon", className: "h-4 w-4" }), "Timetable"],
        },
    },
    {
        type: "link",
        component: LinkComponent,
        props: {
            href: "/tutor/assignments",
            children: [React.createElement(Table2, { key: "icon", className: "h-4 w-4" }), "Assignment"],
        },
    },
    {
        type: "link",
        component: LinkComponent,
        props: {
            href: "/tutor/payments",
            children: [React.createElement(Wallet, { key: "icon", className: "h-4 w-4" }), "Payments"],
        },
    },
    {
        type: "link",
        component: LinkComponent,
        props: {
            href: "/tutor/notification",
            children: [React.createElement(Bell, { key: "icon", className: "h-4 w-4" }), "Notification"],
        },
    },

];
export const profileData = [
    {
        img: "/SVGs/overview.svg",
        activeImage: "/SVGs/overviewOrange.svg",
        text: "Overview Section"
    },
    {
        img: "/SVGs/activity.svg",
        activeImage: "/SVGs/activityOrange.svg",
        text: "Activity Log"
    }
    , {
        img: "/SVGs/assignmentIcon.svg",
        activeImage: "/SVGs/assignmentOrange.svg",
        text: "Assignment & Grades"
    }, {
        img: "/SVGs/comment.svg",
        activeImage: "/SVGs/commentOrange.svg",
        text: "Comments & Notes"
    }

]

export const AssignmentData = [
    {
        img: "/SVGs/overview.svg",
        activeImage: "/SVGs/overviewOrange.svg",
        text: "Assigment Details"
    },
    {
        img: "/SVGs/questionIcon.svg",
        activeImage: "/SVGs/questionOrange.svg",
        text: "Questions"
    },


]

export const OverviewData = [
    {
        img: "/SVGs/overview.svg",
        activeImage: "/SVGs/overviewOrange.svg",
        text: "Overview"
    },
    {
        img: "/SVGs/questionIcon.svg",
        activeImage: "/SVGs/questionOrange.svg",
        text: "Submissions"
    },
    {
        img: "/SVGs/feedback.svg",
        activeImage: "/SVGs/feedbackOrange.svg",
        text: "Feedback"
    },

]

export const AssignmentStatData = [
    {
        title: "Total Assignment",
        img: "/SVGs/assignment.svg",
        amount: 25,
    },
    {
        title: "Pending",
        img: "/SVGs/completed.svg",
        amount: 3,
    },
    {
        title: "Completed",
        img: "/SVGs/completed.svg",
        amount: 12,
    },
    {
        title: "Overdue",
        img: "/SVGs/overdue.svg",
        amount: 0,
    },
];

export const notificationStatData = [
    {
        title: "Total Notifications",
        img: "/SVGs/harmburger.svg",
        amount: 25,
    },
    {
        title: "Read Rate",
        img: "/SVGs/completed.svg",
        amount: 78,
    },
    {
        title: "Active Recipients",
        img: "/SVGs/recipient.svg",
        amount: 10,
    },
]
