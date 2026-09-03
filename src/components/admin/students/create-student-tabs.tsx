"use client";

import { cn } from "@/lib/utils";

type CreateStudentTabsProps = {
  currentFormStep: number;
  totalFormSteps: number;
};

export function CreateStudentTabs({ currentFormStep, totalFormSteps }: CreateStudentTabsProps) {
  return (
    <div className="w-full max-w-[800px] mx-auto text-low text-base flex items-center gap-3 mb-4">
      <p className="flex items-center gap-2 shrink-0">
        <span
          className={cn(
            "h-4 w-4 rounded-full border-2 border-shade-3 p-2 flex items-center justify-center bg-white transition-colors text-xs",
            currentFormStep === 1 && "border-burnt bg-orange text-white",
            currentFormStep > 1 && "border-success bg-success text-white",
          )}
        >
          1
        </span>
        <span
          className={cn(
            "transition-colors",
            currentFormStep === 1 && "text-orange",
            currentFormStep > 1 && "text-success",
          )}
        >
          Personal Information
        </span>
      </p>

      <p className="w-full h-[1px] bg-low"></p>

      <p className="flex items-center gap-2 shrink-0">
        <span
          className={cn(
            "h-4 w-4 rounded-full border-2 border-shade-3 p-2 flex items-center justify-center bg-white transition-colors text-xs",
            currentFormStep === 2 && "border-burnt bg-orange text-white",
            currentFormStep > 2 && "border-success bg-success text-white",
          )}
        >
          2
        </span>
        <span
          className={cn(
            "transition-colors",
            currentFormStep === 2 && "text-orange",
            currentFormStep > 2 && "text-success",
          )}
        >
          Enrollment Details
        </span>
      </p>

      <p className="w-full h-[1px] bg-low"></p>

      <p className="flex items-center gap-2 shrink-0">
        <span
          className={cn(
            "h-4 w-4 rounded-full border-2 border-shade-3 p-2 flex items-center justify-center bg-white transition-colors text-xs",
            currentFormStep === 3 && "border-burnt bg-orange text-white",
            currentFormStep > 3 && "border-success bg-success text-white",
          )}
        >
          3
        </span>
        <span
          className={cn(
            "transition-colors",
            currentFormStep === 3 && "text-orange",
            currentFormStep > 3 && "text-success",
          )}
        >
          Address & Location
        </span>
      </p>

      <p className="w-full h-[1px] bg-low"></p>

      <p className="flex items-center gap-2 shrink-0">
        <span
          className={cn(
            "h-4 w-4 rounded-full border-2 border-shade-3 p-2 flex items-center justify-center bg-white transition-colors text-xs",
            currentFormStep === totalFormSteps && "border-burnt bg-orange text-white",
          )}
        >
          4
        </span>
        <span
          className={cn(
            "transition-colors",
            currentFormStep === totalFormSteps && "text-orange",
          )}
        >
          Account Setup
        </span>
      </p>
    </div>
  );
}
