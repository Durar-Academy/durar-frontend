import React from "react";

interface TableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
}

export default function Table<T>({ headers, data, renderRow }: TableProps<T>) {
  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <table className="w-full min-w-[620px] table-fixed border-separate border-spacing-y-2 rounded-lg bg-white">
        <thead>
          <tr className="text-low text-sm text-left">
            {headers.map((header, index) => (
              <th key={index} className="whitespace-nowrap px-4 py-3 text-left font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="border-spacing-4 rounded-xl">{data.map((item, index) => renderRow(item, index))}</tbody>
      </table>
    </div>
  );
}
