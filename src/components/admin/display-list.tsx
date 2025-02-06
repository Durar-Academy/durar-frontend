import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";

import { formatDateAndTime } from "@/utils/formatter";

export function DisplayList({ text, date }: { text: string; date: Date }) {
  const { date: extractedDate, time: extractedTime } = formatDateAndTime(date);
  const _date = format(new Date(extractedDate), "PPP");

  return (
    <div className="bg-offwhite rounded-xl border border-shade-3 min-h-12 flex items-center gap-4 text-high px-4 py-3 justify-between">
      <p className="text-base capitalize">{text}</p>

      <p className="flex items-center gap-4 text-sm shrink-0">
        <span className="flex items-center gap-2 text-sm shrink-0">
          <Calendar className="w-4 h-4 text-low" />
          {_date}
        </span>

        <span className="flex items-center gap-2 text-sm shrink-0">
          <Clock className="w-4 h-4 text-low" />
          {extractedTime}
        </span>
      </p>
    </div>
  );
}
