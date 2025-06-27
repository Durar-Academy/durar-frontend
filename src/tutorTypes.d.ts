interface User {
  firstName: string | null;
  lastName: string | null;
  role: string;
  profilePictureId: string | null;
}

interface TopBarProps {
  children: React.ReactNode;
  subtext: string;
  user: User | undefined;
}

interface TutorStatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
}

interface TutorsMetrics2 {
  totalCourses: number;
  totalStudents: number;
  totalAssignments: number;
  totalEarnings?: number;
  pendingEarnings?: number;
  avgCourseRating?: number;
  totalStudentsTaught?: number;
  totalClasses?: number;
}

type TutorsDashboard = {
  totalStudents: number;
  totalCourses: number;
  totalAssignments: number;
  upcomingClasses: {
    studentId: string;
    studentName: string;
    category: string;
    email: string;
    status: string;
    time: string;
    day: string;
  }[];
}

interface ClassItem {
  day: string;
  student: string;
  category: string;
  time: string;
  status: string;
}


interface TutorStudentsResponse {
  records: {
    studentId: string;
    studentName: string;
    category: string;
    email: string;
    status: string;
    time: string;
    day: string;
  }[];
  metaData: {
    page: number;
    perPage: number;
    pageCount: number;
    totalCount: number;
    hasPreviousPages: boolean;
    hasNextPages: boolean;
    links: {
      number: number;
      url: string;
    }[];
  };
}

interface Students {
  id: string;
  name: string;
  category: string;
  email: string;
  status: Active | Inactive;
}

interface StudentTableProps {
  page: number;
  setPage: (page: number) => void;
}



interface TutorClassesResponse {
  records: {
    id: string;
    day: string;
    start: string;
    end: string;
    status: string;
    courseId: string;
    studentId: string;
    createdAt: string;
    updatedAt: string;
    course: {
      id: string;
      title: string;
      category: string;
      thumbnailId: string;
      thumbnail: {
        id: string;
        storageId: string;
      };
    };
    student: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }[];
  metaData: {
    page: number;
    perPage: number;
    pageCount: number;
    totalCount: number;
    hasPreviousPages: boolean;
    hasNextPages: boolean;
    links: {
      number: number;
      url: string;
    }[];
  };
}

// Assignment types
interface TutorAssignmentsResponse {
  records: {
    id: string;
    title: string;
    dueAt: string;
    totalScore: number;
    type: string;
    courseId: string;
    course: {
      id: string;
      title: string;
      category: string;
    };
    _count: {
      AssignmentSubmission: number;
    };
    state: string;
    totalSubmissions: number;
  }[];
  metaData: {
    page: number;
    perPage: number;
    pageCount: number;
    totalCount: number;
    hasPreviousPages: boolean;
    hasNextPages: boolean;
    links: {
      number: number;
      url: string;
    }[];
  };
}

interface AssignmentItem {
  id: string;
  title: string;
  course: string;
  status: "Completed" | "Pending";
  dueDate: string;
  submissions: number;
}

// Student profile
interface UserProfileResponse {
  id: string;
  email: string;
  title: string | null;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: string | null;
  phone: string | null;
  country: string | null;
  emailVerifiedAt: string | null;
  status: string;
  lastLoginAt: string | null;
  role: string;
  profilePictureId: string | null;
  paypalCustomerId: string | null;
  paypalCardCustomerId: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  status: string;
  role: string;
  profilePictureId: string | null;
}

interface TutorActivityResponse {
  records: {
    id: string;
    userId: string;
    action: string;
    context: string;
    contextId: string;
    metadata: any | null;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      profilePicture: string | null;
    };
  }[];
  metaData: {
    page: number;
    perPage: number;
    pageCount: number;
    totalCount: number;
    hasPreviousPages: boolean;
    hasNextPages: boolean;
    links: {
      number: number;
      url: string;
    }[];
  };
}

interface NotificationItem {
  id: string;
  context: string;
  createdAt: string;
}

interface StudentActivityResponse {
  records: {
    id: string;
    action: string;
    context: string;
    contextId: string;
    metadata: any | null;
    createdAt: string;
    updatedAt: string;
  }[];
  metaData: {
    page: number;
    perPage: number;
    pageCount: number | null;
    totalCount: {
      id: number;
      action: number;
      context: number;
      contextId: number;
      metadata: number;
      createdAt: number;
      updatedAt: number;
    };
    hasPreviousPages: boolean;
    hasNextPages: boolean;
    links: {
      number: number;
      url: string;
    }[];
  };
}

interface ActivityItem {
  id: string;
  context: string;
  createdAt: string;
}