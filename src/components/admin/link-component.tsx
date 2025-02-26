import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function LinkComponent({ href, children, exact = false }: LinkComponentProps) {
  const pathname = usePathname();

  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "text-base text-white font-normal flex gap-2 items-center p-3 rounded-md transition-colors",
        isActive
          ? "bg-orange hover:bg-burnt hover:text-shade-1"
          : "bg-transparent hover:bg-white/20",
      )}
    >
      {children}
    </Link>
  );
}
