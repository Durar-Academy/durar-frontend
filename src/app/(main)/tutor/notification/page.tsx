"use client";
import NotificaitionList from "@/components/tutor/Notification-component/NotificationList";
import { Top_Bar } from "@/components/tutor/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAccount";
import { useTutorNotifications } from "@/hooks/tutorQueries";
import { processTutorNotifications } from "@/utils/tutorProcessor";
import { useState } from "react";

const Page = () => {
  const [page] = useState(1);
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: notificationsData, isLoading: notificationsLoading } = useTutorNotifications({ page });

  const notifications = processTutorNotifications(notificationsData);

  return (
    <section className="flex flex-col gap-3">
      {currentUserLoading ? (
        <Skeleton className="w-full rounded-xl h-[80px]" />
      ) : (
        <Top_Bar
          subtext="Get all Notifications"
          user={user as User}
        >
          <p className="flex items-center gap-1">Notifications</p>
        </Top_Bar>
      )}

      <section className=" bg-white p-6 border-[1px] border-[#E7E8EE] rounded-xl">
        {notificationsLoading ? (
          <Skeleton className="w-full rounded-xl h-[140px]" />
        ) : (
          <NotificaitionList notifications={notifications} />
        )}
      </section>
    </section>
  );
};

export default Page;
