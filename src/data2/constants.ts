import {
    Bell,
    BookText,
    Columns2,
    Grid2X2,
    User,
    Table2,
    Wallet,
    PanelsTopLeft,
    Layers2,
    Settings,
    LogOut,
} from "lucide-react";
import React from "react";

import { ButtonComponent } from "@/components/admin/button-component";
import { LinkComponent } from "@/components/admin/link-component";
import { deleteAuthData } from "@/lib/storage";
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
    {
        type: "link",
        component: LinkComponent,
        props: {
            href: "/tutor/settings",
            children: [React.createElement(Settings, { key: "icon", className: "h-4 w-4" }), "Settings"],
        },
    },
    {
        type: "button",
        component: ButtonComponent,
        props: {
            href: "/auth",
            onClick: () => {
                deleteAuthData();
            },
            children: [React.createElement(LogOut, { key: "icon", className: "h-4 w-4" }), "Logout"],
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
];


export const onboardingSidebarData = [
    {
        txt: "Personal Information",
    },
    {
        txt: "Professional Details",
    },
    {
        txt: "Address and Location",
    },
    {
        txt: "Account Setup & Payments",
    },
];


export const TermsAndConditions = [
    {

        title: 'Introduction',
        descList: ['Welcome to Durar Academy. By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.']
    },
    {
        title: 'Definitions',
        descList: ['"Platform": Refers to the Durar Academy website and any related services.',
            '"User": Any individual who accesses or uses the platform.',
            '"Content": All materials, including courses, videos, text, images, and other educational resources available on the platform.']
    },
    {
        title: 'User Accounts',
        descList: ['Registration: Users must provide accurate and complete information during registration.',
            'Account Security: Users are responsible for maintaining the confidentiality of their account credentials and for all activities under their account.']
    },

    {
        title: 'Use of the Platform',
        descList: ['License: Durar Academy grants users a non - exclusive, non - transferable license to access and use the content for personal, non - commercial purposes.',
            'Prohibited Activities:',
            'Users agree not to: Reproduce, distribute, or publicly display any content without prior authorization.',
            'Use the platform for any unlawful purposes.',
            'Attempt to gain unauthorized access to the platform\'s systems.',
        ]
    },
    {
        title: 'Intellectual Property Rights',
        descList: [
            'Ownership: All content on the platform is the property of Durar Academy or its licensors and is protected by intellectual property laws.',
            'User - Generated Content: By submitting content to the platform, users grant Durar Academy a worldwide, royalty - free license to use, reproduce, and distribute such content.',]
    },
    {
        title: "Payments and Refunds",
        descList: [
            'Pricing: All course fees are displayed on the platform and are subject to change.',
            'Payments: Users must pay all fees associated with the courses they enroll in.',
            'Refunds: Refund policies are outlined on the platform.Users should review these policies before making a purchase.',]
    },
    {
        title: 'Termination',
        descList: [
            'Durar Academy reserves the right to suspend or terminate a user\'s access to the platform for violations of these terms or other policies.',]
    },
    {
        title: 'Disclaimers and Limitation of Liability',
        descList: [
            'No Warranty: The platform and its content are provided "as is" without any warranties, express or implied.',
            'Limitation: Durar Academy is not liable for any indirect, incidental, or consequential damages arising from the use of the platform.'
        ]
    },
    {
        title: 'Privacy Policy',
        descList: ['Users\' personal information is collected and used in accordance with our Privacy Policy, which is incorporated into these terms by reference.']
    },
    {
        title: 'Changes to Terms',
        descList: ['Durar Academy may modify these Terms and Conditions at any time.Users will be notified of significant changes, and continued use of the platform constitutes acceptance of the revised terms.']
    },
    {
        title: 'Governing Law',
        descList: ['These terms are governed by the laws of[Your Country / State], without regard to its conflict of law principles.']
    },
    {
        title: 'Contact Information',
        descList: ['For any questions or concerns regarding these Terms and Conditions, please contact us at (+2347078874420).']
    }
]

export interface OnboardingProps {
    handleNext: () => void;
    handlePrev: () => void;
}

export const DashboardStatData = [
    {
        title: "Students",
        active: 25,
        img: "/SVGs/students.svg",
        active2: "Active",
        total: 250,
        total2: "Total",
    },
    {
        title: "Student Enrolled",
        active: 4,
        img: "/SVGs/enrolled-students.svg",
        active2: "Active",
        total: 12,
        total2: "Courses",
    },
    {
        title: "Student Enrolled",
        active: 4,
        img: "/SVGs/assignment.svg",
        active2: "Pending",
        total: 12,
        total2: "Total Assignment",
    },
];


export interface FormData {
    email: string;
    password: string;
    paymentMode: 'banktransfer' | 'paypal' | 'crypto';
    bankAccountDetails: string;
    agreedToTerms: boolean;
    documents: string[];
}




export interface FormData {
    email: string;
    password: string;
    paymentMode: 'banktransfer' | 'paypal' | 'crypto';
    bankAccountDetails: string;
    agreedToTerms: boolean;
    documents: string[];
}

export const NEW_ASSIGNMENT_OPTIONS = [
    { label: "Assignment", url: "/tutor/assignments/add-assignment" },
    { label: "Quiz", url: "/tutor/assignments/add-quiz" },
];

export const quizLinks = [
    { label: "Quiz Details", icon: PanelsTopLeft, url: `/tutor/assignments/add-quiz` },

    {
        label: "Questions",
        icon: Layers2,
        url: `/tutor/assignments/add-quiz/questions`,
    },
];