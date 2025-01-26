import { STORE_KEY } from "@/data/constants";

const STORE_CREDENTIAL_KEY = `${STORE_KEY}-credentials`;

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
