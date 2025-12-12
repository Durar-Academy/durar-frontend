"use client";
import PaymentTable from "@/components/tutor/PaymentTable";
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
        <Top_Bar subtext="View all payments made" user={user as User}>
          <p className="flex items-center gap-1">Payment</p>
        </Top_Bar>
      )}
      <PaymentTable />
    </section>
  );
};

export default Page;
