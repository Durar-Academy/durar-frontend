import { useQuery } from "@tanstack/react-query";
import { tutorApi } from "@/api/tutorApi";

export const useTutorMetrics = () => {
  return useQuery({
    queryKey: ["tutor-metrics"],
    queryFn: tutorApi.getTutorMetrics,
  });
};