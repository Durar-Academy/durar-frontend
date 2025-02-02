import { useQuery } from "@tanstack/react-query";

import { getMetrics } from "@/lib/dashboard";

export function useMetrics() {
  const query = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: getMetrics,
  });

  return query;
}
