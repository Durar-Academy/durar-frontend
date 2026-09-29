"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";

import { TopBar } from "@/components/shared/top-bar";
import { PaymentsTable } from "@/components/student/payment-table";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAccount";
import { processPayments } from "@/utils/processor";

// import { mockPayments } from "@/data/mockData";
import { usePayments } from "@/hooks/useStudent";
import type { PaymentHistoryFilters } from "@/lib/student";

export default function PaymentsPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const [status, setStatus] = useState<PaymentStatus>();
  const [date, setDate] = useState<Date>();
  const [page, setPage] = useState(1);
  const filters = useMemo<PaymentHistoryFilters>(() => ({
    ...(status ? { status } : {}),
    ...(date ? { startAt: format(date, "yyyy-MM-dd"), endAt: format(date, "yyyy-MM-dd") } : {}),
    page,
    limit: 10,
  }), [date, page, status]);
  const { data: paymentsData, isLoading: paymentsLoading } = usePayments(filters);

  // React Query has no data on the initial render (including static prerendering).
  // Keep the processor and the table working with a predictable array shape.
  const allPayments = processPayments(paymentsData?.records ?? []);
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

      <div className="w-full min-w-0">
        {paymentsLoading ? (
          <Skeleton className="w-full rounded-xl h-40" />
        ) : (
          <PaymentsTable
            payments={allPayments}
            filters={filters}
            metaData={paymentsData?.metaData}
            onStatusChange={(nextStatus) => {
              setStatus(nextStatus);
              setPage(1);
            }}
            onDateChange={(nextDate) => {
              setDate(nextDate);
              setPage(1);
            }}
            onPageChange={setPage}
          />
        )}
      </div>
    </section>
  );
}
