"use client";

import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";

import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function PasswordField<T extends FieldValues>({
  control,
  label,
  name,
}: {
  label: string;
  name: Path<T>;
  control: Control<T>;
}) {
  const [seePassword, setSeePassword] = useState(false);
  const toggleSwitch = () => setSeePassword((prevValue) => !prevValue);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="basis-1/2">
          <FormLabel className="text-low text-sm font-medium mb-2">{label}</FormLabel>
          <FormControl>
            <div className="flex items-center px-4 py-2 rounded-xl h-12 placeholder:text-low text-high text-sm focus-within:border-2 focus-within:border-orange border border-input">
              <Input
                placeholder="•••••••"
                type={seePassword ? "text" : "password"}
                className="shadow-none 
                
                focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 p-0"
                {...field}
              />

              <div className="p-2 cursor-pointer bg-white" onClick={toggleSwitch}>
                {seePassword ? <Eye className="h-5 w-5 text-high" /> : <EyeClosed className="h-5 w-5 text-high" />}
              </div>
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
