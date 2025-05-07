"use client";
import RecentClassesTable from "@/components/tutor/RecentClassesTable";
import { Top_Bar } from "@/components/tutor/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAccount";
import { useState } from "react";
import DashboardTable from "@/components/tutor/DashboardTable";

const Page = () => {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const [page, setPage] = useState(1);

  return (
    <section className="flex flex-col gap-3">
      {currentUserLoading ? (
        <Skeleton className="w-full rounded-xl h-[80px]" />
      ) : (
        <Top_Bar subtext="Manage classes" user={user as User}>
          <p className="flex items-center gap-1">Classes</p>
        </Top_Bar>
      )}
      <section className="bg-white p-6 border-[1px] border-[#E7E8EE] rounded-xl">
        <DashboardTable />
      </section>
      <section className="bg-white p-6 border-[1px] border-[#E7E8EE] rounded-xl">
        <RecentClassesTable page={page} setPage={setPage} />
      </section>
    </section>
  );
};

export default Page;
