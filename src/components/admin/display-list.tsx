import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";

export function DisplayList({ text, date }: { text: string; date: Date }) {
  return (
    <div className="bg-offwhite rounded-xl border border-shade-3 min-h-12 flex items-center gap-4 text-high px-4 py-3 justify-between">
      <p className="text-base capitalize">{text}</p>

      <p className="flex items-center gap-4 text-sm shrink-0">
        <span className="flex items-center gap-2 text-sm shrink-0">
          <Calendar className="w-4 h-4 text-low" />
          {date ? format(new Date(date), "PP") : ""}
        </span>

        <span className="flex items-center gap-2 text-sm shrink-0">
          <Clock className="w-4 h-4 text-low" />
          {date ? format(new Date(date), "h:mm a") : ""}
        </span>
      </p>
    </div>
  );
}
