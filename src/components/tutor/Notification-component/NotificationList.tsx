"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { closestIndexTo } from "date-fns";
import { EyeIcon } from "lucide-react";

interface notification {
  title: string;
  allStudents: string;
  date: string;
  status: "Sent" | "Failed";
}

interface notificationTableProps {
  notifications: notification[];
}

export default function NotificaitionList({
  notifications,
}: notificationTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Sent" | "Failed">(
    "All"
  );

  const filterednotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(search.toLowerCase()) ||
      notification.date.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || notification.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ["Title", "All Students", "Date", "Status"];
    const rows = filterednotifications.map((notification) => [
      notification.title,
      notification.allStudents,
      notification.date,
      notification.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "notification_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <DropdownMenuItem onClick={() => setStatusFilter("Sent")}>
              Sent
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Failed")}>
              Missed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          onClick={exportToCSV}
          className="flex gap-3 text-sm text-orange border-[1px] border-orange p-3 rounded-lg justify-center items-center"
        >
          Export Report
          <Image
            src={"/SVGs/exportImg.svg"}
            alt="export icon"
            width={16}
            height={16}
          />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="text-sm min-w-full bg-white border-none border-separate border-spacing-y-3">
          <thead>
            <tr className="text-low text-sm text-left">
              <th className="py-3 px-4 font-semibold">Title</th>
              <th className="py-3 px-4 font-semibold">All Students</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filterednotifications.map((notification, index) => (
              <tr
                key={index}
                className="border-[1px] bg-[#F8F8FA] border-[#D2D4E0] mt-3"
              >
                <td className="text-sm py-4 pl-3 border-[1px] border-[#D2D4E0] rounded-l-xl border-r-0">
                  {notification.title}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {notification.allStudents}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  {notification.date}
                </td>
                <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                  <span
                    className={
                      notification.status === "Sent"
                        ? "text-light-green"
                        : "text-red-500"
                    }
                  >
                    {notification.status}
                  </span>
                </td>

                <td className="flex items-center text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl text-orange cursor-pointer hover:underline">
                  <Link href="/tutor/notification/notification-details">
                    <EyeIcon />
                  </Link>
                  <Image
                    className="ml-2"
                    src={"/SVGs/delete.svg"}
                    alt="Eye Icon"
                    height={24}
                    width={24}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
