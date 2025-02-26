"use client";

import { useParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { OverviewCard } from "@/components/admin/overview-card";
import { UserPaymentsTable } from "@/components/admin/user-payments-table";

import { processStudentPaymentOverview, processUserPayments } from "@/utils/processor";
import { useStudentPaymentOverview, useStudentPayments } from "@/hooks/useAdmin";

export default function StudentManagementPaymentPage() {
  const { studentId } = useParams();

  const { data: paymentOverview, isLoading: paymentOverviewLoading } = useStudentPaymentOverview(
    studentId as string,
  );
  const { data: payments, isLoading: paymentsLoading } = useStudentPayments(studentId as string);

  const studentPaymentOverview = processStudentPaymentOverview(paymentOverview ?? []);
  const studentPayments = processUserPayments(payments?.records ?? []);

  return (
    <section className="flex flex-col gap-3">
      <div className="rounded-xl p-6 border border-shade-2 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-low font-medium text-xl">Payments Overview</h3>
        </div>

        <div className="plan-overview-cards">
          {paymentOverviewLoading ? (
            <Skeleton className="w-full rounded-xl h-24" />
          ) : (
            <div className="flex gap-6 h-24">
              {studentPaymentOverview.map((studentPaymentOverview, index) => (
                <OverviewCard overview={studentPaymentOverview} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-[516px]">
        {paymentsLoading ? (
          <Skeleton className="h-full rounded-xl" />
        ) : (
          <div className="rounded-xl p-6 border border-shade-2 bg-white h-full">
            <UserPaymentsTable payments={studentPayments} />
          </div>
        )}
      </div>
    </section>
  );
}
