import { useQuery } from "@tanstack/react-query";

import {
  getActivities,
  getMetrics,
  getPayments,
  getSchedules,
  getStudentActivities,
  getStudentAssignments,
  getStudentCourses,
  getStudentMetrics,
  getStudentPaymentOverview,
  getStudentPayments,
  getStudents,
  getStudentsMetrics,
  getTutorCourses,
  getTutorMetrics,
  getTutors,
  getTutorsMetrics,
  getUser,
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
    queryFn: () => getStudentActivities(studentId),
  });
  return query;
}

export function useStudentPaymentOverview(studentId: string) {
  const query = useQuery({
    queryKey: ["student-payment-overview", studentId],
    queryFn: () => getStudentPaymentOverview(studentId),
  });
  return query;
}

export function useStudentPayments(studentId: string) {
  const query = useQuery({
    queryKey: ["student-payments", studentId],
    queryFn: () => getStudentPayments(studentId),
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
