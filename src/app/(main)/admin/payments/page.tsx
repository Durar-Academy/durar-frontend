"use client";

import { OverviewCard } from "@/components/admin/overview-card";
import { TopBar } from "@/components/shared/top-bar";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAccount";
import { usePayments, usePaymentsMetrics } from "@/hooks/useAdmin";
import { processPaymentsMetrics, processPaymentsPage } from "@/utils/processor";
import { PaymentsPageTable } from "@/components/admin/payments-page-table";

export default function PaymentsPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: paymentsMetrics, isLoading: paymentsMetricsLoading } = usePaymentsMetrics();
  const { data: _payments, isLoading: paymentsLoading } = usePayments();

  console.log(paymentsMetrics);

  const allPaymentsMetrics = processPaymentsMetrics();
  const payments = processPaymentsPage(_payments?.records ?? []);

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext="Manage Payments" user={user as User}>
            <p className="flex items-center gap-1">Payments</p>
          </TopBar>
        )}
      </div>

      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-xl">Payments Overview</h3>
        </div>

        <div className="payments-overview-cards">
          {paymentsMetricsLoading ? (
            <Skeleton className="w-full rounded-xl h-24" />
          ) : (
            <div className="flex gap-6 h-24">
              {allPaymentsMetrics.map((payments, index) => (
                <OverviewCard overview={payments} key={index} />
              ))}
            </div>
          )}
        </div>

        <div className="h-[500px]">
          {paymentsLoading ? (
            <Skeleton className="w-full h-full rounded-xl" />
          ) : (
            <PaymentsPageTable payments={payments} />
          )}
        </div>
      </div>
    </section>
  );
}
