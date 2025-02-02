import React from "react";
import { Calendar1, CircleDollarSign, Glasses, LucideIcon } from "lucide-react";

export function Activity({ activity }: { activity: string }) {
  let icon;
  let title = "";

  switch (activity) {
    case "enrollment":
      icon = Calendar1;
      title = "Recent Enrollment";
      break;

    case "payment":
      icon = CircleDollarSign;
      title = "New Payment";
      break;

    case "course":
      icon = Glasses;
      title = "New Course";
      break;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full w-8 h-8 bg-light flex items-center justify-center">
        {React.createElement(icon as LucideIcon, {
          key: "icon",
          className: "text-orange w-4 h-4 shrink-0 inline-block",
        })}
      </div>

      <p className="text-high text-sm font-medium leading-4">{title}</p>
    </div>
  );
}
