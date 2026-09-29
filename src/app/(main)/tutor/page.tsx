"use client";
import UpcomingClasses from "@/components/tutor/DashboardTable";
import RecentNotificatin from "@/components/tutor/Recent-notificatin";
import { Top_Bar } from "@/components/tutor/top-bar";
import TutorStatCard from "@/components/tutor/tutor-stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAccount";
import { useTutorMetrics } from "@/hooks/tutorQueries";
import { processTutorDashboardMetrics } from "@/utils/tutorProcessor";

// Map TutorsMetrics to TutorsMetrics2
function mapTutorsMetricsToTutorsMetrics2(
  metrics?: DashboardTutorsMetrics
): TutorsMetrics2 {
  return {
    totalCourses: metrics?.totalCourses ?? 0,
    totalStudents: metrics?.totalStudents ?? 0,
    totalAssignments: metrics?.totalAssignments ?? 0, // or another appropriate field
    totalEarnings: metrics?.totalEarnings,
    pendingEarnings: metrics?.pendingEarnings,
    avgCourseRating: metrics?.avgCourseRating,
    totalStudentsTaught: metrics?.totalStudentsTaught,
    totalClasses: metrics?.totalAssignments,
  };
}

const Page = () => {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: metrics, isLoading: metricsLoading } = useTutorMetrics();

  const dashboardMetrics = processTutorDashboardMetrics(
    mapTutorsMetricsToTutorsMetrics2(metrics)
  );

  return (
    <section className="flex flex-col gap-3">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <Top_Bar subtext="Manage classes and students" user={user as User}>
            <p className="flex items-center gap-1">Dashboard</p>
          </Top_Bar>
        )}
      </div>
      <section className="stats">
        {metricsLoading ? (
          <Skeleton className="w-full rounded-xl h-[140px]" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {dashboardMetrics.map((stat, i) => (
              <TutorStatCard
                key={i}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
              />
            ))}
          </div>
        )}
      </section>

      <section className="UpcomingClasses grid grid-cols-1 gap-3 lg:grid-cols-3">
        <aside className="rounded-xl border border-[#E7E8EE] bg-white p-4 sm:p-6 lg:col-span-2">
          <UpcomingClasses />
        </aside>
        <aside className="rounded-xl border border-[#E7E8EE] bg-white p-4 lg:col-span-1">
          <RecentNotificatin />
        </aside>
      </section>
    </section>
  );
};

export default Page;
