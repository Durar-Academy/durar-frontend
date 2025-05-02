import React from "react";
import { List, Users, GraduationCap } from "lucide-react";
import { TutorStatCardProps, TutorsMetrics } from "@/data2/types";

export const processTutorDashboardMetrics = (tutorMetrics?: TutorsMetrics): TutorStatCardProps[] => {
    return [
        {
            title: "Total Courses",
            value: String(tutorMetrics?.coursesCount ?? 0),
            icon: React.createElement(List, { className: "w-6 h-6 text-orange" }),
        },
        {
            title: "Total Students",
            value: String(tutorMetrics?.totalStudents ?? 0),
            icon: React.createElement(Users, { className: "w-6 h-6 text-success" }),
        },
        {
            title: "Classes Completed",
            value: String(tutorMetrics?.totalCompletedClasses ?? 0),
            icon: React.createElement(GraduationCap, { className: "w-6 h-6 text-orange" }),
        },
    ];
};