"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function AdminPage() {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {isLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={`Welcome Back, ${user?.firstName}`} user={user as User}>
            Dashboard
          </TopBar>
        )}
      </div>

      <div></div>
    </section>
  );
}
