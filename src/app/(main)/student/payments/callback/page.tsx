"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyPayment } from "@/lib/student";
import { useQueryClient } from "@tanstack/react-query";

function PaymentCallbackContent() {
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const [state, setState] = useState<"loading" | "success" | "pending" | "error">("loading");
  const [message, setMessage] = useState("Verifying your payment…");

  useEffect(() => {
    const reference = params.get("reference") ?? params.get("trxref");
    if (!reference) { setState("error"); setMessage("The payment reference is missing."); return; }
    verifyPayment({ reference, provider: params.get("provider") ?? "paystack", type: params.get("type") ?? undefined })
      .then((result) => {
        queryClient.invalidateQueries({ queryKey: ["all-student-payments"] });
        queryClient.invalidateQueries({ queryKey: ["all-student-payment-methods"] });
        queryClient.invalidateQueries({ queryKey: ["student-subscriptions"] });
        if (result?.status === "pending") {
          setState("pending");
          setMessage("Your payment is still being confirmed. Access will begin automatically after Paystack confirms it.");
        } else {
          setState("success"); setMessage("Payment verified successfully.");
        }
      })
      .catch((error) => { setState("error"); setMessage(error instanceof Error ? error.message : "Payment verification failed."); });
  }, [params, queryClient]);

  return <section className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center"><div className="w-full rounded-xl bg-white p-8 text-center dashboard-shadow"><h1 className="text-2xl font-semibold text-high">{state === "loading" ? "Checking payment" : state === "success" ? "Payment successful" : state === "pending" ? "Payment pending" : "Payment could not be verified"}</h1><p className="mt-3 text-low">{message}</p>{state !== "loading" && <Link href="/student/subscription" className="mt-6 inline-block rounded-lg bg-orange px-5 py-2 text-white">Continue</Link>}</div></section>;
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<section className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center"><div className="w-full rounded-xl bg-white p-8 text-center dashboard-shadow"><h1 className="text-2xl font-semibold text-high">Checking payment</h1><p className="mt-3 text-low">Verifying your payment…</p></div></section>}>
      <PaymentCallbackContent />
    </Suspense>
  );
}
