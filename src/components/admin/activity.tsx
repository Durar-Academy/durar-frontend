import React from "react";
import { BookOpenCheck, Calendar1, CircleDollarSign, Glasses, LucideIcon, School } from "lucide-react";

export function Activity({ activity }: { activity: string }) {
  let icon;
  let title = "";

  switch (activity) {
    case "NEW_ENROLLMENT":
      icon = Calendar1;
      title = "Recent Enrollment";
      break;

    case " NEW_PAYMENT":
      icon = CircleDollarSign;
      title = "New Payment";
      break;

    case "NEW_COURSE":
      icon = Glasses;
      title = "New Course";
      break;

    case "NEW_QUIZ_SUBMISSION":
      icon = BookOpenCheck;
      title = "New Quiz Submission";
      break;

    case "NEW_ASSIGNMENT_SUBMISSION":
      icon = School;
      title = "New Assignment Submission";
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
