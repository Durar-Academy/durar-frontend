"use client";
import axios from "axios";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

import { STORE_KEY } from "@/data/constants";
import { axiosInstance } from "./axios";

const STORE_CREDENTIAL_KEY = `${STORE_KEY}-credentials`;
export const STORE_TOKEN_KEY = `${STORE_KEY}-token`;
export const STORE_EMAIL_KEY = `${STORE_KEY}-email`;
// const STORE_AUTH_KEY = `${STORE_KEY}-auth`;

export function storeCredentials({
  encryptedEmail,
  encryptedPassword,
  iv,
  key,
}: EncryptionPayload) {
  try {
    const dataToStore = {
      email: Array.from(encryptedEmail),
      password: Array.from(encryptedPassword),
      iv: Array.from(iv),
      key: Array.from(key),
    };

    localStorage.setItem(STORE_CREDENTIAL_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.error("Storing failed", error);
  }
}

export function retrieveCredentials(): EncryptionPayload | null {
  const storedData = localStorage.getItem(STORE_CREDENTIAL_KEY);

  if (!storedData) return null;

  const { email, password, iv, key } = JSON.parse(storedData);
  return {
    encryptedEmail: new Uint8Array(email),
    encryptedPassword: new Uint8Array(password),
    iv: new Uint8Array(iv),
    key: new Uint8Array(key),
  };
}

export function deleteCredentials() {
  localStorage.removeItem(STORE_CREDENTIAL_KEY);
}

export function storeItem(key: string, token: string) {
  localStorage.setItem(key, token);
}

export function retrieveItem(key: string) {
  const item = localStorage.getItem(key);
  if (!item) return "";
  return item;
}

export function deleteItem(key: string): void {
  localStorage.removeItem(key);
}

// export function storeAuthData(accessToken: string, refreshToken: string) {
//   localStorage.setItem(STORE_AUTH_KEY, JSON.stringify({ accessToken, refreshToken }));
// }

// export function retrieveAuthData() {
//   const storeAuthData = localStorage.getItem(STORE_AUTH_KEY);
//   if (!storeAuthData) return [];

//   const { accessToken, refreshToken } = JSON.parse(storeAuthData);
//   return [accessToken, refreshToken];
// }

// export function deleteAuthData() {
//   localStorage.removeItem(STORE_AUTH_KEY);
// }

export function storeAuthData(accessToken?: string, refreshToken?: string, userRole?: string) {
  if (accessToken !== undefined) {
    setCookie("accessToken", accessToken, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  if (refreshToken !== undefined) {
    setCookie("refreshToken", refreshToken, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  if (userRole !== undefined) {
    setCookie("userRole", userRole, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
}

export function retrieveAuthData(): [string | undefined, string | undefined, string | undefined] {
  const accessToken = getCookie("accessToken") as string | undefined;
  const refreshToken = getCookie("refreshToken") as string | undefined;
  const userRole = getCookie("userRole") as string | undefined;

  return [accessToken, refreshToken, userRole];
}

export function deleteAuthData() {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  deleteCookie("userRole");
}

export async function uploadFile(file: File): Promise<UploadFileResponse> {
  try {
    const payload = new FormData();
    payload.append("file", file, file.name);

    const response = await axiosInstance.post("/file/upload", payload);
    const uploadResult = response.data.data as UploadFileResponse;

    try {
      const media = await getFileByStorageId(uploadResult.storageId);
      return {
        ...uploadResult,
        id: media.id,
      };
    } catch (metadataError) {
      console.error("Error fetching uploaded file metadata:", metadataError);
      return uploadResult;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    if (axios.isAxiosError(error)) {
      const uploadError = new Error(error.response?.data?.message || "Uploading Failed") as Error & {
        response?: typeof error.response;
        code?: string;
      };

      uploadError.response = error.response;
      uploadError.code = error.code;

      throw uploadError;
    }

    throw new Error("Uploading Failed");
  }
}

export async function getFileByStorageId(fileId: string): Promise<Media> {
  const response = await axiosInstance.get(`/file/${fileId}`);
  return response.data.data;
}

export async function deleteFileByStorageId(fileId: string): Promise<void> {
  await axiosInstance.delete(`/file/${fileId}`);
}
