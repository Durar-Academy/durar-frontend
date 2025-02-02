import React from "react";

export function ActivitiesCard({ icon, title, children }: ActivitiesCardProps) {
  return (
    <div className="dashboard-shadow rounded-xl p-4 bg-white h-full w-full">
      <h3 className="flex items-center gap-2 mb-6">
        {React.createElement(icon, { key: "icon", className: "w-6 h-6 text-orange shrink-0 inline-block" })}

        <span className="text-high font-medium text-base">{title}</span>
      </h3>

      <div className="flex flex-col gap-6 overflow-y-scroll h-40 hide-scrollbar">{children}</div>
    </div>
  );
}
