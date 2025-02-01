"use client";

import { useRouter } from "next/navigation";

export function ButtonComponent({ href, onClick, children }: ButtonComponentProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        onClick();
        router.push(href);
      }}
      className={`text-base text-white font-normal flex gap-2 items-center p-3 rounded-md hover:bg-white/20`}
    >
      {children}
    </button>
  );
}
