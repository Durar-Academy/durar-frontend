"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePicker({ date, onChange }: { date?: Date; onChange?: (day?: Date) => void }) {
  const [internalDate, setInternalDate] = React.useState<Date>();
  const selectedDate = date === undefined ? internalDate : date;
  const handleChange = (day?: Date) => {
    setInternalDate(day);
    onChange?.(day);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!selectedDate}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selectedDate} onSelect={handleChange} />
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
          data-empty={!date}
          className="w-full h-12 justify-start text-left font-normal text-base text-high border border-shade-3 shadow-none rounded-xl"
        >
          <CalendarIcon className="h-4 w-4 text-low" />
          {date ? format(date, "PPP") : <span>Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}
