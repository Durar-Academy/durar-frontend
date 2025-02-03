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

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnailId: null;
  status: string;
  language: null;
  category: null;
  difficultyLevel: null;
  enableCertification: boolean;
  trackProgress: boolean;
  enableComments: boolean;
  additionalNotes: null;
  prerequisites: never[];
  createdById: string;
  deletedAt: null;
  createdAt: string;
  updatedAt: string;
};

type Schedule = {
  id: string;
  day: string;
  startTime: Date;
  endTime: Date;
  courseId: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  course: Course;
  user: User;
};

type Metrics = {
  tutorsCount: number;
  activeTutorsCount: number;
  studentsCount: number;
  activeStudentsCount: number;
  totalCoursesCount: number;
  publishedCoursesCount: number;
  users: User[];
  creditedPayments: number;
  pendingPayments: number;
};

type Activity = {
  id: string;
  userId: string;
  action: string;
  context: string;
  contextId: string;
  metadata: null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
};
