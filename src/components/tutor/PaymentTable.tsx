import React, { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react"; // You can also use Heroicons or any icon lib

interface Payment {
  date: string;
  reference: string;
  amount: string;
}

const mockPayments: Payment[] = [
  {
    date: "12th March, 2025",
    reference: "345670987652345678",
    amount: "₦40,000",
  },
  {
    date: "13th March, 2025",
    reference: "345670987652345678",
    amount: "₦40,000",
  },
  {
    date: "10th March, 2025",
    reference: "345670987652345678",
    amount: "₦40,000",
  },
];

// Convert "12th March, 2025" to actual date for sorting
const parseDate = (dateStr: string) =>
  new Date(dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1"));

const PaymentTable = () => {
  const [sortedData, setSortedData] = useState(mockPayments);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = () => {
    const sorted = [...sortedData].sort((a, b) => {
      const dateA = parseDate(a.date).getTime();
      const dateB = parseDate(b.date).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });
    setSortedData(sorted);
    setSortAsc(!sortAsc);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 text-sm">
      <table className="min-w-full table-auto font-medium">
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
          </tr>
        </thead>
        <tbody>
          {sortedData.map((payment, index) => (
            <tr key={index} className="border-b hover:bg-gray-50 transition">
              <td className="py-4 px-4 text-high">{payment.date}</td>
              <td className="py-4 px-4 text-high/80">{payment.reference}</td>
              <td className="py-4 px-4 text-high">{payment.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
