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
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/password-reset/complete`, payload);
  return response;
}

export async function requestAccountVerification(payload: { email: string }) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/send-confirmation-email`, payload);
  return response;
}
