"use client";

import { TopBar } from "@/components/shared/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationsTable } from "@/components/student/notification-table";

import { useCurrentUser } from "@/hooks/useAccount";
import { useNotifications } from "@/hooks/useStudent";

export default function NotificationPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

  const { data: notifications, isLoading: notificationsLoading } = useNotifications();
  console.log(notifications, "notifications");

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={"Manage your notifications"} user={user as User}>
            Notifications
          </TopBar>
        )}
      </div>

      {notificationsLoading ? (
        <Skeleton className="rounded-xl w-full h-screen" />
      ) : (
        <NotificationsTable notifications={notifications} />
      )}
    </section>
  );
}
