import { axiosInstance } from "./axios";

export async function initializeLesson(lessonId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.post(`/lesson/${lessonId}/progress`, {
    signal: options?.signal,
  });
  return response.data;
}

export async function updateLessonProgress(
  lessonId: string,
  { progress }: { progress: number },
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.put(
    `/lesson/${lessonId}/progress`,
    { progress },
    { signal: options?.signal },
  );
  return response.data;
}

export async function getAssignments(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/assignment/student", {
    signal: options?.signal,
  });
  return response.data.data.records;
}

export async function getPayments(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/payment", {
    signal: options?.signal,
  });
  return response.data.data.records;
}

export async function getPaymentMethods(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/payment-method", {
    signal: options?.signal,
  });
  return response.data;
}

export async function addCard(payload: {
  type: string;
  provider: string;
  name: string;
  billingAddress: {
    addressLine1: string;
    adminArea1: string;
    postalCode: string;
    countryCode: string;
    city: string;
  };
  cardNumber: string;
  expiry: string;
}) {
  const response = await axiosInstance.post(`/payment/initialize`, payload);
  return response.data;
}
