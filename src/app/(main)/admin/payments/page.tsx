"use client";

import { useState } from "react";
import { OverviewCard } from "@/components/admin/overview-card";
import { TopBar } from "@/components/shared/top-bar";
import { Skeleton } from "@/components/ui/skeleton";

import { PaymentsPageTable } from "@/components/admin/payments-page-table";
import { useCurrentUser } from "@/hooks/useAccount";
import { usePaymentWebhookEvents, usePayments, usePaymentsMetrics } from "@/hooks/useAdmin";
import { processPaymentsMetrics, processPaymentsPage } from "@/utils/processor";
import { downloadTransactions } from "@/lib/admin";
import toast from "react-hot-toast";

const toQueryDate = (date?: Date, endOfDay = false) => {
  if (!date) return undefined;
  const value = new Date(date);
  if (endOfDay) value.setHours(23, 59, 59, 999);
  return value.toISOString();
};

export default function PaymentsPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const [status, setStatus] = useState<PaymentStatus>();
  const [startAt, setStartAt] = useState<Date>();
  const [endAt, setEndAt] = useState<Date>();
  const { data: paymentsMetrics, isLoading: paymentsMetricsLoading } = usePaymentsMetrics();
  const paymentFilters = {
    status,
    startAt: toQueryDate(startAt),
    endAt: toQueryDate(endAt, true),
  };
  const { data: payments, isLoading: paymentsLoading } = usePayments(paymentFilters);
  const { data: webhookEvents = [], isLoading: webhookEventsLoading } = usePaymentWebhookEvents();

  const paymentsMetricsSummaries = processPaymentsMetrics(paymentsMetrics);
  const paymentsRecords = processPaymentsPage(payments?.records ?? []);

  const handleExport = async () => {
    try {
      const blob = await downloadTransactions({ filters: paymentFilters });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "transactions.csv";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Unable to export transactions");
    }
  };

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
            <div className="flex flex-col gap-4">
              {paymentsMetricsSummaries.map((summary) => (
                <div key={summary.currency} className="flex flex-col gap-2">
                  {paymentsMetricsSummaries.length > 1 && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-low">
                      {summary.currency}
                    </p>
                  )}

                  <div className="flex gap-6 h-24">
                    {summary.cards.map((payments, index) => (
                      <OverviewCard overview={payments} key={`${summary.currency}-${index}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4">
        <div>
          <h3 className="text-high font-medium text-xl">Paystack webhook activity</h3>
          <p className="text-sm text-low">Recent webhook deliveries and processing status.</p>
        </div>
        {webhookEventsLoading ? <Skeleton className="w-full rounded-xl h-20" /> : webhookEvents.length === 0 ? <p className="text-sm text-low">No webhook events received.</p> : <div className="space-y-2">{webhookEvents.slice(0, 8).map((event: { id: string; eventType: string; status: string; reference?: string | null; receivedAt: string }) => <div key={event.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-offwhite px-4 py-3 text-sm"><span className="font-medium text-high">{event.eventType}</span><span className="text-low">{event.reference ?? 'No reference'}</span><span className={event.status === 'processed' ? 'text-success' : 'text-danger'}>{event.status}</span></div>)}</div>}
      </div>

      <div className="h-[600px]">
        {paymentsLoading ? (
          <Skeleton className="w-full h-full rounded-xl" />
        ) : (
          <PaymentsPageTable
            payments={paymentsRecords}
            status={status}
            startAt={startAt}
            endAt={endAt}
            onStatusChange={setStatus}
            onStartAtChange={setStartAt}
            onEndAtChange={setEndAt}
            onExport={handleExport}
          />
        )}
      </div>
    </section>
  );
}
