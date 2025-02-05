import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { formatToNaira, formatToReadableId } from "@/utils/formatter";
import { PAYMENT_STATUSES } from "@/data/constants";

export function PaymentsTable({ payments }: { payments: PaymentsTableProps }) {
  return (
    <div className="p-6 dashboard-shadow rounded-xl bg-white h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base text-high font-semibold">Payment</h3>

        <div className="flex gap-3">
          <Select>
            <SelectTrigger className="w-fit h-10 text-high bg-white border border-shade-3 rounded-lg text-base px-4 py-3 focus:ring-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              {PAYMENT_STATUSES.map((paymentStatus, index) => (
                <SelectItem value={paymentStatus.status} key={paymentStatus.status + index} className="capitalize">
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

      <div className="h-[280px] overflow-y-scroll hide-scrollbar">
        {payments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="text-low text-sm font-semibold">
                <TableHead>Invoice ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-center">Date Issued - Due Date </TableHead>
                <TableHead className="text-center">Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="space-y-3">
              {payments.map((payment) => (
                <TableRow className="text-sm text-high bg-offwhite h-12" key={payment.id + payment.status}>
                  <TableCell className="capitalize">{formatToReadableId(payment.id, "INV")}</TableCell>
                  <TableCell>{formatToNaira(payment.amount)}</TableCell>
                  <TableCell className="text-center">
                    {payment.dateIssued} - {payment.dueDate}
                  </TableCell>
                  <TableCell className="text-center capitalize">{payment.paymentMethod}</TableCell>
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
                    <button className="font-bold text-orange">View</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No Payments found</p>
        )}
      </div>
    </div>
  );
}
