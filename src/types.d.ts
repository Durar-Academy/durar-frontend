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
  paypalCustomerId: string | null;
  paypalCardCustomerId: string | null;
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
  amount: number;
  dateIssued: string;
  dueDate: string;
  paymentMethod: string;
  status: PaymentStatus;
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
  metadata: Record<string, never> | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
};

type PaymentStatus = "pending" | "completed" | "pending_refund" | "refund_failed" | "refunded" | "failed";

type Payment = {
  id: string;
  amount: number;
  currency: string;
  provider: string;
  reference: string;
  refundReference: string | null;
  chargeId: string;
  status: PaymentStatus;
  metadata: Record<string, never> | null;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  charge: Charge;
};

type Charge = {
  id: string;
  userId: string;
  amount: number;
  debitType: string;
  totalPaid: number;
  amountRefunded: number;
  processingAmount: number;
  chargeAttempt: number;
  dueAt: Date;
  isVoid: boolean;
  billingPlanId: string | null;
  memo: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};

type OverviewCardProps = {
  title: string;
  figure: string;
  children: React.ReactNode;
};

type StudentsMetrics = {
  inactiveStudents: number;
  activeStudents: number;
  students: number;
  graduatedStudents: number;

  coursesCount: number;
  coursesCompleted: number;
  coursesIncomplete: number;
  completion: number;

  currentBillingPlan: CurrentBillingPlan;
  lastPayment: Payment;
  upcomingCharges: number;
  upcomingChargeDate: Date | null;
};

type StudentsTableProps = {
  id: string;
  name: string;
  category: string;
  email: string;
  status: StudentStatus;
}[];

type StudentStatus = "unverified" | "active" | "suspended" | "deactivated" | "graduated";

type StudentFilters = {
  search?: string;
  status?: StudentStatus;
};

type Student = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: "male" | "female";
  phone: string;
  country: string;
  emailVerifiedAt: Date | null;
  status: StudentStatus;
  lastLoginAt: string | null;
  role: "student";
  profilePictureId: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  paypalCustomerId: string | null;
  paypalCardCustomerId: string | null;
};

type StudentCoursesTableProps = {
  id: string;
  courseTitle: string;
  progress: string;
  startDate: string;
  dueDate: string;
  completionDate: string;
}[];

type Courses = {
  id: string;
  courseId: string;
  userId: string;
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  course: Course;
  user: User;
};

type BillingPlan = {
  id: string;
  name: string;
  interval: string | null;
  currency: string;
  amount: number;
  description: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

interface CurrentBillingPlan {
  id: string;
  userId: string;
  billingPlanId: string;
  startAt: Date;
  endAt: Date | null;
  chargeAt: Date | null;
  metadata: Record<string, never> | null;
  renewalCount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  cancelledAt: Date | null;
  deletedAt: Date | null;
  billingPlan: BillingPlan;
}

type Subscription = {
  id: string;
  userId: string;
  billingPlanId: string;
  startAt: string;
  endAt: string | null;
  chargeAt: string;
  metadata: Record<string, never> | null;
  renewalCount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  status: "active" | string;
  cancelledAt: string | null;
  deletedAt: string | null;
  billingPlan: BillingPlan;
};
