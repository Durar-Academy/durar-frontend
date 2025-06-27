import React from "react";
import { List, Users, GraduationCap, CheckCircle, Clock, Info } from "lucide-react";
import { format } from "date-fns";

export const processTutorDashboardMetrics = (tutorMetrics2?: TutorsMetrics2): TutorStatCardProps[] => {
    return [
        {
            title: "Total Courses",
            value: String(tutorMetrics2?.totalCourses ?? 0),
            icon: React.createElement(List, { className: "w-6 h-6 text-orange" }),
        },
        {
            title: "Total Students",
            value: String(tutorMetrics2?.totalStudents ?? 0),
            icon: React.createElement(Users, { className: "w-6 h-6 text-success" }),
        },
        {
            title: "Total Assignments",
            value: String(tutorMetrics2?.totalAssignments ?? 0),
            icon: React.createElement(GraduationCap, { className: "w-6 h-6 text-orange" }),
        },
    ];
};

export const processUpcomingClasses = (dashboardData?: TutorsDashboard): ClassItem[] => {
    if (!dashboardData?.upcomingClasses) return [];

    return dashboardData.upcomingClasses.map((schedule) => ({
        day: schedule.day.charAt(0).toUpperCase() + schedule.day.slice(1), // Capitalize, e.g., "Monday"
        student: schedule.studentName,
        category: schedule.category || "Uncategorized",
        time: schedule.time,
    }));
};

export const processTutorStudents = (studentsData?: TutorStudentsResponse): Students[] => {
    if (!studentsData?.records) return [];

    return studentsData.records.map((record) => ({
        id: record.studentId,
        name: record.studentName,
        category: record.category || "Uncategorized",
        email: record.email,
        status: record.status.charAt(0).toUpperCase() + record.status.slice(1) as "Active" | "Inactive",
    }));
};

export const processTutorClasses = (classesData?: TutorClassesResponse): ClassItem[] => {
    if (!classesData?.records) return [];

    return classesData.records.map((record) => ({
        day: record.day.charAt(0).toUpperCase() + record.day.slice(1),
        student: `${record.student.firstName} ${record.student.lastName}`,
        category: record.course.category || "Uncategorized",
        time: `${record.start} - ${record.end}`,
        status: record.status.charAt(0).toUpperCase() + record.status.slice(1),
    }));
};

export const processTutorAssignments = (assignmentsData?: TutorAssignmentsResponse): AssignmentItem[] => {
    if (!assignmentsData?.records) return [];

    return assignmentsData.records.map((record) => ({
        id: record.id,
        title: record.title,
        course: record.course.title.trim(),
        status: record.state === "past" ? "Completed" : "Pending",
        dueDate: format(new Date(record.dueAt), "MMM d, yyyy"),
        submissions: record.totalSubmissions,
    }));
};

export const processUserProfile = (userData?: UserProfileResponse): UserProfile | null => {
    if (!userData) return null;

    const fullNameParts = [
        userData.title,
        userData.firstName,
        userData.middleName,
        userData.lastName,
    ].filter(Boolean);
    const fullName = fullNameParts.join(" ");

    return {
        fullName: fullName || "Unknown",
        email: userData.email,
        phone: userData.phone || "N/A",
        enrollmentDate: format(new Date(userData.createdAt), "MMM d, yyyy"),
        status: userData.status.charAt(0).toUpperCase() + userData.status.slice(1),
        role: userData.role.charAt(0).toUpperCase() + userData.role.slice(1),
        profilePictureId: userData.profilePictureId,
    };
};

export const processTutorActivity = (activityData?: TutorActivityResponse): NotificationItem[] => {
    if (!activityData?.records) return [];

    return activityData.records
        .map((record) => ({
            id: record.id,
            context: record.context,
            createdAt: record.createdAt,
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
};

export const processStudentActivity = (activityData?: StudentActivityResponse): ActivityItem[] => {
  if (!activityData?.records) return [];

  return activityData.records
    .map((record) => ({
      id: record.id,
      context: record.context,
      createdAt: format(new Date(record.createdAt), "MMM d, yyyy"),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Returns metrics: total, completed, pending, overdue assignments as OverviewCardProps[]
export function processTutorAssignmentMetrics(assignments: AssignmentItem[]): OverviewCardProps[] {
    const total = assignments.length;
    const completed = assignments.filter(a => a.status === "Completed").length;
    const pending = assignments.filter(a => a.status === "Pending").length;
    // Overdue: pending assignments with dueDate in the past
    const now = new Date();
    const overdue = assignments.filter(a => {
        if (a.status !== "Pending") return false;
        const due = new Date(a.dueDate);
        return due < now;
    }).length;
    return [
        {
            title: "Total Assignments",
            figure: String(total),
            children: React.createElement(List, { key: "icon", className: "w-6 h-6 text-orange" })
        },
        {
            title: "Completed",
            figure: String(completed),
            children: React.createElement(CheckCircle, { key: "icon", className: "w-6 h-6 text-success" })
        },
        {
            title: "Pending",
            figure: String(pending),
            children: React.createElement(Clock, { key: "icon", className: "w-6 h-6 text-orange" })
        },
        {
            title: "Overdue",
            figure: String(overdue),
            children: React.createElement(Info, { key: "icon", className: "w-6 h-6 text-danger" })
        },
    ];
}