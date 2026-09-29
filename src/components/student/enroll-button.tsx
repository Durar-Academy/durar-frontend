"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

import { initializeCoursePayment } from "@/lib/subscription";
import { formatAmount } from "@/utils/formatter";

export function EnrollButton({
  courseId,
  amount,
  className,
}: {
  courseId: string;
  amount?: number | null;
  className?: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // One idempotency key per card keeps repeat clicks from creating new charges.
  const paymentKeyRef = useRef<string | null>(null);

  const handleEnroll = async (event: React.MouseEvent) => {
    // The button can sit inside a card that links to the course; enrolling must
    // start the payment instead of navigating.
    event.preventDefault();
    event.stopPropagation();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      paymentKeyRef.current ??= globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

      const response = await initializeCoursePayment({ courseId, idempotencyKey: paymentKeyRef.current });
      const paymentLink = response?.authorization_url ?? response?.payment_link;

      if (!paymentLink) throw new Error("Payment checkout could not be started");

      window.location.assign(paymentLink);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to start payment");
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleEnroll}
      disabled={isSubmitting}
      className={
        className ??
        "rounded-lg bg-orange px-4 py-2 text-sm font-medium text-white hover:bg-burnt disabled:opacity-50"
      }
    >
      {isSubmitting
        ? "Opening payment…"
        : typeof amount === "number"
          ? `Enroll · ${formatAmount(amount, "ngn")}`
          : "Enroll"}
    </button>
  );
}
