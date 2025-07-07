"use client";

import { EditNotificationDialog } from "@/components/admin/edit-notification-dialog";
import { getRecipientLabel } from "@/components/admin/notifications-table";
import { TopBar } from "@/components/shared/top-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAccount";

import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronRight,
  Edit,
  EyeIcon,
  FileIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
// import { useParams } from "next/navigation";

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
  // const { notificationId } = useParams();
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const [editOpen, setEditOpen] = useState(false);

  // console.log(notificationId);

  // const { data: notification, isLoading: notificationLoading } = useNotification(
  //   notificationId as string,
  // );
  // console.log(notification, "notification");

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
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-1 text-low">
            <CalendarIcon className="size-5 text-shade-3" />
            Sent on {format(new Date(notification.createdAt), "PPpp")}
          </p>
          <p className="flex items-center gap-1 text-low">
            <UserIcon className="size-5 text-shade-3" />
            Sent to {getRecipientLabel(notification.notification.recipientType)}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={"_outline"}
            className="text-danger bg-white rounded-xl py-2 px-4 h-10 hover:bg-offwhite"
          >
            <Trash2Icon className="w-5 h-5 text-inherit" />
            <span>Delete</span>
          </Button>

          <Button
            variant={"_outline"}
            className="text-orange bg-white rounded-xl py-2 px-4 h-10 hover:bg-offwhite"
            onClick={() => setEditOpen(true)}
          >
            <Edit className="w-5 h-5 text-inherit" />
            <span>Edit</span>
          </Button>
        </div>
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

      <EditNotificationDialog
        open={editOpen}
        notification={notification.notification}
        onOpenChange={() => setEditOpen(false)}
      />
    </section>
  );
}
