import axios from "axios";

export async function createAccount(payload: CreateAccountPayload) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, payload);
  return response;
}

export async function initiatePasswordReset(payload: { email: string }) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/password-reset/initiate`, payload);
  return response;
}

export async function setNewPassword(payload: { password: string; token: string }) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/set-password`, payload);
  return response;
}

export async function requestAccountVerification(payload: { email: string }) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/send-confirmation-email`, payload);
  return response;
}

export async function refreshAccessToken(payload: { refreshToken: string }) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`, payload);
  return response;
}

export async function confirmPasswordReset(payload: { token: string }) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/password-reset/validate-token`,
    payload
  );
  return response;
}

export async function verifyAccount(payload: { token: string }) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-account`, payload);
  return response;
}

export async function loginUser(payload: { email: string; password: string }) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, payload);
  return response;
}

// uses bearer token (access token)
export async function getCurrentUser() {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`);
  return response;
}

export async function changePassword(payload: { password: string }) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`, payload);
  return response;
}
