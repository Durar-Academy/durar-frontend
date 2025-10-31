"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Top_Bar({ children, subtext, user }: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user || pathname === "/onboarding") return;

    const firstName = typeof user.firstName === "string" ? user.firstName.trim() : "";
    const lastName = typeof user.lastName === "string" ? user.lastName.trim() : "";

    if (firstName.length === 0 || lastName.length === 0) {
      router.push("/onboarding");
    }
  }, [user, router, pathname]);

  if (!user) {
    return null;
  }

  const userFullName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : "Unknown";

  const userInitials =
    user.firstName && user.lastName
      ? `${user?.firstName[0].toUpperCase()} ${user?.lastName[0].toUpperCase()}`
      : "TU";
      
  return (
    <div className="bg-white border border-shade-2 py-5 px-6 rounded-xl flex justify-between items-center w-full">
      <div>
        <div className="text-low text-sm font-normal">{children}</div>
        <div className="text-high font-semibold text-lg leading-6 mt-3">
          {subtext}
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <div className="flex gap-2 items-center">
          <Link href="/tutor/notification">
            <Image
              src="/SVGs/bell.svg"
              alt="Notification Icon"
              width={36}
              height={36}
            />
          </Link>
          <Image
            src="/SVGs/mail-icon.svg"
            alt="Mail Icon"
            width={36}
            height={36}
          />
        </div>
        <div>
          <div className="flex justify-center items-center gap-2">
            <Avatar className="h-9 w-9">
              {user?.profilePictureId && (
                <AvatarImage src={user.profilePictureId as string} />
              )}
              <AvatarFallback className="bg-shade-3 text-black">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h1 className="text-sm text-high font-semibold">
                {userFullName}
              </h1>
              <Link
                href="/admin/settings/profile"
                className="hover:underline text-low text-xs font-normal"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
