"use client";

import { useParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { OverviewCard } from "@/components/admin/overview-card";

import { processStudentPaymentOverview } from "@/utils/processor";
import { useStudentPaymentOverview } from "@/hooks/useAdmin";

export default function StudentManagementPaymentPage() {
  const { studentId } = useParams();

  const { data: paymentOverview, isLoading: paymentOverviewLoading } = useStudentPaymentOverview(
    studentId as string
  );

  const studentPaymentOverview = processStudentPaymentOverview(paymentOverview ?? []);

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
    </section>
  );
}
