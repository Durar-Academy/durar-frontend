import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PAYMENT_STATUSES } from "@/data/constants";
import { cn } from "@/lib/utils";
import { formatAmount, formatToReadableId } from "@/utils/formatter";
import { Download, RefreshCw, Wallet } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { AddNewCard } from "./add-new-card";
import { StudentPaymentMethods } from "./student-payment-methods";
import { useDownloadStudentTransactions, usePaymentMethods } from "@/hooks/useStudent";
import { initializeSubscriptionPayment } from "@/lib/subscription";
import type { PaymentHistoryFilters, PaymentHistoryResponse } from "@/lib/student";

export function PaymentsTable({
  payments,
  filters,
  metaData,
  onStatusChange,
  onDateChange,
  onPageChange,
}: {
  payments: PaymentsTableProps;
  filters: PaymentHistoryFilters;
  metaData?: PaymentHistoryResponse["metaData"];
  onStatusChange: (status?: PaymentStatus) => void;
  onDateChange: (date?: Date) => void;
  onPageChange: (page: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddNew, setIsAddNew] = useState(false);

  const { data: methods } = usePaymentMethods();
  const downloadTransactions = useDownloadStudentTransactions();
  const retryKeysRef = useRef<Record<string, string>>({});

  const handleRetry = async (payment: PaymentsTableProps[number]) => {
    if (!payment.billingPlanId) return;

    // A stable key per payment keeps repeat retries from creating new charges.
    retryKeysRef.current[payment.id] ??=
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

    const idempotencyKey = retryKeysRef.current[payment.id];

    try {
      const response = await initializeSubscriptionPayment({ billingPlanId: payment.billingPlanId, idempotencyKey });

      const paymentLink = response?.authorization_url ?? response?.payment_link;

      if (!paymentLink) throw new Error("Payment checkout could not be started");

      window.location.assign(paymentLink);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to start payment");
    }
  };

  const handleDownload = async () => {
    try {
      const csvBlob = await downloadTransactions.mutateAsync({ filters });
      const blobUrl = URL.createObjectURL(csvBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "payment-history.csv";
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.alert("Unable to download your payment history. Please try again.");
    }
  };

  const cardsFromBackend =
    methods && methods.length > 0
      ? methods.map((method) => ({
          id: method.id,
          last4: method.last4,
          cardType: method.cardType.trim(),
          preferred: method.preferred,
        }))
      : [];

  return (
    <div className="p-6 dashboard-shadow rounded-xl bg-white h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base text-high font-semibold">Payment History</h3>

        <div className="flex gap-3">
        <Select value={filters.status ?? "all"} onValueChange={(value) => onStatusChange(value === "all" ? undefined : value as PaymentStatus)}>
          <SelectTrigger className="w-fit h-10 text-high bg-white border border-shade-3 rounded-lg text-base px-4 py-3 focus:ring-0">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
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
            <DatePicker
              date={filters.startAt ? new Date(filters.startAt) : undefined}
              onChange={onDateChange}
            />
          </div>
        </div>
      </div>

      <div className="max-h-[calc(100dvh-16rem)] overflow-auto hide-scrollbar">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="text-low text-sm font-semibold">
              <TableHead>Invoice ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-center">Date Issued - Due Date </TableHead>
              <TableHead className="text-center">Payment Method</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="space-y-3">
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-low">
                  No payments match the selected filters.
                </TableCell>
              </TableRow>
            ) : payments.map((payment) => (
              <TableRow
                className="text-sm text-high bg-offwhite h-12"
                key={payment.id + payment.status}
              >
                <TableCell className="capitalize">
                  {formatToReadableId(payment.id, "INV")}
                </TableCell>
                <TableCell>{formatAmount(payment.amount, payment.currency)}</TableCell>
                <TableCell className="text-center">
                  {payment.dateIssued} - {payment.dueDate}
                </TableCell>
                <TableCell className="text-center capitalize">{payment.paymentMethod}</TableCell>
                <TableCell
                  className={cn(
                    "capitalize font-medium text-high text-center",
                    payment.status === "completed" && "text-success",
                    payment.status === "pending" && "text-orange",
                    payment.status === "failed" && "text-danger",
                  )}
                >
                  {payment.status}
                </TableCell>

                <TableCell>
                  <div className="flex justify-center whitespace-nowrap">
                  {payment.status === "pending" && (
                    <button
                      className="font-bold text-white bg-orange hover:bg-burnt
                      rounded-lg py-2 px-4 flex items-center justify-center gap-2 transition-colors"
                      onClick={() => setIsOpen(true)}
                    >
                      Pay
                      <Wallet className="w-5 h-5 text-white" />
                    </button>
                  )}

                  {payment.status === "failed" && (payment.courseId || payment.billingPlanId) && (
                    <button
                      className="font-bold text-white bg-danger hover:bg-danger/80
                      rounded-lg py-2 px-4 flex items-center justify-center gap-2 transition-colors"
                      onClick={() => handleRetry(payment)}
                    >
                      Retry
                      <RefreshCw className="w-5 h-5 text-white" />
                    </button>
                  )}

                  {payment.status === "completed" && (
                    <button
                      className="font-bold text-orange bg-white
                      rounded-lg py-2 px-4 flex items-center justify-center gap-2"
                      type="button"
                      disabled={downloadTransactions.isPending}
                      onClick={handleDownload}
                    >
                      {downloadTransactions.isPending ? "Preparing..." : "Download"}
                      <Download className="w-5 h-5 text-orange" />
                    </button>
                  )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {metaData && metaData.pageCount > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            disabled={!metaData.hasPreviousPages}
            onClick={() => onPageChange(metaData.page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-low">
            Page {metaData.page} of {metaData.pageCount}
          </span>
          <Button
            variant="outline"
            disabled={!metaData.hasNextPages}
            onClick={() => onPageChange(metaData.page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <StudentPaymentMethods
        open={isOpen}
        onOpenChange={() => setIsOpen(false)}
        addNew={() => setIsAddNew(true)}
        cardsFromBackend={cardsFromBackend}
      />

      <AddNewCard open={isAddNew} onOpenChange={() => setIsAddNew(false)} />
    </div>
  );
}
