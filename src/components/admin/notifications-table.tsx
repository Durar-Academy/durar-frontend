import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { recipientTypeMap } from "@/data/constants";
import { format } from "date-fns";
import { EyeIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

export const getRecipientLabel = (type: string): string => {
  return recipientTypeMap[type as RecipientType] ?? "Unknown";
};

export function NotificationsTable({ notifications }: { notifications: UserNotification[] }) {
  return (
    <div className="p-6 dashboard-shadow rounded-xl bg-white h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base text-high font-semibold">Notification List</h3>
      </div>

      <div className="h-screen overflow-y-scroll hide-scrollbar">
        <Table>
          <TableHeader>
            <TableRow className="text-low text-sm font-semibold">
              <TableHead>Title</TableHead>
              <TableHead>Recipient</TableHead>

              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>

              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="space-y-3">
            {notifications.map((notification) => (
              <TableRow className="text-sm text-high bg-offwhite h-12" key={notification.id}>
                <TableCell className="capitalize">{notification.notification.title}</TableCell>
                <TableCell className="capitalize">
                  {getRecipientLabel(notification.notification.recipientType)}
                </TableCell>

                <TableCell>{format(new Date(notification.createdAt), "PP")}</TableCell>

                {/* the status is not being sent yet from BE */}
                <TableCell className={`${notification.isRead ? "text-success" : "text-orange"}`}>
                  {notification.isRead ? "Sent" : "Failed"}
                </TableCell>

                <TableCell className="text-center flex justify-center">
                  <Link href={`/notifications/${notification.notificationId}`}>
                    <EyeIcon className="text-orange h-6 w-6" />
                  </Link>

                  <button>
                    <Trash2Icon className="text-danger h-6 w-6" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
