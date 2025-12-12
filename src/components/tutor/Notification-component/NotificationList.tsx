"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface notification {
  id: string;
  title: string;
  content: string;
  date: string;
  status: "Read" | "Unread";
  sender: string;
  mediaUrl?: string | null;
}

interface notificationTableProps {
  notifications: notification[];
}

export default function NotificaitionList({
  notifications,
}: notificationTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Read" | "Unread">(
    "All"
  );

  const filterednotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title?.toLowerCase().includes(search.toLowerCase()) ||
      notification.content?.toLowerCase().includes(search.toLowerCase()) ||
      notification.date?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || notification.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center w-full gap-3">
        <h2 className="text-xl">Notification Lists</h2>
        <span className="flex-1"></span>
        <div className="h-11 rounded-lg border-[#D2D4E0] border-[1px] flex items-center justify-center p-3">
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm  border-none outline-none text-sm"
          />

          <Image
            src="/SVGs/searchIcon.svg"
            alt="search Icon"
            width={16}
            height={16}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-11" variant="outline">
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("All")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Read")}>
              Read
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Unread")}>
              Unread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-x-auto">
        <table className="text-sm min-w-full bg-white border-none border-separate border-spacing-y-3">
          <thead>
            <tr className="text-low text-sm text-left">
              <th className="py-3 px-4 font-semibold">Title</th>
              <th className="py-3 px-4 font-semibold">Content</th>
              <th className="py-3 px-4 font-semibold">Sender</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filterednotifications.map((notification) => (
              <tr
                key={notification.id}
                className="border-[1px] bg-[#F8F8FA] border-[#D2D4E0] mt-3"
              >
                <td className="text-sm py-4 pl-3 border-[1px] border-[#D2D4E0] rounded-l-xl border-r-0">
                  {notification.title}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0] max-w-xs truncate">
                  {notification.content}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {notification.sender}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {notification.date}
                </td>
                <td className="text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl">
                  <span
                    className={
                      notification.status === "Read"
                        ? "text-light-green"
                        : "text-orange"
                    }
                  >
                    {notification.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
