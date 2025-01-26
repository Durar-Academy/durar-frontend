import axios from "axios";

export async function createAccount(payload: CreateAccountPayload) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, payload);
  return response;
}
