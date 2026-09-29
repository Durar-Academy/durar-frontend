import { axiosInstance } from "./axios";

type StudentAssignmentFilters = {
  search?: string;
  courseId?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
};

export type AssignmentSubmissionPayload = {
  content?: string;
  submissionLink?: string;
  files: string[];
  recordings: Array<{ position: number; fileId: string; duration: number }>;
};

export async function getStudentAssignment(assignmentId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/assignment/student", {
    params: { page: 1, limit: 100 },
    signal: options?.signal,
  });

  const data = response.data?.data ?? response.data;
  const assignments = Array.isArray(data) ? data : data?.records ?? [];
  const assignment = assignments.find((item: StudentAssignment) => item.id === assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  return assignment as StudentAssignment;
}

export async function submitAssignment(
  assignmentId: string,
  payload: AssignmentSubmissionPayload,
) {
  const response = await axiosInstance.post(`/assignment/${assignmentId}/submit`, payload);
  return response.data;
}

export async function initializeLesson(lessonId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.post(`/lesson/${lessonId}/progress`, {
    signal: options?.signal,
  });
  return response.data;
}

export async function updateLessonProgress(
  lessonId: string,
  { progress }: { progress: number },
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.put(
    `/lesson/${lessonId}/progress`,
    { progress },
    { signal: options?.signal },
  );
  return response.data;
}

export async function getAssignments(options?: {
  signal?: AbortSignal;
  filters?: StudentAssignmentFilters;
}) {
  const params = new URLSearchParams();

  if (options?.filters?.search) params.append("search", options.filters.search);
  if (options?.filters?.courseId) params.append("courseId", options.filters.courseId);
  if (options?.filters?.status) params.append("status", options.filters.status);
  if (options?.filters?.type) params.append("type", options.filters.type);
  if (options?.filters?.page !== undefined) params.append("page", String(options.filters.page));
  if (options?.filters?.limit !== undefined) params.append("limit", String(options.filters.limit));

  const response = await axiosInstance.get(`/assignment/student?${params.toString()}`, {
    signal: options?.signal,
  });

  const data = response.data?.data ?? response.data;

  if (Array.isArray(data)) return data;

  return data?.records ?? [];
}

export async function getPayments(options?: { signal?: AbortSignal; filters?: PaymentHistoryFilters }) {
  const response = await axiosInstance.get("/payment", {
    signal: options?.signal,
    params: options?.filters,
  });
  const payload = response.data?.data ?? response.data;
  return {
    records: Array.isArray(payload) ? payload : payload?.records ?? [],
    metaData: Array.isArray(payload) ? undefined : payload?.metaData,
  } as PaymentHistoryResponse;
}

export async function getPaymentMethods(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/payment-method", {
    signal: options?.signal,
  });
  const payload = response.data?.data ?? response.data;
  if (Array.isArray(payload)) return payload as PaymentMethod[];
  if (Array.isArray(payload?.records)) return payload.records as PaymentMethod[];
  if (Array.isArray(payload?.data)) return payload.data as PaymentMethod[];
  return [];
}

export async function downloadStudentTransactions(options?: { signal?: AbortSignal; filters?: PaymentHistoryFilters }) {
  const response = await axiosInstance.get("/payment/download-transactions", {
    signal: options?.signal,
    params: options?.filters,
    responseType: "blob",
  });
  return response.data as Blob;
}

export type PaymentHistoryFilters = {
  status?: PaymentStatus;
  startAt?: string;
  endAt?: string;
  page?: number;
  limit?: number;
};

export type PaymentHistoryResponse = {
  records: Payment[];
  metaData?: {
    page: number;
    perPage: number;
    pageCount: number;
    totalCount: number;
    hasPreviousPages: boolean;
    hasNextPages: boolean;
  };
};

export async function setPreferredPaymentMethod(paymentMethodId: string) {
  const response = await axiosInstance.put(`/payment-method/${paymentMethodId}/preferred`);
  return response.data?.data ?? response.data;
}

export async function addCard(payload: {
  type: string;
  provider: string;
  name: string;
  billingAddress: {
    addressLine1: string;
    adminArea1: string;
    postalCode: string;
    countryCode: string;
    city: string;
  };
  cardNumber: string;
  expiry: string;
}) {
  const response = await axiosInstance.post(`/payment/initialize`, payload);
  return response.data;
}

export async function verifyPayment(payload: { reference: string; provider?: string; type?: string }) {
  const response = await axiosInstance.get('/payment/verify', { params: { provider: payload.provider ?? 'paystack', reference: payload.reference, type: payload.type } });
  return response.data?.data ?? response.data;
}

export async function getNotifications(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/notification/my", {
    signal: options?.signal,
  });
  return response.data.data.data;
}

export async function getNotification(
  notificationId: string,
  options?: { signal?: AbortSignal },
): Promise<NotificationDetail> {
  const response = await axiosInstance.get(`/notification/${notificationId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function markAsRead(notificationId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.patch(
    `/notification/${notificationId}/read`,
    undefined,
    { signal: options?.signal },
  );
  return response.data;
}

export async function getStudentTimetable(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/class/timetable", {
    signal: options?.signal,
  });
  return response.data.data;
}

// Browse mode returns every published course, with `Course.enrolled` marking the
// ones the student already has access to and `Course.amount` carrying the price.
export async function getStudentCourses(options?: { signal?: AbortSignal }): Promise<Course[]> {
  const response = await axiosInstance.get("/course", {
    params: { status: "published", browse: true, limit: 100 },
    signal: options?.signal,
  });

  const payload = response.data?.data ?? response.data;
  const records = Array.isArray(payload)
    ? payload
    : payload?.records ?? payload?.data?.records ?? payload?.data;

  return Array.isArray(records) ? records : [];
}

/* -------------------------------------------------------------------------- */
/*                                   Quizzes                                  */
/* -------------------------------------------------------------------------- */

export type StudentQuizQuestionType =
  | "single_choice"
  | "multiple_choice"
  | "fill_in_the_blank"
  | "true_or_false";

export type StudentQuizQuestion = {
  id: string;
  body: string;
  type: StudentQuizQuestionType;
  options: string[];
};

/**
 * Answer values accepted by `POST /quiz/:id/submit`. They must match exactly
 * what the backend `gradeQuiz` compares against (quiz.service.ts):
 *  - single_choice      -> the option text itself (string, `===`)
 *  - multiple_choice    -> the option texts (string[], order-insensitive)
 *  - fill_in_the_blank  -> raw text (string, compared trimmed + lower-cased)
 *  - true_or_false      -> a real JSON boolean (not "true"/"false")
 */
export type StudentQuizAnswerValue = string | string[] | boolean;

export type StudentQuizAnswerPayload = {
  questionId: string;
  answer: StudentQuizAnswerValue;
};

export type StudentQuizSubmission = {
  id: string;
  assignmentId: string;
  userId: string;
  totalQuestions: number;
  grade: number | null;
  gradedAt?: string | Date | null;
  timeStarted?: string | Date | null;
  timeSubmitted?: string | Date | null;
  answers?: StudentQuizAnswerPayload[] | null;
};

/**
 * The student assignment payload (`GET /assignment/student`) embeds the
 * caller's own QuizSubmission rows (newest first) under `QuizSubmission`, so an
 * existing attempt, its `timeSubmitted` and its `grade` can be read without a
 * dedicated endpoint.
 */
export type StudentAssignmentWithQuiz = StudentAssignment & {
  QuizSubmission?: StudentQuizSubmission[] | null;
};

export function findSubmittedQuizSubmission(
  assignment: StudentAssignmentWithQuiz | null | undefined,
): StudentQuizSubmission | null {
  const submissions = assignment?.QuizSubmission;
  if (!Array.isArray(submissions)) return null;

  return submissions.find((submission) => Boolean(submission?.timeSubmitted)) ?? null;
}

export function findActiveQuizSubmission(
  assignment: StudentAssignmentWithQuiz | null | undefined,
): StudentQuizSubmission | null {
  const submissions = assignment?.QuizSubmission;
  if (!Array.isArray(submissions)) return null;

  return submissions.find((submission) => submission && !submission.timeSubmitted) ?? null;
}

export async function startQuizAttempt(assignmentId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.post(`/quiz/${assignmentId}/start`, undefined, {
    signal: options?.signal,
  });

  return (response.data?.data ?? response.data) as StudentQuizSubmission;
}

export async function getQuizQuestions(assignmentId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/question/all/${assignmentId}`, {
    signal: options?.signal,
  });

  const payload = response.data?.data ?? response.data;
  const records = Array.isArray(payload) ? payload : payload?.records ?? payload?.data ?? [];

  return records as StudentQuizQuestion[];
}

/**
 * Submits quiz answers.
 *
 * Without `timeSubmitted` this saves a draft only: the backend `submitQuiz`
 * grades exclusively inside its `if (rest.timeSubmitted)` branch, while the
 * else branch updates `answers`/`totalQuestions` and leaves `grade` untouched.
 * Sending `timeSubmitted` (ISO datetime) finalises the attempt and returns the
 * graded submission.
 */
export async function saveQuizAnswers(
  submissionId: string,
  payload: { answers: StudentQuizAnswerPayload[]; timeSubmitted?: string },
) {
  const response = await axiosInstance.post(`/quiz/${submissionId}/submit`, payload);

  return (response.data?.data ?? response.data) as StudentQuizSubmission;
}

/** The graded submit response adds `correctAnswer` to every answer entry. */
export type StudentGradedQuizAnswer = StudentQuizAnswerPayload & {
  correctAnswer?: StudentQuizAnswerValue | null;
};

export type QuizReviewEntry = {
  questionId: string;
  body: string;
  status: "correct" | "incorrect" | "unanswered";
  givenAnswer?: StudentQuizAnswerValue;
  correctAnswer?: StudentQuizAnswerValue | null;
};

/** Mirrors the comparisons in the backend `gradeQuiz` for each question type. */
export function isQuizAnswerCorrect(
  question: StudentQuizQuestion,
  given: StudentQuizAnswerValue | undefined,
  correct: StudentQuizAnswerValue | null | undefined,
): boolean {
  // A question without an Answer row is counted as correct by the backend.
  if (correct === null || correct === undefined) return true;

  switch (question.type) {
    case "multiple_choice":
      return (
        Array.isArray(given) &&
        Array.isArray(correct) &&
        given.length === correct.length &&
        given.every((item) => (correct as string[]).includes(item))
      );

    case "fill_in_the_blank":
      return (
        typeof given === "string" &&
        typeof correct === "string" &&
        given.trim().toLowerCase() === correct.trim().toLowerCase()
      );

    default:
      return given === correct;
  }
}

export function formatQuizAnswerValue(value: StudentQuizAnswerValue | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "True" : "False";
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "—";

  return value.trim() ? value : "—";
}

/**
 * The denominator of a quiz grade is the assignment's full question count, so
 * questions the student never answered are listed here as `unanswered` (and
 * counted as wrong by the backend).
 */
export function buildQuizReview(
  questions: StudentQuizQuestion[],
  submission: StudentQuizSubmission | null | undefined,
): QuizReviewEntry[] {
  const gradedAnswers = Array.isArray(submission?.answers)
    ? (submission?.answers as StudentGradedQuizAnswer[])
    : [];

  return questions.map((question) => {
    const graded = gradedAnswers.find((answer) => answer?.questionId === question.id);

    if (!graded) {
      return { questionId: question.id, body: question.body, status: "unanswered" as const };
    }

    const correctAnswer = graded.correctAnswer ?? null;

    return {
      questionId: question.id,
      body: question.body,
      status: isQuizAnswerCorrect(question, graded.answer, correctAnswer) ? "correct" : "incorrect",
      givenAnswer: graded.answer,
      correctAnswer,
    };
  });
}

/** Matches the project-wide convention of surfacing `error.response.data.message`. */
export function getStudentApiErrorMessage(error: unknown, fallback: string): string {
  const responseMessage = (error as { response?: { data?: { message?: string } } } | undefined)
    ?.response?.data?.message;

  if (typeof responseMessage === "string" && responseMessage.trim()) return responseMessage;
  if (error instanceof Error && error.message) return error.message;

  return fallback;
}
