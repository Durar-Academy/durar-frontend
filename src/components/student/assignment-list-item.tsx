"use client";

import { useState } from "react";
import { format } from "date-fns";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { formatAssignmentDueDate } from "@/utils/time";

type AssignmentItemProps = {
  id: number;
  text: string;
  dueDate: Date;
  isChecked: boolean;
};

export function AssignmentListItem({ id, text, dueDate, isChecked }: AssignmentItemProps) {
  const [checked] = useState(isChecked);

  // const handleCheck = () => {
  //   setChecked(!checked);
  // };

  const { text: relativeDateText, color: relativeDateColor } = formatAssignmentDueDate(dueDate);

  return (
    <div className="flex items-start gap-2">
      <Checkbox
        checked={checked}
        // onCheckedChange={handleCheck}
        className="h-5 w-5 border-shade-3 bg-white shadow-none
          data-[state=checked]:bg-orange data-[state=checked]:text-white data-[state=checked]:border-0 disabled:opacity-100"
        id={String(id)}
        disabled
      />

      <Label
        className={`text-sm leading-[18px] tracking-normal flex flex-col gap-1 transition-colors ${
          checked ? "line-through text-low" : "text-high"
        }`}
        htmlFor={String(id)}
      >
        {text}

        {!checked && (
          <span className="text-sm text-low leading-4">
            {format(dueDate, "MMM d")} •{" "}
            <span className={relativeDateColor}>{relativeDateText}</span>
          </span>
        )}
      </Label>
    </div>
  );
}
