import { axiosInstance } from "./axios";

export async function getMetrics(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/metrics/dashboard", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getSchedules(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/class", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getActivities(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/activity", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getPayments(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/payment", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getStudentsOverview(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/metrics/student", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getStudents(options?: { signal?: AbortSignal; filters?: StudentFilters }) {
  const params = new URLSearchParams();
  if (options?.filters?.search) params.append("search", options.filters.search);
  if (options?.filters?.status) params.append("status", options.filters.status);

  const response = await axiosInstance.get(`/user/students?${params.toString()}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getUser(userId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/user/${userId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}
