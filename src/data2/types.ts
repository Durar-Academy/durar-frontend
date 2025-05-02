
type StatCardProps = {
    title: string;
    icon: string;

    main: {
        figure: string;
        label: string;
    };

    sub: {
        figure: string;
        label: string;
    };
};

export interface TutorsMetrics {
    coursesCount: number;
    totalStudents: number;
    totalCompletedClasses: number;
    totalEarnings?: number;
    pendingEarnings?: number;
    avgCourseRating?: number;
    totalStudentsTaught?: number;
    totalClasses?: number;
  }
  
  export interface TutorStatCardProps {
    title: string;
    value: string;
    icon: React.ReactElement;
  }