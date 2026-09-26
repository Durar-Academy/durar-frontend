import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createResult, deleteResult, getCourseResults, updateResult } from "@/lib/result";

export function useCourseResults(courseId: string, session: string) {
  return useQuery({
    queryKey: ["course-results", courseId, session],
    queryFn: ({ signal }) => getCourseResults(courseId, session, { signal }),
    enabled: Boolean(courseId && session),
  });
}

export function useCreateResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createResult,
    onSuccess: (_result, variables) => queryClient.invalidateQueries({ queryKey: ["course-results", variables.courseId, variables.session] }),
  });
}

export function useUpdateResult() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: { ca?: number; exam?: number } }) => updateResult(id, payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["course-results"] }) });
}

export function useDeleteResult() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteResult, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["course-results"] }) });
}
