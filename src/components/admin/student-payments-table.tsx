import { Download } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { formatAmount, formatToReadableId } from "@/utils/formatter";

export function StudentPaymentsTable({ payments }: { payments: StudentsPaymentsTableProps }) {
  return (
    <div className="rounded-xl p-6 border border-shade-2 bg-white h-full">
      <div className="h-[470px] overflow-y-scroll hide-scrollbar">
        {payments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="text-low text-sm font-semibold">
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
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
                    {formatToReadableId(payment.id, "INV")}
                  </TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{formatAmount(payment.amount)}</TableCell>
                  <TableCell
                    className={cn(
                      "capitalize font-medium text-high",
                      payment.status === "completed" && "text-success",
                      payment.status === "pending" && "text-orange",
                      payment.status === "failed" && "text-danger"
                    )}
                  >
                    {payment.status}
                  </TableCell>
                  <TableCell>
                    <button className="font-bold text-orange hover:underline">
                      <Download className="w-4 h-4 text-orange" />
                    </button>
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
