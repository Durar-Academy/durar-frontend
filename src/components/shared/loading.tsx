import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="z-50 fixed h-full bg-shade-1 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="flex flex-col gap-2 items-center">
        <Loader2 className="w-6 h-6 text-orange animate-spin" />
        <span className="text-high font-medium text-lg mt-2">Loading...</span>
      </div>
    </div>
  );
}
