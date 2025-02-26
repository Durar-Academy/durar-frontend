import React from "react";

export function StatCard({ stat }: { stat: StatCardProps }) {
  return (
    <div className="rounded-xl dashboard-shadow bg-white p-4 w-full flex flex-col justify-between h-full">
      <h3 className="flex justify-between items-center">
        <span className="text-high font-medium text-base">{stat.title}</span>

        {React.createElement(stat.icon, { key: "icon", className: "w-6 h-6 text-orange shrink-0 inline-block" })}
      </h3>

      <div className="flex justify-between items-center">
        <h3 className="flex flex-col">
          <span className="text-high font-semibold text-xl">{stat.main.figure}</span>

          <span className="text-low font-medium text-xs">{stat.main.label}</span>
        </h3>

        <h3 className="flex flex-col items-end">
          <span className="text-high font-semibold text-xl">{stat.sub.figure}</span>

          <span className="text-low font-medium text-xs">{stat.sub.label}</span>
        </h3>
      </div>
    </div>
  );
}
