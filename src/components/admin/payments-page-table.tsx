import { Download } from "lucide-react";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { formatAmount, formatToReadableId } from "@/utils/formatter";
import { PAYMENT_STATUSES } from "@/data/constants";

export function PaymentsPageTable({
  payments,
  status,
  startAt,
  endAt,
  onStatusChange,
  onStartAtChange,
  onEndAtChange,
  onExport,
}: {
  payments: PaymentsPageTableProps;
  status?: PaymentStatus;
  startAt?: Date;
  endAt?: Date;
  onStatusChange: (value?: PaymentStatus) => void;
  onStartAtChange: (value?: Date) => void;
  onEndAtChange: (value?: Date) => void;
  onExport: () => void;
}) {
  return (
    <div className="rounded-xl p-6 border border-shade-2 bg-white h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base text-high font-semibold">Payments</h3>

        <div className="flex flex-wrap justify-end gap-3">
          <Select value={status ?? "all"} onValueChange={(value) => onStatusChange(value === "all" ? undefined : value as PaymentStatus)}>
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
            <DatePicker date={startAt} onChange={onStartAtChange} />
          </div>

          <DatePicker date={endAt} onChange={onEndAtChange} />

          <Button
            variant={"_outline"}
            className="bg-white border-orange text-orange hover:bg-offwhite px-4 py-2 h-10"
            onClick={onExport}
          >
            <Download className="w-6 h-6" strokeWidth={3} />
            <span>Export List</span>
          </Button>
        </div>
      </div>

      <div className="min-h-[280px] overflow-y-scroll hide-scrollbar">
        {payments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="text-low text-sm font-semibold">
                <TableHead>Name</TableHead>

                <TableHead>Invoice ID</TableHead>

                <TableHead>Amount</TableHead>

                <TableHead>Status</TableHead>

                <TableHead className="text-center">Date</TableHead>

                <TableHead className="text-center">Payment Method</TableHead>

                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="space-y-3">
              {payments.map((payment) => (
                <TableRow
                  className="text-sm text-high bg-offwhite h-12"
                  key={payment.id + payment.status}
                >
                  <TableCell className="capitalize">
                    {payment.firstName} {payment.lastName}
                  </TableCell>

                  <TableCell className="capitalize">
                    {formatToReadableId(payment.id, "INV")}
                  </TableCell>

                  <TableCell>{formatAmount(payment.amount, payment.currency)}</TableCell>

                  <TableCell
                    className={cn(
                      "capitalize font-medium text-high",
                      payment.status === "completed" && "text-success",
                      payment.status === "pending" && "text-orange",
                      payment.status === "failed" && "text-danger",
                    )}
                  >
                    {payment.status}
                  </TableCell>

                  <TableCell className="text-center">{payment.date}</TableCell>

                  <TableCell className="text-center capitalize">{payment.paymentMethod}</TableCell>

                  <TableCell>
                    <Link href={`/admin/payments/${payment.id}`}>
                      <button className="font-bold text-orange hover:underline">View</button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm mt-4 text-low">No Payments found</p>
        )}
      </div>
    </div>
  );
}
