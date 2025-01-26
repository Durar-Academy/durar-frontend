import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractDialingCode(dialingCode: string): string {
  return dialingCode.slice(dialingCode.indexOf("+"), -1);
}
