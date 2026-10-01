"use client";

import { useQueryClient } from "@tanstack/react-query";
import { TopBar } from "@/components/shared/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAccount";
import { useNotification } from "@/hooks/useStudent";
import { markAsRead } from "@/lib/student";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, CheckIcon, ChevronRight, EyeIcon, FileIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SingleNotificationPage() {
  const { notificationId } = useParams();
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: notification, isLoading: notificationLoading } = useNotification(notificationId as string);
  const [isMarking, setIsMarking] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const queryClient = useQueryClient();

  const onSubmit = async () => {
    try {
      setIsMarking(true);

      const response = await markAsRead(notificationId as string);

      setIsRead(true);
      toast.success(response?.message || "Marked as Read!");

      queryClient.invalidateQueries({ queryKey: ["all-student-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["student-notification", notificationId] });
    } catch (error) {
      console.error("Mark as Read", error);

      let message = "Failed to mark as read. Please try again.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={notification?.title ?? "Notification"} user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={`/student/notifications`} className="hover:underline">
                Notifications
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span>Details</span>
            </p>
          </TopBar>
        )}
      </div>

      {notificationLoading ? (
        <Skeleton className="rounded-xl w-full h-64" />
      ) : !notification ? (
        <div className="bg-white p-4 rounded-xl border border-shade-2">
          <p className="text-low text-sm">Notification not found.</p>
        </div>
      ) : (
        <>
          <div className="bg-white p-4 rounded-xl border border-shade-2  flex justify-between items-center">
            <p className="flex items-center gap-1 text-low">
              <CalendarIcon className="size-5 text-shade-3" />
              Recieved on {format(new Date(notification.createdAt), "PPpp")}
            </p>

            <button
              className="text-sm text-white bg-orange hover:bg-burnt  px-3 py-2 text-center w-fit font-medium rounded-xl flex gap-1 disabled:opacity-50"
              disabled={isMarking || isRead}
              onClick={onSubmit}
            >
              <CheckIcon className="size-5" />
              {isRead ? "Read" : "Mark as Read"}
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-shade-2 ">
            <h1 className="mb-4 font-medium text-base">Notification Content</h1>

            <div className="text-high text-sm whitespace-pre-wrap break-words">{notification.content}</div>
          </div>

          {notification.media && (
            <div className="bg-white py-2 px-3 rounded-xl border border-shade-2 w-80 flex items-center gap-2">
              <FileIcon className="size-6 text-low" />

              <p className="text-high text-sm ">{notification.media.fileName}</p>

              <Link href={notification.media.src} target="_blank">
                <EyeIcon className="text-orange h-6 w-6" />
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
