import { differenceInDays, format } from "date-fns";

export function getTimestamp() {
  return new Date().toISOString();
}

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "2-digit",
    hour12: false,
  });
}

export const formatAssignmentDueDate = (dueDate: Date) => {
  const daysLeft = differenceInDays(dueDate, new Date());

  if (daysLeft < 0) {
    return { text: `Overdue by ${Math.abs(daysLeft)} days`, color: "text-danger" };
  }

  switch (daysLeft) {
    case 0:
      return { text: "Due Today", color: "text-danger" };

    case 1:
      return { text: "Due Tomorrow", color: "text-orange" };

    default:
      return { text: `Due in ${daysLeft} days`, color: "text-low" };
  }
};

export const currentDay = format(new Date(), "EEEE");
