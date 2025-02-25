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
  exact?: boolean;
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
    exact?: boolean;
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

// type Course = {
//   id: string;
//   title: string;
//   description: string;
//   thumbnailId: null;
//   status: string;
//   language: null;
//   category: null;
//   difficultyLevel: null;
//   enableCertification: boolean;
//   trackProgress: boolean;
//   enableComments: boolean;
//   additionalNotes: null;
//   prerequisites: never[];
//   createdById: string;
//   deletedAt: null;
//   createdAt: string;
//   updatedAt: string;
// };

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

type PaymentStatus =
  | "pending"
  | "completed"
  | "pending_refund"
  | "refund_failed"
  | "refunded"
  | "failed";

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

type SearchFilters = {
  search?: string;
  status?: StudentStatus | TutorStatus;
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
  progress: number;
  startDate: string;
  completionDate: string;
}[];

type Courses = {
  id: string;
  courseId: string;
  userId: string;
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  lastAccessAt: Date | null;
  completeAt: Date | null;
  progress: number;
  startAt: Date | null;
  course: Course;
  user: User;
};

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnailId: null;
  status: "draft" | "published";
  language: null;
  category: null;
  difficultyLevel: string | null;
  enableCertification: boolean;
  trackProgress: boolean;
  enableComments: boolean;
  additionalNotes: null;
  prerequisites: never[];
  createdById: string;
  deletedAt: null;
  createdAt: string;
  updatedAt: string;
  Lesson: Lesson[];
  UserCourse: UserCourse[];
  averageRating: number;
  CourseRating: CourseRating[];
  completionRate: number;
};

type CourseRating = {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  comment: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
};

type UserCourse = {
  id: string;
  courseId: string;
  userId: string;
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  lastAccessAt: Date | null;
  completeAt: Date | null;
  progress: number;
  startAt: Date | null;
  lastName: string;
  firstName: string;
  role: "student" | "tutor";
};

type Lesson = {
  id: string;
  title: string;
  duration: number;
  isLocked: boolean;
  isCompleted: boolean;
  type: string;
  mediaId: string | null;
  courseId: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type Courses = {
  id: string;
  courseId: string;
  userId: string;
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  lastAccessAt: Date | null;
  completeAt: Date | null;
  progress: number;
  startAt: Date | null;
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

type CurrentBillingPlan = {
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
};

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

type UsersPaymentsTableProps = {
  id: string;
  amount: number;
  date: string;
  status: PaymentStatus;
}[];

type StudentAssignmentsTableProps = {
  id: string;
  course: string;
  date: string;
  score: number;
  status: string;
}[];

type Assignment = {
  id: string;
  title: string;
  courseId: string;
  dueAt: Date;
  duration: number | null;
  type: "assignment";
  description: string | null;
  allowLate: boolean;
  mediaId: string | null;
  totalScore: number;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  AssignmentSubmission: AssignmentSubmission[];
  QuizSubmission: QuizSubmission[];
  course: Course;
  status: AssignmentStatus;
};

type AssignmentSubmission = {
  id: string;
  assignmentId: string;
  content: string;
  submissionLink: string | null;
  mediaId: string | null;
  grade: number | null;
  gradedById: string | null;
  gradedAt: Date | null;
  deletedAt: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  status: AssignmentStatus;
};

type QuizSubmission = {
  id: string;
  userId: string;
  assignmentId: string;
  totalQuestions: number;
  grade: number | null;
  gradedAt: Date | null;
  timeStarted: Date;
  timeSubmitted: Date | null;
  answers: QuizAnswer[];
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type SingleChoiceAnswer = {
  questionId: string;
  singleChoiceAnswer: string;
};

type MultipleChoiceAnswer = {
  questionId: string;
  multipleChoiceAnswer: string[];
};

type QuizAnswer = SingleChoiceAnswer | MultipleChoiceAnswer;

type AssignmentStatus = "pending" | "submitted" | "graded";

type TutorsMetrics = {
  pendingEarnings: number;
  totalEarnings: number;

  tutorsCount: number;
  activeTutorsCount: number;
  inActiveTutorsCount: number;

  coursesCount: number;
  totalClasses: number;
  totalCompletedClasses: number;

  totalStudentsTaught: number;
  totalStudents: number;
  avgCourseRating: number;
};

type TutorStatus = "invited" | "active" | "suspended" | "deactivated" | "unverified";

type TutorsTableProps = {
  id: string;
  name: string;

  email: string;
  status: TutorStatus;
}[];

type Tutor = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: "male" | "female";
  phone: string;
  country: string;
  emailVerifiedAt: Date | null;
  status: TutorStatus;
  lastLoginAt: string | null;
  role: "tutor";
  profilePictureId: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  paypalCustomerId: string | null;
  paypalCardCustomerId: string | null;
};

type TutorCoursesTableProps = {
  id: string;
  courseTitle: string;
  noOfStudents: number;
  progress: number;
  startDate: string;
  completionDate: string;
}[];

type CoursesMetrics = {
  totalCourses: number;
  activeCourses: number;
  inActiveCourses: number;
  completedCourses: number;
};

type CourseStatus = "draft" | "published";

type CreateCourse = {
  title: string;
  category: string;
  description: string;
  thumbnailId: {
    file: File;
    preview: string;
  } | null;

  Lesson: CreateLesson[];
  language: string;
  difficultyLevel: string;
  enableCertification: boolean;
  trackProgress: boolean;
  enableComments: boolean;
  additionalNotes: string;
  status: CourseStatus;
};

type CreateLesson = {
  id: number;
  name: string;
  video: FileDropValue;
  type: string;
  isLocked: boolean;
};

type CreateCourseFormContextProps = {
  formData: CreateCourse;

  updateFormData: (newData: Partial<CreateCourse>) => void;
  cancelForm: () => void;

  currentFormStep: number;
  totalFormSteps: number;

  prevStep: () => void;
  nextStep: () => void;

  saveAsDraft: () => void;
  publishCourse: () => void;

  isSubmitting: boolean;
};

type DropzoneProps = {
  onFileDrop: ({ file: File, preview: string }) => void;
  value: FileDropValue;
};

type FileDropValue = { file: File; preview: string } | null;
