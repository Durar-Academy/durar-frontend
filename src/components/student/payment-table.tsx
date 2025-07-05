import { DatePicker } from "@/components/ui/date-picker";
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
import { useState } from "react";
import { AddNewCard } from "./add-new-card";
import { StudentPaymentMethods } from "./student-payment-methods";
import { usePaymentMethods } from "@/hooks/useStudent";

export function PaymentsTable({ payments }: { payments: PaymentsTableProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddNew, setIsAddNew] = useState(false);

  const { data: methods } = usePaymentMethods();

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

      <div className="h-screen overflow-y-scroll hide-scrollbar">
        <Table>
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
            {payments.map((payment) => (
              <TableRow
                className="text-sm text-high bg-offwhite h-12"
                key={payment.id + payment.status}
              >
                <TableCell className="capitalize">
                  {formatToReadableId(payment.id, "INV")}
                </TableCell>
                <TableCell>{formatAmount(payment.amount)}</TableCell>
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

                <TableCell className="flex justify-center">
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

                  {payment.status === "failed" && (
                    <button
                      className="font-bold text-white bg-danger
                      rounded-lg py-2 px-4 flex items-center justify-center gap-2"
                    >
                      Retry
                      <RefreshCw className="w-5 h-5 text-white" />
                    </button>
                  )}

                  {payment.status === "completed" && (
                    <button
                      className="font-bold text-orange bg-white
                      rounded-lg py-2 px-4 flex items-center justify-center gap-2"
                    >
                      Download
                      <Download className="w-5 h-5 text-orange" />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
