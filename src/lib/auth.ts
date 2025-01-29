import axios from "axios";
import { deleteAuthData } from "./storage";

export async function createAccount(payload: CreateAccountPayload) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, payload);
  return response.data;
}

export async function requestAccountVerification(payload: { email: string }) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/send-confirmation-email`, payload);
  return response.data;
}

export async function verifyAccount(payload: { token: string; signal?: AbortSignal }) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-account`, payload, {
    signal: payload.signal,
  });
  return response.data;
}

export async function initiatePasswordReset(payload: { email: string }) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/password-reset/initiate`, payload);
  return response.data;
}

export async function confirmPasswordReset(payload: { token: string; signal?: AbortSignal }) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/password-reset/validate-token`,
    payload,
    { signal: payload.signal }
  );
  return response.data;
}

export async function setNewPassword(payload: { password: string; token: string }) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/set-password`, payload);
  return response.data;
}

export async function refreshAccessToken(payload: { refreshToken: string }) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`, payload);
  return response.data;
}

export async function loginUser(payload: { email: string; password: string }) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, payload);
  return response.data;
}

export async function logOutUser() {
  deleteAuthData();
}
