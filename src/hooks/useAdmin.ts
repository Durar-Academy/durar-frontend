import { useQuery } from "@tanstack/react-query";

import {
  getActivities,
  getCourse,
  getCourses,
  getCoursesMetrics,
  getMetrics,
  getPayments,
  getSchedules,
  getStudentAssignments,
  getStudentCourses,
  getStudentMetrics,
  getStudents,
  getStudentsMetrics,
  getTutorCourses,
  getTutorMetrics,
  getTutors,
  getTutorsMetrics,
  getUser,
  getUserActivities,
  getUserPayments,
} from "@/lib/admin";

export function useMetrics() {
  const query = useQuery({ queryKey: ["dashboard-metrics"], queryFn: getMetrics });
  return query;
}

export function useSchedules() {
  const query = useQuery({ queryKey: ["all-schedules"], queryFn: getSchedules });
  return query;
}

export function useActivities() {
  const query = useQuery({ queryKey: ["all-activities"], queryFn: getActivities });
  return query;
}

export function usePayments() {
  const query = useQuery({ queryKey: ["all-payments"], queryFn: getPayments });
  return query;
}

export function useStudentsMetrics() {
  const query = useQuery({ queryKey: ["all-students-metrics"], queryFn: getStudentsMetrics });
  return query;
}

export function useStudents(filters?: SearchFilters) {
  const query = useQuery({
    queryKey: ["all-students", filters],
    queryFn: () => getStudents({ filters }),
  });
  return query;
}

export function useStudent(studentId: string) {
  const query = useQuery({ queryKey: ["student", studentId], queryFn: () => getUser(studentId) });
  return query;
}

export function useStudentMetrics(studentId: string) {
  const query = useQuery({
    queryKey: ["student-metrics", studentId],
    queryFn: () => getStudentMetrics(studentId),
  });
  return query;
}

export function useStudentCourses(studentId: string) {
  const query = useQuery({
    queryKey: ["student-courses", studentId],
    queryFn: () => getStudentCourses(studentId),
  });
  return query;
}

export function useStudentActivities(studentId: string) {
  const query = useQuery({
    queryKey: ["student-activities", studentId],
    queryFn: () => getUserActivities(studentId),
  });
  return query;
}

export function useStudentPaymentOverview(studentId: string) {
  const query = useQuery({
    queryKey: ["student-payment-overview", studentId],
    queryFn: () => getStudentMetrics(studentId),
  });
  return query;
}

export function useStudentPayments(studentId: string) {
  const query = useQuery({
    queryKey: ["student-payments", studentId],
    queryFn: () => getUserPayments(studentId),
  });
  return query;
}

export function useStudentAssignments(studentId: string) {
  const query = useQuery({
    queryKey: ["student-assignment", studentId],
    queryFn: () => getStudentAssignments(studentId),
  });
  return query;
}

export function useTutorsMetrics() {
  const query = useQuery({ queryKey: ["all-tutors-metrics"], queryFn: getTutorsMetrics });
  return query;
}

export function useTutors(filters?: SearchFilters) {
  const query = useQuery({
    queryKey: ["all-tutors", filters],
    queryFn: () => getTutors({ filters }),
  });
  return query;
}

export function useTutor(tutorId: string) {
  const query = useQuery({ queryKey: ["tutor", tutorId], queryFn: () => getUser(tutorId) });
  return query;
}

export function useTutorMetrics(tutorId: string) {
  const query = useQuery({
    queryKey: ["tutor-metrics", tutorId],
    queryFn: () => getTutorMetrics(tutorId),
  });
  return query;
}

export function useTutorCourses(tutorId: string) {
  const query = useQuery({
    queryKey: ["tutor-courses", tutorId],
    queryFn: () => getTutorCourses(tutorId),
  });
  return query;
}

export function useTutorPaymentOverview(tutorId: string) {
  const query = useQuery({
    queryKey: ["tutor-payment-overview", tutorId],
    queryFn: () => getTutorMetrics(tutorId),
  });
  return query;
}

export function useTutorPayments(tutorId: string) {
  const query = useQuery({
    queryKey: ["tutor-payments", tutorId],
    queryFn: () => getUserPayments(tutorId),
  });
  return query;
}

export function useTutorActivities(tutorId: string) {
  const query = useQuery({
    queryKey: ["tutor-activities", tutorId],
    queryFn: () => getUserActivities(tutorId),
  });
  return query;
}

export function useCoursesMetrics() {
  const query = useQuery({ queryKey: ["all-courses-metrics"], queryFn: getCoursesMetrics });
  return query;
}

export function useCourses() {
  const query = useQuery<Course[]>({ queryKey: ["all-courses"], queryFn: getCourses });
  return query;
}

export function useCourse(courseId: string) {
  const query = useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
  });
  return query;
}
