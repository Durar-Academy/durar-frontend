"use client";

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

import Image from "next/image";

import { TopBar } from "@/components/shared/top-bar";
import { PaymentsTable } from "@/components/student/payment-table";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAccount";
import { processPayments } from "@/utils/processor";

// import { mockPayments } from "@/data/mockData";
import { usePayments } from "@/hooks/useStudent";

export default function PaymentsPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  const allPayments = processPayments(payments);
  const pendingPayments = allPayments.filter((payment) => payment.status === "pending");

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar
            subtext={
              pendingPayments.length > 0
                ? `${pendingPayments.length} pending payment(s)`
                : "Track all your payments"
            }
            user={user as User}
          >
            Payments
          </TopBar>
        )}
      </div>

      <div className="flex gap-3 overflow-x-scroll hide-scrollbar w-full">
        {paymentsLoading ? (
          <Skeleton className="w-full rounded-xl h-40" />
        ) : allPayments && allPayments.length > 0 ? (
          <PaymentsTable payments={allPayments} />
        ) : (
          <section className="bg-white rounded-xl border border-shade-2 flex items-center justify-center py-14 w-full">
            <div className="flex flex-col items-center">
              <Image
                src="/empty-slate.svg"
                width={250}
                height={200}
                alt="Empty Icon"
                className="object-cover object-center scale-90"
              />

              <h3 className="text-center max-w-52 text-high text-lg font-semibold">
                You have not made any payment yet
              </h3>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
