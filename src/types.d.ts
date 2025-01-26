type EncryptionPayload = {
  encryptedEmail: Uint8Array;
  encryptedPassword: Uint8Array;
  iv: Uint8Array;
  key: Uint8Array;
};
