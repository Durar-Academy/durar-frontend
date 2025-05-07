"use client";
import StudentTable from "@/components/tutor/StudentTable";
import { Top_Bar } from "@/components/tutor/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAccount";
import { useState } from "react";

const Page = () => {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const [page, setPage] = useState(1);

  return (
    <section className="flex flex-col gap-3">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <Top_Bar subtext="Manage students" user={user as User}>
            <p className="flex items-center gap-1">Students</p>
          </Top_Bar>
        )}
      </div>
      <section className="StudentLists p-6 rounded-xl bg-white border-[1px] border-[#E7E8EE]">
        <StudentTable page={page} setPage={setPage} />
      </section>
    </section>
  );
};

export default Page;