"use client";
import AddBtn from "@/components/tutor/AddBtn";
import AssignmentTable from "@/components/tutor/Assignment-component/AssignmentListTable";
import AssignmentOverview from "@/components/tutor/Assignment-component/AssignmentOverview";
import { Top_Bar } from "@/components/tutor/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { AssignmentStatData } from "@/data2/constants";
import { useCurrentUser } from "@/hooks/useAccount";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const [page, setPage] = useState(1);

  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  return (
    <section className="flex flex-col gap-3">
      {currentUserLoading ? (
        <Skeleton className="w-full rounded-xl h-[80px]" />
      ) : (
        <Top_Bar subtext="Manage Assignments" user={user as User}>
          <p className="flex items-center gap-1">Assignments</p>
        </Top_Bar>
      )}
      <section className="stats">
        <AssignmentOverview
          title="Assignment Overview"
          data={AssignmentStatData}
          overview={false}
        >
          <div className="flex gap-3 items-center">
            <input
              type="date"
              className="h-11 border rounded-full px-3 text-sm"
            />
            <Link href="/tutor/assignments/add-assignment">
              <AddBtn showChevron={true} txt="Add new Assignment" />
            </Link>
          </div>
        </AssignmentOverview>
      </section>

      <section className="bg-white p-6 border-[1px] border-[#E7E8EE] rounded-xl">
        <AssignmentTable page={page} setPage={setPage} />
      </section>
    </section>
  );
};

export default Page;
