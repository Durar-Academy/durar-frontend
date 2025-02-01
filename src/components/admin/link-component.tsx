import Link from "next/link";
import { usePathname } from "next/navigation";

export function LinkComponent({ href, children }: LinkComponentProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-base text-white font-normal flex gap-2 items-center p-3 rounded-md transition-colors ${
        isActive ? "bg-orange hover:bg-burnt hover:text-shade-1" : "bg-transparent hover:bg-white/20"
      }`}
    >
      {children}
    </Link>
  );
}
