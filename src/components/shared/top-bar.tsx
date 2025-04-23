import Link from "next/link";
import { Bell } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { formatUserName } from "@/utils/formatter";

export function TopBar({
  children,
  subtext,
  user,
}: {
  children: React.ReactNode;
  subtext: string;
  user: User;
}) {
  const { initials, fullName } = formatUserName(user);

  return (
    <div className="bg-white border border-shade-2 py-5 px-6 rounded-xl flex justify-between items-center w-full">
      <div>
        <div className="text-low text-sm font-normal">{children}</div>

        <div className="text-high font-semibold text-lg leading-6 mt-3">{subtext}</div>
      </div>

      <div className="flex items-center gap-3">
        {user.role !== "student" && (
          <Link
            href="/admin/notification"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-orange hover:bg-burnt transition-colors"
          >
            <Bell className="h-5 w-5 text-white" />
          </Link>
        )}

        <Avatar className="h-9 w-9">
          {user?.profilePictureId && <AvatarImage src={user.profilePictureId as string} />}
          <AvatarFallback className="bg-shade-3 text-black">{initials}</AvatarFallback>
        </Avatar>

        <div className="">
          <p className="text-sm text-high font-semibold">{fullName}</p>

          <Link
            href={user.role === "student" ? "/settings" : "/admin/settings"}
            className="hover:underline text-low text-xs font-normal"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
