import { useQuery } from "@tanstack/react-query";

import { getActivities, getMetrics, getPayments, getSchedules, getStudents, getStudentsOverview } from "@/lib/admin";

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

export function useStudentsOverview() {
  const query = useQuery({
    queryKey: ["all-students-overview"],
    queryFn: getStudentsOverview,
  });

  return query;
}

export function useStudents(filters?: StudentFilters) {
  const query = useQuery({
    queryKey: ["all-students", filters],
    queryFn: ({ signal }) => getStudents({ signal, filters }),
  });

  return query;
}
