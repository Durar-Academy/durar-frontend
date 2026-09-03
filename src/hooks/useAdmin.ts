import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { registerStudent } from "@/lib/auth";

import {
  createAssignment,
  createNotification,
  createSchedules,
  deleteAssignment,
  deleteCourse,
  deleteNotification,
  deleteSchedule,
  downloadTransactions,
  getActivities,
  getAllNotifications,
  getAssignment,
  getAssignmentMetrics,
  getAssignments,
  getAssignmentsMetrics,
  getCourse,
  getCourses,
  getCoursesMetrics,
  getMetrics,
  getNotification,
  getNotifications,
  getPayment,
  getPayments,
  getPaymentsMetrics,
  getSchedules,
  getTimetable,
  getStudentAssignmentFeedbacks,
  getStudentAssignments,
  getStudentCourses,
  getStudentMetrics,
  getStudents,
  getStudentsMetrics,
  enrollStudent,
  getTutorCourses,
  getTutorMetrics,
  getTutors,
  getTutorsMetrics,
  getUser,
  getUserActivities,
  getUserPayments,
  updateAssignment,
  updateCourse,
  updateNotification,
  updateSchedules,
  createNote,
  getStudentNotes,
} from "@/lib/admin";

// ─── Dashboard Queries ────────────────────────────────────────────────────────

export function useMetrics() {
  return useQuery({ queryKey: ["dashboard-metrics"], queryFn: getMetrics });
}

export function useSchedules() {
  return useQuery<any, Error, Schedule[]>({
    queryKey: ["all-schedules"],
    queryFn: getSchedules,
    select: (data) => {
      if (Array.isArray(data)) return data;
      if (data?.records && Array.isArray(data.records)) return data.records;
      if (typeof data === "object") {
        return Object.values(data).flatMap((dayArray: unknown) =>
          Array.isArray(dayArray) ? dayArray : [],
        );
      }
      return [];
    },
  });
}

export function useTimetable() {
  return useQuery({ queryKey: ["timetable"], queryFn: getTimetable });
}

export function useActivities() {
  return useQuery({ queryKey: ["all-activities"], queryFn: getActivities });
}

export function usePayments(filters?: PaymentFilters) {
  return useQuery({
    queryKey: ["all-payments", filters],
    queryFn: () => getPayments({ filters }),
  });
}

// ─── Student Queries ──────────────────────────────────────────────────────────

export function useStudentsMetrics() {
  return useQuery({ queryKey: ["all-students-metrics"], queryFn: getStudentsMetrics });
}

export function useStudents(filters?: SearchFilters) {
  return useQuery({
    queryKey: ["all-students", filters],
    queryFn: () => getStudents({ filters }),
  });
}

export function useStudent(studentId: string) {
  return useQuery({
    queryKey: ["student", studentId],
    queryFn: () => getUser(studentId),
    enabled: !!studentId,
  });
}

export function useStudentMetrics(studentId: string) {
  return useQuery({
    queryKey: ["student-metrics", studentId],
    queryFn: () => getStudentMetrics(studentId),
    enabled: !!studentId,
  });
}

export function useStudentCourses(studentId: string) {
  return useQuery({
    queryKey: ["student-courses", studentId],
    queryFn: () => getStudentCourses(studentId),
    enabled: !!studentId,
  });
}

export function useStudentActivities(studentId: string) {
  return useQuery({
    queryKey: ["student-activities", studentId],
    queryFn: () => getUserActivities(studentId),
    enabled: !!studentId,
  });
}

export function useStudentPaymentOverview(studentId: string) {
  return useQuery({
    queryKey: ["student-payment-overview", studentId],
    queryFn: () => getStudentMetrics(studentId),
    enabled: !!studentId,
  });
}

export function useStudentPayments(studentId: string) {
  return useQuery({
    queryKey: ["student-payments", studentId],
    queryFn: () => getUserPayments(studentId),
    enabled: !!studentId,
  });
}

export function useStudentAssignments(studentId: string) {
  return useQuery({
    queryKey: ["student-assignment", studentId],
    queryFn: () => getStudentAssignments(studentId),
    enabled: !!studentId,
  });
}

// ─── Tutor Queries ────────────────────────────────────────────────────────────

export function useTutorsMetrics() {
  return useQuery({ queryKey: ["all-tutors-metrics"], queryFn: getTutorsMetrics });
}

export function useTutors(filters?: SearchFilters) {
  return useQuery({
    queryKey: ["all-tutors", filters],
    queryFn: () => getTutors({ filters }),
  });
}

export function useTutor(tutorId: string) {
  return useQuery({
    queryKey: ["tutor", tutorId],
    queryFn: () => getUser(tutorId),
    enabled: !!tutorId,
  });
}

export function useTutorMetrics(tutorId: string) {
  return useQuery({
    queryKey: ["tutor-metrics", tutorId],
    queryFn: () => getTutorMetrics(tutorId),
    enabled: !!tutorId,
  });
}

export function useTutorCourses(tutorId: string) {
  return useQuery({
    queryKey: ["tutor-courses", tutorId],
    queryFn: () => getTutorCourses(tutorId),
    enabled: !!tutorId,
  });
}

export function useTutorPaymentOverview(tutorId: string) {
  return useQuery({
    queryKey: ["tutor-payment-overview", tutorId],
    queryFn: () => getTutorMetrics(tutorId),
    enabled: !!tutorId,
  });
}

export function useTutorPayments(tutorId: string) {
  return useQuery({
    queryKey: ["tutor-payments", tutorId],
    queryFn: () => getUserPayments(tutorId),
    enabled: !!tutorId,
  });
}

export function useTutorActivities(tutorId: string) {
  return useQuery({
    queryKey: ["tutor-activities", tutorId],
    queryFn: () => getUserActivities(tutorId),
    enabled: !!tutorId,
  });
}

// ─── Course Queries ───────────────────────────────────────────────────────────

export function useCoursesMetrics() {
  return useQuery({ queryKey: ["all-courses-metrics"], queryFn: getCoursesMetrics });
}

export function useCourses(filters?: SearchFilters) {
  return useQuery<Course[]>({
    queryKey: ["all-courses", filters],
    queryFn: () => getCourses({ filters }),
  });
}

export function useCourse(courseId: string) {
  return useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId,
  });
}

// ─── Payment Queries ──────────────────────────────────────────────────────────

export function usePaymentsMetrics() {
  return useQuery({ queryKey: ["all-payments-metrics"], queryFn: getPaymentsMetrics });
}

export function useDownloadTransactions() {
  return useQuery({
    queryKey: ["download-transactions"],
    queryFn: downloadTransactions,
    enabled: false,
  });
}

export function usePayment(paymentId: string) {
  return useQuery<Payment>({
    queryKey: ["payment", paymentId],
    queryFn: () => getPayment(paymentId),
    enabled: !!paymentId,
  });
}

// ─── Assignment Queries ───────────────────────────────────────────────────────

export function useAssignmentsMetrics() {
  return useQuery({ queryKey: ["all-assignment-metrics"], queryFn: getAssignmentsMetrics });
}

export function useAssignments(filters?: AssignmentFilters) {
  return useQuery({
    queryKey: ["all-assignments", filters],
    queryFn: () => getAssignments({ filters }),
  });
}

export function useAssignmentMetrics(assignmentId: string) {
  return useQuery({
    queryKey: ["single-assignment-metrics", assignmentId],
    queryFn: () => getAssignmentMetrics(assignmentId),
    enabled: !!assignmentId,
  });
}

export function useAssignment(assignmentId: string) {
  return useQuery<Assignment>({
    queryKey: ["single-assignment", assignmentId],
    queryFn: () => getAssignment(assignmentId),
    enabled: !!assignmentId,
  });
}

export function useStudentAssignmentFeedbacks(assignmentId: string) {
  return useQuery<StudentFeedback[]>({
    queryKey: ["single-assignment-students-feedbacks", assignmentId],
    queryFn: () => getStudentAssignmentFeedbacks(assignmentId),
    enabled: !!assignmentId,
  });
}

// ─── Notification Queries ─────────────────────────────────────────────────────

export function useNotifications() {
  return useQuery({ queryKey: ["all-student-notifications"], queryFn: getNotifications });
}

export function useAllNotifications(options?: { page?: number; limit?: number }) {
  return useQuery<_Notification[]>({
    queryKey: ["all-notifications", options?.page, options?.limit],
    queryFn: () => getAllNotifications({ page: options?.page, limit: options?.limit }),
  });
}

export function useNotification(notificationId: string) {
  return useQuery({
    queryKey: ["notification", notificationId],
    queryFn: () => getNotification(notificationId),
    enabled: !!notificationId,
  });
}

// ─── Notes Queries ────────────────────────────────────────────────────────────

export function useStudentNotes(studentId: string) {
  return useQuery({
    queryKey: ["student-notes", studentId],
    queryFn: () => getStudentNotes(studentId),
    enabled: !!studentId,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title?: string; content: string; studentId: string }) =>
      createNote(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["student-notes", variables.studentId] });
    },
  });
}

// ─── Student Mutations ────────────────────────────────────────────────────────

export function useRegisterStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterStudentPayload) => registerStudent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-students"] });
      queryClient.invalidateQueries({ queryKey: ["all-students-metrics"] });
    },
  });
}

// ─── Course Mutations ─────────────────────────────────────────────────────────

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, payload }: { courseId: string; payload: UpdateCoursePayload }) =>
      updateCourse(courseId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["all-courses"] });
      queryClient.invalidateQueries({ queryKey: ["all-courses-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-courses"] });
      queryClient.invalidateQueries({ queryKey: ["all-courses-metrics"] });
    },
  });
}

export function useEnrollStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) =>
      enrollStudent(courseId, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ["all-courses"] });
      queryClient.invalidateQueries({ queryKey: ["all-courses-metrics"] });
    },
  });
}

// ─── Schedule Mutations ───────────────────────────────────────────────────────

export function useCreateSchedules() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { classes: CreateSchedule | CreateSchedule[]; courseId: string }) =>
      createSchedules(args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
    },
  });
}

export function useUpdateSchedules() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { classes: CreateSchedule | CreateSchedule[] }) => updateSchedules(args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scheduleId: string) => deleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
    },
  });
}

// ─── Assignment Mutations ─────────────────────────────────────────────────────

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAssignmentPayload) => createAssignment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["all-assignment-metrics"] });
    },
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      assignmentId,
      payload,
    }: {
      assignmentId: string;
      payload: UpdateAssignmentPayload;
    }) => updateAssignment(assignmentId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["all-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["all-assignment-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["single-assignment", variables.assignmentId] });
      queryClient.invalidateQueries({
        queryKey: ["single-assignment-metrics", variables.assignmentId],
      });
    },
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assignmentId: string) => deleteAssignment(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["all-assignment-metrics"] });
    },
  });
}

// ─── Notification Mutations ───────────────────────────────────────────────────

export function useCreateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateNotificationPayload) => createNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["all-student-notifications"] });
    },
  });
}

export function useUpdateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      notificationId,
      payload,
    }: {
      notificationId: string;
      payload: UpdateNotificationPayload;
    }) => updateNotification(notificationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["all-student-notifications"] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["all-student-notifications"] });
    },
  });
}
