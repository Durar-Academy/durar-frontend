"use client";

import { cn } from "@/lib/utils";

export function CreateCourseTabs() {
  return (
    <div className="w-full max-w-[800px] mx-auto text-low text-base flex items-center gap-3 mb-4">
      <p className="flex items-center gap-2 shrink-0">
        <span
          className={cn(
            "h-4 w-4 rounded-full border-2 border-shade- p-2 flex items-center justify-center bg-white transition-colors text-xs",

            true && "border-burnt bg-orange text-white",
          )}
        >
          1
        </span>
        <span className={cn("transition-colors", true && "text-orange")}>Basic Information</span>
      </p>

      <p className="w-full h-[1px] bg-low"></p>

      <p className="flex items-center gap-2 shrink-0">
        <span
          className={cn(
            "h-4 w-4 rounded-full border-2 border-shade-3 p-2 flex items-center justify-center bg-white transition-colors text-xs",

            false && "border-burnt bg-orange text-white",
          )}
        >
          2
        </span>
        <span className={cn("transition-colors", false && "text-orange")}>Course Structure</span>
      </p>

      <p className="w-full h-[1px] bg-low"></p>

      <p className="flex items-center gap-2 shrink-0">
        <span
          className={cn(
            "h-4 w-4 rounded-full border-2 border-shade-3 p-2 flex items-center justify-center bg-white transition-colors text-xs",

            false && "border-burnt bg-orange text-white",

            true && "border-success bg-success text-white",
          )}
        >
          3
        </span>
        <span className={cn("transition-colors", false && "text-orange", true && "text-success")}>
          Additional Information
        </span>
      </p>
    </div>
  );
}
