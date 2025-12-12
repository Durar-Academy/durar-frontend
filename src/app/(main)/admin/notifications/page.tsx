"use client";

import { AddNotificationDialog } from "@/components/admin/add-notification-dialog";
import { NotificationsTable } from "@/components/admin/notifications-table";
import { OverviewCard } from "@/components/admin/overview-card";
import { TopBar } from "@/components/shared/top-bar";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAccount";
import { useNotifications } from "@/hooks/useAdmin";
import { processNotificationsMetrics } from "@/utils/processor";

const metrics = {
  totalNotifications: 247,
  readRate: 78,
  activeRecipients: 10,
};

export default function NotificationPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

  const { data: notifications, isLoading: notificationsLoading } = useNotifications();
  console.log(notifications, "notifications");

  const allNotificationsMetrics = processNotificationsMetrics(metrics ?? []);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar
            subtext={"Manage notifications for students, tutors, and administrators"}
            user={user as User}
          >
            Notifications
          </TopBar>
        )}
      </div>

      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-xl">Notification Overview</h3>

          <div>
            <AddNotificationDialog />
          </div>
        </div>

        <div className="notification-overview-cards">
          {false ? (
            <Skeleton className="w-full rounded-xl h-24" />
          ) : (
            <div className="flex gap-6 h-24">
              {allNotificationsMetrics.map((notificationMetrics, index) => (
                <OverviewCard overview={notificationMetrics} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      {notificationsLoading ? (
        <Skeleton className="rounded-xl w-full h-screen" />
      ) : (
        <NotificationsTable notifications={notifications} />
      )}
    </section>
  );
}
