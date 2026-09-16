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
  user?: User;
}) {
  const { initials, fullName } = formatUserName(user);
  const profilePictureSrc = user?.profilePicture?.src ?? user?.profilePictureId ?? undefined;
  const isStudent = user?.role === "student";

  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-shade-2 bg-white px-4 py-4 sm:px-6 sm:py-5">
      <div>
        <div className="text-low text-sm font-normal">{children}</div>

        <div className="text-high font-semibold text-lg leading-6 mt-3">{subtext}</div>
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {!isStudent && (
          <Link
            href="/admin/notification"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-orange hover:bg-burnt transition-colors"
          >
            <Bell className="h-5 w-5 text-white" />
          </Link>
        )}

        <Avatar className="h-9 w-9">
          {profilePictureSrc && <AvatarImage src={profilePictureSrc} />}
          <AvatarFallback className="bg-shade-3 text-black">{initials}</AvatarFallback>
        </Avatar>

        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-semibold text-high">{fullName}</p>

          <Link
            href={isStudent ? "/student/settings" : "/admin/settings"}
            className="hover:underline text-low text-xs font-normal"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
