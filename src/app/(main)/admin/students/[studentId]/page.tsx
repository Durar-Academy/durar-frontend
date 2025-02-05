"use client";

import Link from "next/link";
// import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";

import { useCurrentUser } from "@/hooks/useAccount";

export default function StudentManagementPage() {
  // const params = useParams<{ studentId: string }>();
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

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

      <div></div>
    </section>
  );
}
