import { useQuery, useMutation } from "@tanstack/react-query";
import { tutorApi } from "@/api/tutorApi";

export const useTutorMetrics = () => {
  return useQuery({
    queryKey: ["tutor-metrics"],
    queryFn: tutorApi.getTutorMetrics,
  });
};

export const useTutorDashboard = () => {
  return useQuery({
    queryKey: ["tutor-dashboard"],
    queryFn: tutorApi.getTutorDashboard,
  });
};

export const useTutorStudents = ({ page = 1 }: { page?: number }) => {
  return useQuery({
    queryKey: ["tutor-students", page],
    queryFn: () => tutorApi.getTutorStudents({ page }),
    placeholderData: (prev) => prev, // Maintain data while fetching new page
  });
};

export const useTutorClasses = ({ page = 1 }: { page?: number }) => {
  return useQuery({
    queryKey: ["tutor-classes", page],
    queryFn: () => tutorApi.getTutorClasses({ page }),
    placeholderData: (prev) => prev,
  });
};

export const useTutorAssignments = ({ page = 1 }: { page?: number }) => {
  return useQuery({
    queryKey: ["tutor-assignments", page],
    queryFn: () => tutorApi.getTutorAssignments({ page }),
    placeholderData: (prev) => prev,
  });
};

export const useUserProfile = (id: string) => {
  return useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => tutorApi.getUserProfile(id),
    enabled: !!id,
  });
};

export const useTutorActivity = () => {
  return useQuery({
    queryKey: ["tutor-activity"],
    queryFn: () => tutorApi.getTutorActivity({ limit: 5 }),
  });
};


export const useStudentActivity = ({
  userId,
  page = 1,
}: {
  userId: string;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["student-activity", userId, page],
    queryFn: () => tutorApi.getStudentActivity({ userId, page }),
    enabled: !!userId,
    placeholderData: (prev) => prev,
  });
};

export const useTutorPayments = ({ page = 1 }: { page?: number }) => {
  return useQuery({
    queryKey: ["tutor-payments", page],
    queryFn: () => tutorApi.getTutorPayments({ page }),
    placeholderData: (prev) => prev,
  });
};

export const useStudentNotes = ({ studentId, page = 1 }: { studentId: string; page?: number }) => {
  return useQuery({
    queryKey: ["student-notes", studentId, page],
    queryFn: ({ signal }) => tutorApi.getStudentNotes({ studentId, page, signal }),
    enabled: !!studentId,
    placeholderData: (prev) => prev,
  });
};

export const useAddStudentNote = () => {
  return useMutation({
    mutationFn: tutorApi.addStudentNote,
  });
};

export const useTutorNotifications = ({ page = 1 }: { page?: number }) => {
  return useQuery({
    queryKey: ["tutor-notifications", page],
    queryFn: () => tutorApi.getTutorNotifications({ page }),
    placeholderData: (prev) => prev,
  });
};

export const useTutorTimetable = ({ page = 1 }: { page?: number }) => {
  return useQuery({
    queryKey: ["tutor-timetable", page],
    queryFn: () => tutorApi.getTutorTimetable({ page }),
    placeholderData: (prev) => prev,
  });
};
