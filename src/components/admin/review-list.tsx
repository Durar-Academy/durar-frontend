import { Calendar } from "lucide-react";

export function ReviewList({
  studentName,
  course,
  date,
  review,
}: {
  studentName: string;
  course: string;
  date: string;
  review: string;
}) {
  return (
    <div className="w-full rounded-xl border border-shade-3 bg-offwhite flex flex-col gap-6 px-3 py-4">
      <div className="flex justify-between items-center text-sm text-low">
        <p className="flex flex-col gap-2">
          <span className="font-semibold">{studentName}</span>

          <span>{course}</span>
        </p>

        <p className="flex gap-2 items-center shrink-0 text-high">
          <Calendar className="w-4 h-4 text-low" />
          {date}
        </p>
      </div>

      <p className="text-sm text-high font-normal">{review}</p>
    </div>
  );
}
