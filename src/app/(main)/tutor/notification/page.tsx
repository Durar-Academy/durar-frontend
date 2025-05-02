"use client";
import AddBtn from "@/components/tutor/AddBtn";
import AssignmentOverview from "@/components/tutor/Assignment-component/AssignmentOverview";
import AddNotification from "@/components/tutor/Notification-component/AddNotification";
import NotificaitionList from "@/components/tutor/Notification-component/NotificationList";
import { Top_Bar } from "@/components/tutor/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { notificationStatData } from "@/data2/constants";
import { useCurrentUser } from "@/hooks/useAccount";
import { useState } from "react";

const Page = () => {
  const [show, setShow] = useState(false);

  const notificationData = [
    {
      title: "New Course Schedule",
      allStudents: "All students",
      date: "Feb 25, 2025",
      status: "Sent" as "Sent",
    },
    {
      title: "New Course Schedule",
      allStudents: "All students",
      date: "Feb 25, 2025",
      status: "Sent" as "Sent",
    },
    {
      title: "New Course Schedule",
      allStudents: "All students",
      date: "Feb 27, 2025",
      status: "Sent" as "Sent",
    },
    {
      title: "New Course Schedule",
      allStudents: "All students",
      date: "Feb 25, 2025",
      status: "Failed" as "Failed",
    },
  ];

  const handleShowNotification = () => {
    setShow(!show);
  };

  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

  return (
    <section className="flex flex-col gap-3">
      {currentUserLoading ? (
        <Skeleton className="w-full rounded-xl h-[80px]" />
      ) : (
        <Top_Bar
          subtext="Manage notifications for students, tutors, and administrators"
          user={user as User}
        >
          <p className="flex items-center gap-1">Notifications</p>
        </Top_Bar>
      )}
      <section className="stats">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[140px]" />
        ) : (
          <AssignmentOverview
            title="Notificaition Overview"
            data={notificationStatData}
            overview={false}
          >
            <button
              type="button"
              title="Handle notification popup"
              onClick={handleShowNotification}
            >
              <AddBtn showChevron={false} txt="Create Notification" />
            </button>
          </AssignmentOverview>
        )}
      </section>

      <section className=" bg-white p-6 border-[1px] border-[#E7E8EE] rounded-xl">
        <NotificaitionList notifications={notificationData} />
      </section>
      <AddNotification handleShow={handleShowNotification} show={show} />
    </section>
  );
};

export default Page;
