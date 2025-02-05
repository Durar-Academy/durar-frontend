"use client";

import { useRouter, usePathname } from "next/navigation";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export function SelectComponent({ options }: SelectComponentProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isAnyOptionActive = options.some((option) => pathname.startsWith(option.value));

  const handleChange = (value: string) => {
    router.push(value);
  };

  let selectValue;

  if (pathname.startsWith("/admin/students") || pathname.startsWith("/admin/tutors")) {
    selectValue = pathname.split("/").slice(0, 3).join("/");
  } else selectValue = undefined;

  return (
    <Select onValueChange={handleChange} value={selectValue}>
      <SelectTrigger
        className={cn(
          "shadow-none p-3 h-fit rounded-md  text-white text-base border-0 focus:border-0 focus:ring-0 hover:bg-white/20",
          isAnyOptionActive ? "bg-orange hover:bg-burnt hover:text-shade-1" : "bg-transparent hover:bg-white/20"
        )}
      >
        <div className="flex justify-start items-center gap-2">
          <User className="h-4 w-4" /> <SelectValue placeholder="Users" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className={cn("text-base font-normal cursor-pointer")}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
