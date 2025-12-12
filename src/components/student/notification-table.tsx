import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { EyeIcon } from "lucide-react";
import Link from "next/link";

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
              <TableHead>Status</TableHead>

              <TableHead>Date Received</TableHead>
              <TableHead>Date Read</TableHead>

              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="space-y-3">
            {notifications.map((notification) => (
              <TableRow className="text-sm text-high bg-offwhite h-12" key={notification.id}>
                <TableCell className="capitalize">{notification.notification.title}</TableCell>
                <TableCell className={`${notification.isRead ? "text-success" : "text-orange"}`}>
                  {notification.isRead ? "Read" : "Unread"}
                </TableCell>

                <TableCell>{format(new Date(notification.createdAt), "PP")}</TableCell>
                <TableCell>
                  {notification.readAt ? format(new Date(notification.readAt), "PP") : "---"}
                </TableCell>

                <TableCell className="text-center flex justify-center">
                  <Link href={`/notifications/${notification.notificationId}`}>
                    <EyeIcon className="text-orange h-6 w-6" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
