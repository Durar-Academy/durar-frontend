import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { changeResultStatus, createResult, getCourseResults, getTutorResultRoster } from "@/lib/result";

export function useTutorResultRoster() {
  return useQuery({ queryKey: ["tutor-result-roster"], queryFn: getTutorResultRoster });
}

export function useTutorCourseResults(courseId: string, session: string) {
  return useQuery({
    queryKey: ["tutor-course-results", courseId, session],
    queryFn: ({ signal }) => getCourseResults(courseId, session, { signal }),
    enabled: Boolean(courseId && session),
  });
}

export function useTutorCreateResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createResult,
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tutor-course-results", variables.courseId, variables.session] });
    },
  });
}

export function useTutorSubmitResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => changeResultStatus(id, "submit"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tutor-course-results"] }),
  });
}
