"use client";

import { STORE_KEY } from "@/data/constants";

const STORE_CREDENTIAL_KEY = `${STORE_KEY}-credentials`;
export const STORE_TOKEN_KEY = `${STORE_KEY}-token`;
export const STORE_EMAIL_KEY = `${STORE_KEY}-email`;
const STORE_AUTH_KEY = `${STORE_KEY}-auth`;

export function storeCredentials({ encryptedEmail, encryptedPassword, iv, key }: EncryptionPayload) {
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

export function storeAuthData(accessToken: string, refreshToken: string) {
  localStorage.setItem(STORE_AUTH_KEY, JSON.stringify({ accessToken, refreshToken }));
}

export function retrieveAuthData() {
  const storeAuthData = localStorage.getItem(STORE_AUTH_KEY);
  if (!storeAuthData) return [];

  const { accessToken, refreshToken } = JSON.parse(storeAuthData);
  return [accessToken, refreshToken];
}

export function deleteAuthData() {
  localStorage.removeItem(STORE_AUTH_KEY);
}
