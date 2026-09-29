"use client";

import { useMemo, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";
import { useCurrentUser } from "@/hooks/useAccount";
import { useCancelSubscription, useInitializeSubscriptionPayment, useRetrySubscriptionPayment, useSessionWallet, useSubscriptions, useBillingPlans } from "@/hooks/useSubscription";
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
  const subscription = useMemo(() => (subscriptions ?? []).find((item) => ['active', 'past_due', 'grace_period', 'expired'].includes(item.status)), [subscriptions]);
  const plan = plans?.[0];
  const paymentKey = useRef<string | null>(null);
  const renewalMode = subscription?.renewalMode ?? (subscription?.paymentChannel === 'card' ? 'automatic' : 'manual');
  const canRenew = !subscription || ['past_due', 'expired'].includes(subscription.status);

  const startPayment = async () => {
    const paymentPlan = subscription?.billingPlan ?? plan;
    if (!paymentPlan) return;
    try {
      paymentKey.current ??= globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
      const response = await initializePayment.mutateAsync({ billingPlanId: paymentPlan.id, idempotencyKey: paymentKey.current });
      const paymentLink = response?.payment_link ?? response?.authorization_url;
      if (!paymentLink) throw new Error('Payment checkout could not be started');
      window.location.assign(paymentLink);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to start payment');
    }
  };

  const handleCancel = async () => {
    if (!subscription || !window.confirm('Cancel your subscription? Access will stop immediately.')) return;
    try {
      await cancel.mutateAsync({ subscriptionId: subscription.id, reason: 'Cancelled by learner' });
      toast.success('Subscription cancelled');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to cancel subscription');
    }
  };

  const retryPayment = async () => {
    if (!subscription) return;
    try {
      await retry.mutateAsync(subscription.id);
      toast.success('Payment successful. Subscription renewed.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to retry payment');
    }
  };

  return <section className="flex flex-col gap-5">
    {userLoading ? <Skeleton className="h-20 w-full rounded-xl" /> : <TopBar subtext="Manage your access and session allowance" user={user as User}>Subscription</TopBar>}
    {isLoading ? <Skeleton className="h-48 w-full rounded-xl" /> : subscription ? <div className="rounded-xl bg-white p-6 dashboard-shadow space-y-5">
      {subscription.status === 'past_due' && <div className="rounded-lg border border-orange/30 bg-orange/10 p-4 text-sm text-high">Your renewal payment is overdue. Access remains available until {subscription.gracePeriodEndsAt ? new Date(subscription.gracePeriodEndsAt).toLocaleDateString() : 'the end of the grace period'}.</div>}
      {subscription.status === 'expired' && <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger">Your subscription has expired. Renew your subscription to regain course and class access.</div>}
      <div className="flex items-start justify-between gap-4">
        <div><h2 className="text-xl font-semibold text-high">{subscription.billingPlan.name}</h2><p className="text-low capitalize">{subscription.status.replace('_', ' ')}</p></div>
        <span className={`rounded-full px-3 py-1 text-sm ${subscription.status === 'past_due' ? 'bg-orange/10 text-orange' : 'bg-success/10 text-success'}`}>4 sessions / week</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div><p className="text-sm text-low">Price</p><p className="font-semibold text-high">{formatAmount(subscription.billingPlan.amount, subscription.billingPlan.currency)}</p></div>
        <div><p className="text-sm text-low">Period ends</p><p className="font-semibold text-high">{subscription.periodEnd ? new Date(subscription.periodEnd).toLocaleDateString() : '—'}</p></div>
        <div><p className="text-sm text-low">Booked this week</p><p className="font-semibold text-high">{wallet?.used ?? 0}</p></div>
        <div><p className="text-sm text-low">Available this week</p><p className="font-semibold text-high">{wallet?.available ?? 0}</p></div>
      </div>
      <div className="rounded-lg bg-offwhite p-4 text-sm text-low">{renewalMode === 'automatic' ? 'Automatic renewal is enabled for your saved card.' : 'Manual renewal is required for this payment method. Your next period begins when the current period ends.'}</div>
      {['active', 'past_due', 'grace_period'].includes(subscription.status) && <button onClick={handleCancel} disabled={cancel.isPending} className="rounded-lg border border-danger px-4 py-2 text-danger disabled:opacity-50">{cancel.isPending ? 'Cancelling…' : 'Cancel subscription'}</button>}
      {subscription.status === 'past_due' && renewalMode === 'automatic' && <button onClick={retryPayment} disabled={retry.isPending} className="ml-2 rounded-lg bg-orange px-4 py-2 text-white disabled:opacity-50">{retry.isPending ? 'Retrying payment…' : 'Retry payment'}</button>}
      {canRenew && <button onClick={startPayment} disabled={initializePayment.isPending} className="ml-2 rounded-lg bg-orange px-4 py-2 text-white disabled:opacity-50">{initializePayment.isPending ? 'Opening payment…' : subscription.status === 'expired' ? 'Renew subscription' : 'Make renewal payment'}</button>}
    </div> : <div className="rounded-xl bg-white p-6 dashboard-shadow space-y-4"><h2 className="text-xl font-semibold text-high">Start your learning subscription</h2><p className="text-low">One flat monthly subscription covers all courses assigned to you and gives you four class sessions each week. Your card is securely handled by Paystack and can be reused for automatic renewal.</p>{plan ? <div className="rounded-lg bg-offwhite p-4"><p className="font-semibold text-high">{plan.name}</p><p className="text-low">{formatAmount(plan.amount, plan.currency)} · 4 sessions per week</p></div> : <p className="text-low">No active subscription plan is available.</p>}<button disabled={!plan || initializePayment.isPending} onClick={startPayment} className="rounded-lg bg-orange px-4 py-2 text-white disabled:opacity-50">{initializePayment.isPending ? 'Opening payment…' : 'Make Payment Here'}</button></div>}
  </section>;
}
