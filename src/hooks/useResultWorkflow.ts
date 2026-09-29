import { useMutation, useQueryClient } from "@tanstack/react-query";

import { changeResultStatus } from "@/lib/result";

export function useResultWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: "submit" | "publish" | "unpublish" | "lock" }) => changeResultStatus(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-results"] });
      queryClient.invalidateQueries({ queryKey: ["my-results"] });
    },
  });
}
