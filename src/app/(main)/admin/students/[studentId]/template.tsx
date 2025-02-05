"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";

import { useCurrentUser } from "@/hooks/useAccount";
import { cn } from "@/lib/utils";
import { processStudentManagementLinks } from "@/utils/processor";

export default function StudentManagementTemplate({ children }: { children: React.ReactNode }) {
  const { studentId } = useParams<{ studentId: string }>();
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const pathname = usePathname();

  const studentProfileLinks = processStudentManagementLinks(studentId);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext="View & manage all students" user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={"/admin"} className="hover:underline">
                Users
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={"/admin/students"} className="hover:underline">
                Students
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span>Profile</span>
            </p>
          </TopBar>
        )}
      </div>

      <div className="flex gap-3 h-[720px]">
        <div className="rounded-xl p-6 bg-white border border-shade-2 h-full flex flex-col gap-4 w-full max-w-[280px] text-sm">
          {studentProfileLinks.map((studentProfileLink, index) => (
            <Link
              key={index}
              href={studentProfileLink.url}
              className={cn(
                "flex items-center gap-2 text-low hover:underline",

                pathname === studentProfileLink.url && "text-orange"
              )}
            >
              {React.createElement(studentProfileLink.icon, { key: "icon", className: "w-4 h-4" })}

              <span>{studentProfileLink.label}</span>
            </Link>
          ))}
        </div>

        <div className="w-full">{children}</div>
      </div>
    </section>
  );
}
