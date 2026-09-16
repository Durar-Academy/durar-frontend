import React, { useState, useEffect, useMemo } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useTutorPayments } from "@/hooks/tutorQueries";
import { Skeleton } from "@/components/ui/skeleton";

const parseDate = (dateStr: string) => new Date(dateStr);

const PaymentTable = () => {
  const { data, isLoading } = useTutorPayments({ page: 1 });
  const payments = useMemo(() => data?.records || [], [data?.records]);
  const [sortedData, setSortedData] = useState(payments);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    setSortedData(payments);
  }, [payments]);

  const handleSort = () => {
    const sorted = [...sortedData].sort((a, b) => {
      const dateA = parseDate(a.createdAt).getTime();
      const dateB = parseDate(b.createdAt).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });
    setSortedData(sorted);
    setSortAsc(!sortAsc);
  };

  if (isLoading) {
    return <Skeleton className="w-full rounded-xl h-[140px]" />;
  }

  if (!sortedData.length) {
    return (
      <div className="bg-white rounded-xl shadow p-4 text-sm text-center text-gray-500">
        No payments found.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white p-4 text-sm shadow">
      <div className="w-full overflow-x-auto">
      <table className="min-w-[640px] table-auto font-medium">
        <thead>
          <tr className="text-left border-b">
            <th
              className="py-4 px-4 font-medium text-high/80 cursor-pointer flex items-center gap-1"
              onClick={handleSort}
            >
              Payment Date
              {sortAsc ? (
                <ArrowDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ArrowUp className="w-4 h-4 text-gray-500" />
              )}
            </th>
            <th className="py-4 px-4 font-medium text-high/80">Reference</th>
            <th className="py-4 px-4 font-medium text-high/80">Amount</th>
            <th className="py-4 px-4 font-medium text-high/80">Currency</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((payment, index) => (
            <tr key={payment.id+" "+index} className="border-b hover:bg-gray-50 transition">
              <td className="py-4 px-4 text-high">{new Date(payment.createdAt).toLocaleDateString()}</td>
              <td className="whitespace-nowrap px-4 py-4 text-high/80">{payment.reference}</td>
              <td className="whitespace-nowrap px-4 py-4 text-high">{payment.amount}</td>
              <td className="whitespace-nowrap px-4 py-4 font-bold text-high">{payment.currency?.toUpperCase()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default PaymentTable;
