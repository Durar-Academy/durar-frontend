"use client";
import QuranTimetable from "@/components/tutor/QuranTimeTable";
import { Top_Bar } from "@/components/tutor/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAccount";

const Page = () => {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  return (
    <section className="flex flex-col gap-3">
      {currentUserLoading ? (
        <Skeleton className="w-full rounded-xl h-[80px]" />
      ) : (
        <Top_Bar subtext="Timetable" user={user as User}>
          <p className="flex items-center gap-1">Timetable</p>
        </Top_Bar>
      )}
      <section className=" bg-white p-6 border-[1px] border-[#E7E8EE] rounded-xl">
        <QuranTimetable />
      </section>
    </section>
  );
};

export default Page;
