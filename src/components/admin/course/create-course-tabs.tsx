"use client";

import { cn } from "@/lib/utils";
import { useCreateCourseFormProvider } from "@/hooks/useForm";

export function CreateCourseTabs() {
  const { currentFormStep, totalFormSteps } = useCreateCourseFormProvider();

  return (
    <div className="w-full max-w-[800px] mx-auto text-low text-base flex items-center gap-3 mb-4">
      <p className="flex items-center gap-2 shrink-0">
        <span
          className={cn(
            "h-4 w-4 rounded-full border-2 border-shade- p-2 flex items-center justify-center bg-white transition-colors text-xs",

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
          Basic Information
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
          Course Structure
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
          3
        </span>
        <span
          className={cn(
            "transition-colors",

            currentFormStep === totalFormSteps && "text-orange",
          )}
        >
          Additional Information
        </span>
      </p>
    </div>
  );
}
