import { useQuery } from "@tanstack/react-query";

import { getAssignments } from "@/lib/student";

export function useAssignments() {
  const query = useQuery({ queryKey: ["all-student-assignments"], queryFn: getAssignments });
  return query;
}
