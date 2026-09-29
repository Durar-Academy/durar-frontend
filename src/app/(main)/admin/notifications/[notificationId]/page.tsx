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
import { useNotification, useDeleteNotification } from "@/hooks/useAdmin";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SingleNotificationPage() {
  const { notificationId } = useParams();
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const { data: notification, isLoading: notificationLoading } = useNotification(
    notificationId as string,
  );

  const deleteNotificationMutation = useDeleteNotification();

  const handleDelete = () => {
    if (!notification) return;
    deleteNotificationMutation.mutate(notification.id, {
      onSuccess: () => {
        toast.success("Notification deleted successfully");
        router.push("/admin/notifications");
      },
      onError: (error) => {
        console.error("Failed to delete notification:", error);
        toast.error("Failed to delete notification");
      },
    });
  };

  const isDeleting = deleteNotificationMutation.isPending;

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading || notificationLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={notification?.title ?? "Notification"} user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={`/admin/notifications`} className="hover:underline">
                Notifications
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span>Details</span>
            </p>
          </TopBar>
        )}
      </div>

      {notificationLoading ? (
        <Skeleton className="w-full rounded-xl h-40" />
      ) : notification ? (
        <>
          <div className="bg-white p-4 rounded-xl border border-shade-2  flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-1 text-low">
                <CalendarIcon className="size-5 text-shade-3" />
                Sent on {format(new Date(notification.createdAt), "PPpp")}
              </p>
              <p className="flex items-center gap-1 text-low">
                <UserIcon className="size-5 text-shade-3" />
                Sent to {getRecipientLabel(notification.recipientType as RecipientType)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={"_outline"}
                className="text-danger bg-white rounded-xl py-2 px-4 h-10 hover:bg-offwhite"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2Icon className="w-5 h-5 text-inherit" />
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
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
              {notification.content}
            </div>
          </div>

          {notification.media && (
            <div className="bg-white py-2 px-3 rounded-xl border border-shade-2 w-80 flex items-center gap-2">
              <FileIcon className="size-6 text-low" />

              <p className="text-high text-sm truncate max-w-[200px]">
                {notification.media.fileName ?? "Attachment"}
              </p>

              <Link href={notification.media.url ?? notification.media.src ?? "#"} target="_blank">
                <EyeIcon className="text-orange h-6 w-6 shrink-0" />
              </Link>
            </div>
          )}

          <EditNotificationDialog
            open={editOpen}
            notification={notification}
            onOpenChange={() => setEditOpen(false)}
          />
        </>
      ) : (
        <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-shade-2">
          <p className="text-low text-sm">Notification not found</p>
        </div>
      )}
    </section>
  );
}
