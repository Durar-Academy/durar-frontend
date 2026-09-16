"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function ResponsiveSidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigationClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <aside className="hidden h-full w-[260px] shrink-0 bg-green p-8 lg:block">
        <SidebarBrand />
        <div className="mt-[60px]">{children}</div>
      </aside>

      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-green text-white shadow-lg lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="relative h-full w-[min(82vw,300px)] overflow-y-auto bg-green p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <SidebarBrand />
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-10" onClick={handleNavigationClick}>
              {children}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarBrand() {
  return (
    <div className="relative h-10 w-32">
      <Image src="/logo-white.svg" fill alt="Durar Logo" className="object-contain object-left" />
    </div>
  );
}
