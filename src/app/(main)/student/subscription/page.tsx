"use client";

import { useMemo, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";
import { useCurrentUser } from "@/hooks/useAccount";
import { useBillingPlans, useCancelSubscription, useInitializeSubscriptionPayment, useRetrySubscriptionPayment, useSessionWallet, useSubscriptions } from "@/hooks/useSubscription";
import { formatAmount } from "@/utils/formatter";
import toast from "react-hot-toast";

export default function StudentSubscriptionPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: subscriptions, isLoading } = useSubscriptions();
  const { data: plans } = useBillingPlans();
  const { data: wallet } = useSessionWallet();
  const cancel = useCancelSubscription();
  const initializePayment = useInitializeSubscriptionPayment();
  const retry = useRetrySubscriptionPayment();
  const subscription = useMemo(() => (subscriptions ?? []).find((item) => ["active", "past_due", "grace_period", "expired"].includes(item.status)), [subscriptions]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const selectedPlan = plans?.find((item) => item.id === selectedPlanId) ?? plans?.[0];
  const paymentKey = useRef<string | null>(null);
  const renewalMode = subscription?.renewalMode ?? (subscription?.paymentChannel === "card" ? "automatic" : "manual");
  const canRenew = !subscription || ["past_due", "expired"].includes(subscription.status);
  const needsPlanSelection = !subscription || subscription.status === "expired";

  const startPayment = async () => {
    // Expired learners may select a different plan. Active learners' payments
    // remain tied to the current plan and are queued for the next period.
    const paymentPlan = subscription?.status === "expired" ? selectedPlan : subscription?.billingPlan ?? selectedPlan;
    if (!paymentPlan) return;
    try {
      paymentKey.current ??= globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
      const response = await initializePayment.mutateAsync({ billingPlanId: paymentPlan.id, idempotencyKey: paymentKey.current });
      const paymentLink = response?.payment_link ?? response?.authorization_url;
      if (!paymentLink) throw new Error("Payment checkout could not be started");
      window.location.assign(paymentLink);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to start payment");
    }
  };

  const handleCancel = async () => {
    if (!subscription || !window.confirm("Cancel your subscription? Access will stop immediately.")) return;
    try {
      await cancel.mutateAsync({ subscriptionId: subscription.id, reason: "Cancelled by learner" });
      toast.success("Subscription cancelled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to cancel subscription");
    }
  };

  const retryPayment = async () => {
    if (!subscription) return;
    try {
      await retry.mutateAsync(subscription.id);
      toast.success("Payment successful. Subscription renewed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to renew subscription");
    }
  };

  const planSelection = (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-high">{subscription ? "Choose your next subscription plan" : "Choose your learning subscription"}</h2>
        <p className="text-low">Each plan covers all courses assigned to you. Choose the price and weekly session allowance that suits you.</p>
      </div>
      {plans?.length ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{plans.map((item) => <button key={item.id} type="button" onClick={() => { setSelectedPlanId(item.id); paymentKey.current = null; }} className={`rounded-xl border p-4 text-left transition ${selectedPlan?.id === item.id ? "border-orange bg-orange/5 ring-1 ring-orange" : "border-shade-2 hover:border-orange/60"}`}><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-high">{item.name}</h3><p className="mt-1 text-sm text-low">{item.description || "Subscription access plan"}</p></div><span className="rounded-full bg-offwhite px-2 py-1 text-xs text-low">{item.sessionsPerWeek} sessions/week</span></div><p className="mt-4 text-lg font-semibold text-high">{formatAmount(item.amount, item.currency)} <span className="text-sm font-normal text-low">/ {item.interval ?? "billing period"}</span></p></button>)}</div> : <p className="text-low">No active subscription plan is available.</p>}
      <div className="flex flex-wrap items-center gap-3"><button disabled={!selectedPlan || initializePayment.isPending} onClick={startPayment} className="rounded-lg bg-orange px-4 py-2 text-white disabled:opacity-50">{initializePayment.isPending ? "Opening payment…" : "Make Payment Here"}</button>{selectedPlan && <span className="text-sm text-low">Selected: {selectedPlan.name} · {selectedPlan.sessionsPerWeek} sessions/week</span>}</div>
    </div>
  );

  return <section className="flex flex-col gap-5">
    {userLoading ? <Skeleton className="h-20 w-full rounded-xl" /> : <TopBar subtext="Manage your access and session allowance" user={user as User}>Subscription</TopBar>}
    {isLoading ? <Skeleton className="h-48 w-full rounded-xl" /> : subscription ? <div className="space-y-5 rounded-xl bg-white p-6 dashboard-shadow">
      {subscription.status === "past_due" && <div className="rounded-lg border border-orange/30 bg-orange/10 p-4 text-sm text-high">Your renewal payment is overdue. Access remains available until {subscription.gracePeriodEndsAt ? new Date(subscription.gracePeriodEndsAt).toLocaleDateString() : "the end of the grace period"}.</div>}
      {subscription.status === "expired" && <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger">Your subscription has expired. Select a plan below to regain course and class access.</div>}
      <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold text-high">{subscription.billingPlan.name}</h2><p className="capitalize text-low">{subscription.status.replace("_", " ")}</p></div><span className={`rounded-full px-3 py-1 text-sm ${subscription.status === "past_due" ? "bg-orange/10 text-orange" : "bg-success/10 text-success"}`}>{subscription.billingPlan.sessionsPerWeek} sessions / week</span></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4"><div><p className="text-sm text-low">Price</p><p className="font-semibold text-high">{formatAmount(subscription.billingPlan.amount, subscription.billingPlan.currency)}</p></div><div><p className="text-sm text-low">Period ends</p><p className="font-semibold text-high">{subscription.periodEnd ? new Date(subscription.periodEnd).toLocaleDateString() : "—"}</p></div><div><p className="text-sm text-low">Booked this week</p><p className="font-semibold text-high">{wallet?.used ?? 0}</p></div><div><p className="text-sm text-low">Available this week</p><p className="font-semibold text-high">{wallet?.available ?? 0}</p></div></div>
      <div className="rounded-lg bg-offwhite p-4 text-sm text-low">{renewalMode === "automatic" ? "Automatic renewal is enabled for your saved card." : "Manual renewal is required for this payment method. Your next period begins when the current period ends."}</div>
      {needsPlanSelection && planSelection}
      {subscription.status !== "expired" && <div>{["active", "past_due", "grace_period"].includes(subscription.status) && <button onClick={handleCancel} disabled={cancel.isPending} className="rounded-lg border border-danger px-4 py-2 text-danger disabled:opacity-50">{cancel.isPending ? "Cancelling…" : "Cancel subscription"}</button>}{subscription.status === "past_due" && renewalMode === "automatic" && <button onClick={retryPayment} disabled={retry.isPending} className="ml-2 rounded-lg bg-orange px-4 py-2 text-white disabled:opacity-50">{retry.isPending ? "Retrying payment…" : "Retry payment"}</button>}{canRenew && <button onClick={startPayment} disabled={initializePayment.isPending} className="ml-2 rounded-lg bg-orange px-4 py-2 text-white disabled:opacity-50">{initializePayment.isPending ? "Opening payment…" : "Make renewal payment"}</button>}</div>}
    </div> : <div className="rounded-xl bg-white p-6 dashboard-shadow">{planSelection}</div>}
  </section>;
}
