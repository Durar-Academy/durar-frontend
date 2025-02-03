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

type LinkComponentProps = {
  href: string;
  children: React.ReactNode;
};

type ButtonComponentProps = {
  href: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
};

type SelectComponentProps = {
  options: { value: string; label: string }[];
};

type ComponentConfig = {
  type: string;
  component: ElementType;
  props: {
    href?: string;
    onClick?: () => void;
    children?: React.ReactNode;
    options?: { value: string; label: string }[];
  };
};

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: "male" | "female";
  phone: string;
  country: string;
  emailVerifiedAt: Date | null;
  status: "active" | "inactive" | "suspended";
  lastLoginAt: string | null;
  role: "admin" | "student" | "tutor";
  profilePictureId: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type StatCardProps = {
  title: string;
  icon: LucideIcon;

  main: {
    figure: string;
    label: string;
  };

  sub: {
    figure: string;
    label: string;
  };
};

type ActivitiesCardProps = {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
};

type TutorClassProps = {
  firstName: string;
  lastName: string;
  date: string;
  time: string;
};

type EnrollmentData = {
  [key: string]: { month: string; value: number }[];
};

type PaymentsTableProps = {
  id: string;
  amount: string;
  dateIssued: string;
  dueDate: string;
  paymentMethod: string;
  status: string;
}[];

type EnrollmentTrendGraphProps = {
  users: User[];
};
