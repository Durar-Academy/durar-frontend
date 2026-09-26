import { useQuery } from "@tanstack/react-query";

import { getMyResults, StudentResult } from "@/lib/result";

export function useMyResults(session?: string) {
  return useQuery<StudentResult[]>({
    queryKey: ["my-results", session ?? "all"],
    queryFn: ({ signal }) => getMyResults({ signal, session }),
  });
}
