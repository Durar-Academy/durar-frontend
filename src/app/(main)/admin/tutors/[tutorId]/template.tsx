"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";

import { useCurrentUser } from "@/hooks/useAccount";
import { cn } from "@/lib/utils";
import { processTutorManagementLinks } from "@/utils/processor";

export default function TutorManagementTemplate({ children }: { children: React.ReactNode }) {
  const { tutorId } = useParams<{ tutorId: string }>();
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const pathname = usePathname();

  const tutorProfileLinks = processTutorManagementLinks(tutorId);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext="View & manage all tutors" user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={"/admin"} className="hover:underline">
                Users
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={"/admin/tutors"} className="hover:underline">
                Tutors
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span>Profile</span>
            </p>
          </TopBar>
        )}
      </div>

      <div className="flex gap-3 h-[720px]">
        <div className="rounded-xl p-6 bg-white border border-shade-2 h-full flex flex-col gap-4 w-full max-w-[280px] text-sm shrink-0">
          {tutorProfileLinks.map((tutorProfileLink, index) => (
            <Link
              key={index}
              href={tutorProfileLink.url}
              className={cn(
                "flex items-center gap-2 text-low hover:underline",

                pathname === tutorProfileLink.url && "text-orange",
              )}
            >
              {React.createElement(tutorProfileLink.icon, { key: "icon", className: "w-4 h-4" })}

              <span>{tutorProfileLink.label}</span>
            </Link>
          ))}
        </div>

        <div className="w-full">{children}</div>
      </div>
    </section>
  );
}
