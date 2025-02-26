export async function encryptCredentials(email: string, password: string): Promise<EncryptionPayload | null> {
  try {
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);

    const encoder = new TextEncoder();
    const emailBuffer = encoder.encode(email);
    const passwordBuffer = encoder.encode(password);

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encryptedEmail = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, emailBuffer);
    const encryptedPassword = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, passwordBuffer);

    const exportedKey = await crypto.subtle.exportKey("raw", key);

    return {
      encryptedEmail: new Uint8Array(encryptedEmail),
      encryptedPassword: new Uint8Array(encryptedPassword),
      iv,
      key: new Uint8Array(exportedKey),
    };
  } catch (error) {
    console.error("Encryption failed", error);
    return null;
  }
}

export async function decryptCredentials({
  encryptedEmail,
  encryptedPassword,
  iv,
  key,
}: EncryptionPayload): Promise<{ email: string; password: string } | null> {
  try {
    const importedKey = await crypto.subtle.importKey("raw", key, { name: "AES-GCM", length: 256 }, true, ["decrypt"]);

    const decryptedEmail = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, importedKey, encryptedEmail);
    const decryptedPassword = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, importedKey, encryptedPassword);

    const decoder = new TextDecoder();
    return {
      email: decoder.decode(decryptedEmail),
      password: decoder.decode(decryptedPassword),
    };
  } catch (error) {
    console.error("Decryption failed", error);
    return null;
  }
}
