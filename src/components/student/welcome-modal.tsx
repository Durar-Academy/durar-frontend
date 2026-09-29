"use client";

import { useEffect, useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// ─── Book icon extracted from the SVG design ─────────────────────────────────
function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      width="108"
      height="131"
      viewBox="167 68 110 132"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M249.173 123.353C248.835 122.013 248.309 120.674 247.633 119.309L241.898 107.99C241.059 106.275 240.007 104.722 238.755 103.345C237.491 101.955 236.176 100.865 234.799 100.077L215.165 88.7451L192.878 75.861L192.265 75.5104L182.11 69.6506C180.733 68.8617 179.418 68.4235 178.153 68.3609C177.365 68.3108 176.651 68.436 176.025 68.7115L175.774 68.8367C175.499 68.9744 175.249 69.1497 175.011 69.3626L169.276 74.0705C168.6 74.6465 168.074 75.3977 167.736 76.3368C167.385 77.2759 167.223 78.3652 167.223 79.5922V145.177C167.223 148.07 168.112 151.062 169.915 154.155C171.705 157.248 173.859 159.526 176.388 160.979L240.52 198.016C243.05 199.469 245.203 199.681 246.994 198.655C248.797 197.64 249.686 195.675 249.686 192.782V127.197C249.686 125.97 249.523 124.693 249.173 123.353Z"
        stroke="#F38708"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M238.691 118.094L215.164 104.509L192.263 91.2865L178.227 83.1852L183.11 80.7437L192.263 86.0275L215.164 99.2497L234.797 110.581L238.691 118.094Z"
        stroke="#F38708"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M226.783 133.545V155.243C226.783 157.259 226.057 158.349 224.604 158.524C223.152 158.699 221.662 157.898 220.134 156.145L208.452 142.697L226.783 133.545Z"
        stroke="#F38708"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M226.785 130.152V133.545L208.454 142.698L196.772 142.648C196.321 142.648 195.87 142.56 195.42 142.397C194.368 142.022 193.329 141.17 192.302 139.88C190.849 138.027 190.123 136.099 190.123 134.083V100.564L192.264 101.804L215.165 115.014V121.562C215.165 123.578 215.891 125.506 217.344 127.359C218.796 129.2 220.286 130.127 221.814 130.127L226.785 130.152Z"
        stroke="#F38708"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M274.726 114.676V180.261C274.726 183.154 273.837 185.119 272.034 186.134L271.47 186.409L246.991 198.655C248.795 197.64 249.683 195.675 249.683 192.782V127.197C249.683 125.97 249.521 124.693 249.17 123.353C248.832 122.013 248.306 120.673 247.63 119.309L241.895 107.99C241.057 106.274 240.005 104.722 238.753 103.344C237.488 101.955 236.173 100.865 234.796 100.076L215.163 88.7449L192.876 75.8608L192.262 75.5102L182.108 69.6503C180.73 68.8615 179.416 68.4233 178.151 68.3607C177.362 68.3106 176.648 68.4358 176.022 68.7113L200.576 56.4532L201.202 56.1402C201.791 55.8897 202.454 55.7896 203.193 55.8397C204.458 55.9023 205.772 56.3405 207.15 57.1293L259.838 87.5554C261.215 88.3442 262.53 89.4335 263.795 90.8234C265.047 92.2007 266.099 93.7533 266.937 95.4687L272.672 106.788C273.348 108.152 273.874 109.492 274.212 110.832C274.563 112.172 274.726 113.449 274.726 114.676Z"
        stroke="#F38708"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Modal Component ─────────────────────────────────────────────────────────
export function StudentWelcomeModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(() => {
      setOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [mounted]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className={cn(
          "max-w-[400px] p-0 gap-0 overflow-hidden rounded-xl",
        )}
      >
        {/* ── Header: Light orange bg with book icon ── */}
        <div className="bg-[#FFF7ED] h-[200px] flex items-center justify-center rounded-t-xl">
          <BookIcon className="w-[108px] h-[131px]" />
        </div>

        {/* ── Body: Contribution message ── */}
        <div className="px-8 pt-8 pb-6 flex flex-col gap-3">
          <h2 className="text-high text-2xl font-bold text-center leading-snug">
            Your Contribution Makes a Difference
          </h2>

          <p className="text-low text-sm text-center leading-relaxed">
            Every donation, no matter the size, contributes to the growth and success
            of our students. Together, we can make a lasting impact.
          </p>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-shade-1" />

        {/* ── Footer: Skip + Donation buttons ── */}
        <div className="px-8 py-5 flex items-center gap-3">
          {/* Skip button */}
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 h-11 rounded-lg border border-shade-3 bg-white text-sm font-medium text-low hover:bg-shade-1 transition-colors"
          >
            Skip
          </button>

          {/* Donation button */}
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 h-11 rounded-lg bg-orange text-white text-sm font-medium hover:bg-burnt transition-colors"
          >
            Donation
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
