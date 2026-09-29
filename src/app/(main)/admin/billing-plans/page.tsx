"use client";

import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useAdminBillingPlans, useCreateBillingPlan, useUpdateBillingPlan } from '@/hooks/useBillingPlansAdmin';
import type { BillingPlanInput } from '@/lib/billing-admin';
import { formatAmount } from '@/utils/formatter';
import { SUPPORTED_CURRENCIES } from '@/data/constants';

const emptyForm: BillingPlanInput = { name: '', amount: 0, currency: 'usd', interval: 'monthly', sessionsPerWeek: 4, gracePeriodDays: 3, maxCarryForwardSessions: 2, description: '' };

export default function AdminBillingPlansPage() {
  const { data: plans = [], isLoading } = useAdminBillingPlans();
  const create = useCreateBillingPlan();
  const update = useUpdateBillingPlan();
  const [form, setForm] = useState(emptyForm);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || form.amount < 0 || form.sessionsPerWeek < 1) return toast.error('Enter a valid plan name, amount, and session allowance.');
    try {
      await create.mutateAsync({ ...form, name: form.name.trim(), description: form.description?.trim() });
      setForm(emptyForm);
      toast.success('Billing plan created');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to create billing plan'); }
  };

  const toggle = async (id: string, active: boolean) => {
    try { await update.mutateAsync({ id, payload: { active: !active } }); toast.success(!active ? 'Plan activated' : 'Plan deactivated'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to update plan'); }
  };

  const field = (key: keyof BillingPlanInput, label: string, type = 'text') => key === 'currency' ? <label className="text-sm text-low">{label}<select value={form.currency} onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value }))} className="mt-1 block h-10 w-full rounded-md border border-shade-2 bg-white px-3 text-high">{SUPPORTED_CURRENCIES.map((currency) => <option key={currency.value} value={currency.value}>{currency.label}</option>)}</select></label> : <label className="text-sm text-low">{label}<input required={key === 'name'} type={type} value={String(form[key] ?? '')} onChange={(event) => setForm((current) => ({ ...current, [key]: type === 'number' ? Number(event.target.value) : event.target.value }))} className="mt-1 block h-10 w-full rounded-md border border-shade-2 px-3 text-high" /></label>;

  return <section className="space-y-5"><div><h1 className="text-2xl font-semibold text-high">Billing plans</h1><p className="text-low">Configure the flat subscription price, weekly class allowance, and grace-period policy.</p></div><form onSubmit={submit} className="grid grid-cols-1 gap-4 rounded-xl border border-shade-2 bg-white p-6 md:grid-cols-3">{field('name', 'Plan name')}{field('amount', 'Monthly amount', 'number')}{field('currency', 'Currency')}{field('sessionsPerWeek', 'Sessions per week', 'number')}{field('gracePeriodDays', 'Grace period (days)', 'number')}{field('maxCarryForwardSessions', 'Normal carry-forward limit', 'number')}<label className="text-sm text-low md:col-span-2">Description<textarea value={form.description ?? ''} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="mt-1 block min-h-20 w-full rounded-md border border-shade-2 p-3 text-high" /></label><div className="flex items-end"><button disabled={create.isPending} className="h-10 rounded-md bg-orange px-4 text-sm text-white disabled:opacity-50">{create.isPending ? 'Creating…' : 'Create plan'}</button></div></form><div className="rounded-xl border border-shade-2 bg-white p-6"><h2 className="mb-4 font-semibold text-high">Existing plans</h2>{isLoading ? <p className="text-low">Loading plans…</p> : plans.length === 0 ? <p className="text-low">No plans configured.</p> : <div className="space-y-3">{plans.map((plan) => <div key={plan.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-shade-1 p-4"><div><p className="font-semibold text-high">{plan.name} <span className={`ml-2 rounded-full px-2 py-1 text-xs ${plan.active ? 'bg-green/10 text-green' : 'bg-shade-1 text-low'}`}>{plan.active ? 'Active' : 'Inactive'}</span></p><p className="text-sm text-low">{formatAmount(plan.amount, plan.currency)} · {plan.sessionsPerWeek} sessions/week · {plan.gracePeriodDays} grace days · max carry {plan.maxCarryForwardSessions}</p></div><button type="button" onClick={() => toggle(plan.id, plan.active)} disabled={update.isPending} className="rounded-md border border-shade-2 px-3 py-2 text-sm text-high disabled:opacity-50">{plan.active ? 'Deactivate' : 'Activate'}</button></div>)}</div>}</div></section>;
}
