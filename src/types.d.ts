type EncryptionPayload = {
  encryptedEmail: Uint8Array;
  encryptedPassword: Uint8Array;
  iv: Uint8Array;
  key: Uint8Array;
};

type CreateAccountPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  country: string;
  phone: string;
  title: "Mr" | "Mrs" | "Ms" | "Dr";
};

type AuthenticationContextProps = {
  loggedIn: boolean;
  authLoading: boolean;
  setAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};
