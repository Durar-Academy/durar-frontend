import { useQuery } from "@tanstack/react-query";

import { getActivities, getMetrics, getPayments, getSchedules } from "@/lib/dashboard";

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

export function usePayments() {
  const query = useQuery({
    queryKey: ["all-payments"],
    queryFn: getPayments,
  });

  return query;
}
