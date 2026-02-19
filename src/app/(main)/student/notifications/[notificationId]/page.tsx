"use client";

import { TopBar } from "@/components/shared/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAccount";
import { markAsRead } from "@/lib/student";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, CheckIcon, ChevronRight, EyeIcon, FileIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const notification = {
  id: "cmce0j0ep0006v68wapwou4j9",
  notificationId: "cmce0j0d70002v68w2lkjz55v",
  userId: "cma69yynv0000v6lkqeo1nded",
  isRead: false,
  readAt: null,
  deletedAt: null,
  createdAt: "2025-06-26T23:26:51.601Z",
  updatedAt: "2025-06-26T23:26:51.601Z",
  notification: {
    id: "cmce0j0d70002v68w2lkjz55v",
    title: "the inevitable",
    content: "this is to notify all users",
    mediaId: "cm9msmidf0004v6ukm1zkv0y8",
    recipientType: "users",
    createdById: "cm9ef7z420000v6y0v36rz8c8",
    deletedAt: null,
    createdAt: "2025-06-26T23:26:51.546Z",
    updatedAt: "2025-06-26T23:26:51.546Z",
    media: {
      id: "cm9msmidf0004v6ukm1zkv0y8",
      fileType: "image",
      fileName: "1b278070-d5a5-4b59-8dd5-11aa9f5797be.JPG",
      storageId: "wkxqycuexuss4p9il212",
      src: "https://res.cloudinary.com/dotwljrqk/image/upload/v1744980986/image/wkxqycuexuss4p9il212.jpg",
      width: 1920,
      height: 2560,
      alt: null,
      size: 493481,
      deletedAt: null,
      updatedAt: "2025-04-18T13:53:02.568Z",
      createdAt: "2025-04-18T12:56:26.499Z",
      tutorId: "cm9mtmjjc0001v6f87ncdk1yg",
    },
    createdBy: {
      id: "cm9ef7z420000v6y0v36rz8c8",
      firstName: null,
      lastName: null,
      email: "adexsquare4192@gmail.com",
    },
  },
};

export default function SingleNotificationPage() {
  const { notificationId } = useParams();
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const [isMarking, setIsMarking] = useState(false);

  // console.log(notificationId);

  // const { data: notification, isLoading: notificationLoading } = useNotification(
  //   notificationId as string,
  // );
  // console.log(notification, "notification");

  const onSubmit = async () => {
    try {
      setIsMarking(true);

      const response = await markAsRead(notificationId as string);
      console.log("Mark as Read", response.data);

      toast.success(response?.message || "Marked as Read!");
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
          <TopBar subtext={notification.notification.title ?? "Notication"} user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={`/notifications`} className="hover:underline">
                Notifications
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span>Details</span>
            </p>
          </TopBar>
        )}
      </div>
      <div className="bg-white p-4 rounded-xl border border-shade-2  flex justify-between items-center">
        <p className="flex items-center gap-1 text-low">
          <CalendarIcon className="size-5 text-shade-3" />
          Recieved on {format(new Date(notification.createdAt), "PPpp")}
        </p>

        <button
          className="text-sm text-white bg-orange hover:bg-burnt  px-3 py-2 text-center w-fit font-medium rounded-xl flex gap-1"
          disabled={isMarking}
          onClick={onSubmit}
        >
          <CheckIcon className="size-5" />
          Mark as Read
        </button>
      </div>
      <div className="bg-white p-4 rounded-xl border border-shade-2 ">
        <h1 className="mb-4 font-medium text-base">Notification Content</h1>

        <div className="text-high text-sm whitespace-pre-wrap break-words">
          {notification.notification.content}
        </div>
      </div>

      <div className="bg-white py-2 px-3 rounded-xl border border-shade-2 w-80 flex items-center gap-2">
        <FileIcon className="size-6 text-low" />

        <p className="text-high text-sm ">{notification.notification.media.fileName}</p>

        <Link href={notification.notification.media.src} target="_blank">
          <EyeIcon className="text-orange h-6 w-6" />
        </Link>
      </div>
    </section>
  );
}
