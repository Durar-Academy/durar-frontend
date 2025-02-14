import { FileUser } from "lucide-react";

export function FilelistItem({ filename }: { filename: string }) {
  return (
    <div className="min-h-12 rounded-xl border border-shade-3 bg-offwhite px-3 py-2 flex justify-between items-center text-base w-full">
      <p className="flex gap-2 items-center">
        <FileUser className="w-6 h-6 text-low" />
        <span className="text-high font-normal">{filename}</span>
      </p>

      <p className="text-orange font-semibold  hover:underline">View</p>
    </div>
  );
}
