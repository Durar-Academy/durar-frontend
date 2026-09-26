import React from "react";
import { BookOpenCheck, Calendar1, CircleDollarSign, Glasses, LucideIcon, School } from "lucide-react";

export function Activity({ activity }: { activity: string }) {
  let Icon: LucideIcon | undefined;
  let title: string | undefined;

  // Activity values come from the API, so normalize them before matching.
  switch (activity.trim()) {
    case "NEW_ENROLLMENT":
      Icon = Calendar1;
      title = "Recent Enrollment";
      break;

    case "NEW_PAYMENT":
      Icon = CircleDollarSign;
      title = "New Payment";
      break;

    case "NEW_COURSE":
      Icon = Glasses;
      title = "New Course";
      break;

    case "NEW_QUIZ_SUBMISSION":
      Icon = BookOpenCheck;
      title = "New Quiz Submission";
      break;

    case "NEW_ASSIGNMENT_SUBMISSION":
      Icon = School;
      title = "New Assignment Submission";
      break;
  }

  // Do not pass an undefined component to React if the API adds a new action.
  if (!Icon || !title) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full w-8 h-8 bg-light flex items-center justify-center">
        <Icon className="text-orange w-4 h-4 shrink-0 inline-block" />
      </div>

      <p className="text-high text-sm font-medium leading-4">{title}</p>
    </div>
  );
}
