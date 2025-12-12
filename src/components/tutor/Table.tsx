import React from "react";

interface TableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
}

export default function Table<T>({ headers, data, renderRow }: TableProps<T>) {
  return (
    <div className="overflow-x-auto border-spacing-y-4">
      <table className="min-w-full bg-white border-none rounded-lg border-separate border-spacing-y-3">
        <thead>
          <tr className="text-low text-sm text-left">
            {headers.map((header, index) => (
              <th key={index} className="py-3 px-4">
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
