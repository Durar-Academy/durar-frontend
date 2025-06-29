import { useQuery } from "@tanstack/react-query";
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
    keepPreviousData: true, // Maintain data while fetching new page
  });
};

export const useTutorClasses = ({ page = 1 }: { page?: number }) => {
  return useQuery({
    queryKey: ["tutor-classes", page],
    queryFn: () => tutorApi.getTutorClasses({ page }),
    keepPreviousData: true,
  });
};

export const useTutorAssignments = ({ page = 1 }: { page?: number }) => {
  return useQuery({
    queryKey: ["tutor-assignments", page],
    queryFn: () => tutorApi.getTutorAssignments({ page }),
    keepPreviousData: true,
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
    keepPreviousData: true,
  });
};
