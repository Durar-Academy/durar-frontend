import { axiosInstance } from "./axios";

export async function getMetrics(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/metrics/dashboard", {
    signal: options?.signal,
  });
  return response.data.data;
}
