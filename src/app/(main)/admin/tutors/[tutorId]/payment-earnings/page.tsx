"use client";

import { useParams } from "next/navigation";
import { Search } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { OverviewCard } from "@/components/admin/overview-card";
import { UserPaymentsTable } from "@/components/admin/user-payments-table";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { processTutorPaymentOverview, processUserPayments } from "@/utils/processor";
import { useTutorPaymentOverview, useTutorPayments } from "@/hooks/useAdmin";

import { PAYMENT_STATUSES } from "@/data/constants";

export default function TutorManagementPaymentPage() {
  const { tutorId } = useParams();

  const { data: paymentOverview, isLoading: paymentOverviewLoading } = useTutorPaymentOverview(
    tutorId as string,
  );
  const { data: payments, isLoading: paymentsLoading } = useTutorPayments(tutorId as string);

  const tutorPaymentOverview = processTutorPaymentOverview(paymentOverview ?? []);
  const tutorPayments = processUserPayments(payments?.records ?? []);

  return (
    <section className="flex flex-col gap-3">
      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-xl">Earnings Overview</h3>
        </div>

        <div className="plan-overview-cards">
          {paymentOverviewLoading ? (
            <Skeleton className="w-full rounded-xl h-24" />
          ) : (
            <div className="flex gap-6 h-24">
              {tutorPaymentOverview.map((tutorPaymentOverview, index) => (
                <OverviewCard overview={tutorPaymentOverview} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl p-6 border border-shade-2 bg-white">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-low font-medium text-base leading-5">Payment History</h3>

          <div className="flex gap-3 items-center">
            <div className="relative w-[200px]">
              <Input
                className="w-full text-sm h-10 px-4 pr-10 rounded-lg border border-shade-3 bg-white shadow-none placeholder:text-low


            focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
                placeholder="Search..."
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-low" />
            </div>

            <Select>
              <SelectTrigger className="w-fit h-10 text-high bg-white border border-shade-3 rounded-lg text-base px-4 py-3 focus:ring-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                {PAYMENT_STATUSES.map((paymentStatus, index) => (
                  <SelectItem
                    value={paymentStatus.status}
                    key={paymentStatus.status + index}
                    className="capitalize"
                  >
                    {paymentStatus.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <DatePicker />
            </div>
          </div>
        </div>

        <div className="h-[406px]">
          {paymentsLoading ? (
            <Skeleton className="h-full rounded-xl" />
          ) : (
            <UserPaymentsTable payments={tutorPayments} />
          )}
        </div>
      </div>
    </section>
  );
}
