import { useQuery } from "@tanstack/react-query";

import { getActivities, getMetrics, getSchedules } from "@/lib/dashboard";

export function useMetrics() {
  const query = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: getMetrics,
  });

  return query;
}

export function useSchedules() {
  const query = useQuery({
    queryKey: ["all-schedules"],
    queryFn: getSchedules,
  });

  return query;
}

export function useActivities() {
  const query = useQuery({
    queryKey: ["all-activities"],
    queryFn: getActivities,
  });

  return query;
}
