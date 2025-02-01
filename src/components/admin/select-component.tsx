"use client";

import { useRouter, usePathname } from "next/navigation";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export function SelectComponent({ options }: SelectComponentProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isAnyOptionActive = options.some((option) => pathname === option.value);

  const handleChange = (value: string) => {
    router.push(value);
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          "shadow-none p-3 h-fit rounded-md  text-white text-base border-0 focus:border-0 focus:ring-0 hover:bg-white/20",
          isAnyOptionActive ? "bg-orange hover:bg-burnt hover:text-shade-1" : "bg-transparent hover:bg-white/20"
        )}
      >
        <div className="flex justify-start items-center gap-2">
          <User className="h-4 w-4" /> <SelectValue placeholder="User" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={cn("text-base font-normal", pathname === option.value ? "bg-shade-3" : "bg-transparent")}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
