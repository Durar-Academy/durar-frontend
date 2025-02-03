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
