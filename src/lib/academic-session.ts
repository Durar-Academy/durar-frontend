import { axiosInstance } from "./axios";

export type AcademicSession = { id: string; name: string; active: boolean };

export async function getAcademicSessions() {
  const response = await axiosInstance.get("/academic-session");
  const payload = response.data?.data ?? response.data;
  return (Array.isArray(payload) ? payload : []) as AcademicSession[];
}

export async function createAcademicSession(payload: { name: string }) {
  const response = await axiosInstance.post("/academic-session", payload);
  return response.data?.data ?? response.data;
}

export async function archiveAcademicSession(id: string) {
  await axiosInstance.delete(`/academic-session/${id}`);
}
