"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { usePayment } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { formatAmount, formatToReadableId } from "@/utils/formatter";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentDetails() {
  const { paymentId } = useParams();
  const router = useRouter();

  const { data: payment, isLoading: paymentLoading } = usePayment(paymentId as string);

  console.log(paymentId, payment);

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>Payment Details</DialogDescription>
        </DialogHeader>

        {paymentLoading ? (
          <div className="flex flex-col gap-1">
            <Skeleton className="h-[100px] w-full rounded-xl" />

            <Skeleton className="h-20 w-full rounded-xl" />

            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ) : payment ? (
          <>
            <div className="grid grid-cols-2 justify-between">
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-sm font-normal text-low">Payment ID</p>
                  <h3 className="text-base font-medium text-high capitalize">
                    {formatToReadableId(payment.id, "INV")}
                  </h3>
                </div>

                <div>
                  <p className="text-sm font-normal text-low">Student Name</p>
                  <h3 className="text-base font-medium text-high capitalize">
                    {payment.charge.user.firstName} {payment.charge.user.lastName}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-sm font-normal text-low">Amount</p>
                  <h3 className="text-base font-medium text-high">
                    {formatAmount(payment.amount, payment.currency)}
                  </h3>
                </div>

                <div>
                  <p className="text-sm font-normal text-low">Status</p>
                  <h3
                    className={cn(
                      "capitalize font-medium text-high",
                      payment.status === "completed" && "text-success",
                      payment.status === "pending" && "text-orange",
                      payment.status === "failed" && "text-danger",
                    )}
                  >
                    {payment.status}
                  </h3>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-medium text-high">Billing Information</h3>

              <div className="mt-4 grid grid-cols-2 justify-between">
                <div>
                  <p className="text-sm font-normal text-low">Billing Name</p>
                  <h3 className="text-base font-medium text-high capitalize">
                    {payment.charge.user.firstName} {payment.charge.user.lastName}
                  </h3>
                </div>

                <div>
                  <p className="text-sm font-normal text-low">Payment Method</p>
                  <h3 className="text-base font-medium text-high capitalize">{payment.provider}</h3>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm mt-4 text-low">No Payments found</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
