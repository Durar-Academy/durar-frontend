"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePicker() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-fit h-10 justify-start text-left font-normal text-base text-high border border-shade-3 shadow-none",
            !date && "w-[96px]",
          )}
        >
          {date ? format(date, "PPP") : <span>Date</span>}{" "}
          <CalendarIcon className="h-4 w-4 text-low" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}

export function ControlledDatePicker({
  date,
  setDate,
}: {
  date: Date;
  setDate: (day?: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-10 justify-start text-left font-normal text-base text-high border border-shade-3 shadow-none",
          )}
        >
          {date ? format(date, "PPP") : <span>Date</span>}{" "}
          <CalendarIcon className="h-4 w-4 text-low" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
