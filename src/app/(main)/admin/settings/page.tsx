"use client";

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Settings, Wallet } from 'lucide-react';
import { TopBar } from '@/components/shared/top-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/hooks/useAccount';
import { useUpdateAdminProfile } from '@/hooks/useAdminSettings';
import { useAdminBillingPlans } from '@/hooks/useBillingPlansAdmin';
import { useReminderSettings, useUpdateReminderSettings } from '@/hooks/useSessionOperations';
import { COUNTRIES, GENDERS, TITLES } from '@/data/constants';

type FormState = { title: string; firstName: string; middleName: string; lastName: string; email: string; gender: string; phone: string; country: string };
const emptyForm: FormState = { title: '', firstName: '', middleName: '', lastName: '', email: '', gender: '', phone: '', country: '' };

export default function AdminSettingsPage() {
  const { data: user, isLoading } = useCurrentUser();
  const { data: plans = [] } = useAdminBillingPlans();
  const { data: reminderSettings } = useReminderSettings();
  const updateReminder = useUpdateReminderSettings();
  const update = useUpdateAdminProfile(user?.id);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [reminders, setReminders] = useState({ subscriptionExpiryReminderDays: 3, classReminderMinutes: 15 });

  useEffect(() => {
    if (!user) return;
    setForm({ title: user.title ?? '', firstName: user.firstName ?? '', middleName: user.middleName ?? '', lastName: user.lastName ?? '', email: user.email ?? '', gender: user.gender ?? '', phone: user.phone ?? '', country: user.country ?? '' });
  }, [user]);

  useEffect(() => {
    if (reminderSettings) setReminders(reminderSettings);
  }, [reminderSettings]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) return toast.error('First name, last name, and email are required.');
    try { await update.mutateAsync({ ...form, firstName: form.firstName.trim(), middleName: form.middleName.trim(), lastName: form.lastName.trim(), email: form.email.trim().toLowerCase(), phone: form.phone.trim() }); toast.success('Admin profile updated'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to update admin profile'); }
  };

  const set = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const saveReminderSettings = async (event: FormEvent) => {
    event.preventDefault();
    try { await updateReminder.mutateAsync(reminders); toast.success('Reminder settings updated'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to update reminder settings'); }
  };
  const input = (key: keyof FormState, label: string, type = 'text') => <label className="text-sm text-low">{label}<input type={type} value={form[key]} onChange={(event) => set(key, event.target.value)} className="mt-1 block h-11 w-full rounded-lg border border-shade-2 px-3 text-high focus:border-orange focus:outline-none" /></label>;

  return <section className="space-y-5"><TopBar subtext="Manage your profile and academy configuration" user={user as User}>Settings</TopBar>{isLoading ? <Skeleton className="h-80 w-full rounded-xl" /> : <><form onSubmit={submit} className="rounded-xl border border-shade-2 bg-white p-6"><div className="mb-5 flex items-center gap-2"><Settings className="h-5 w-5 text-orange" /><h1 className="text-xl font-semibold text-high">Profile Settings</h1></div><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{input('firstName', 'First name')}{input('lastName', 'Last name')}{input('middleName', 'Middle name')}{input('email', 'Email', 'email')}{input('phone', 'Phone')}{input('country', 'Country')}</div><div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"><label className="text-sm text-low">Title<select value={form.title} onChange={(event) => set('title', event.target.value)} className="mt-1 block h-11 w-full rounded-lg border border-shade-2 px-3 text-high"><option value="">Select title</option>{TITLES.map((title) => <option key={title} value={title}>{title}</option>)}</select></label><label className="text-sm text-low">Gender<select value={form.gender} onChange={(event) => set('gender', event.target.value)} className="mt-1 block h-11 w-full rounded-lg border border-shade-2 px-3 text-high"><option value="">Select gender</option>{GENDERS.map((gender) => <option key={gender} value={gender.toLowerCase()}>{gender}</option>)}</select></label></div><button disabled={update.isPending} className="mt-6 rounded-lg bg-orange px-5 py-2.5 text-white disabled:opacity-50">{update.isPending ? 'Saving…' : 'Save changes'}</button></form><form onSubmit={saveReminderSettings} className="rounded-xl border border-shade-2 bg-white p-6"><div className="mb-4"><h2 className="text-xl font-semibold text-high">Notification settings</h2><p className="mt-1 text-sm text-low">Configure when learners receive subscription and class reminders.</p></div><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><label className="text-sm text-low">Subscription expiry reminder (days before expiry)<input type="number" min={1} max={30} value={reminders.subscriptionExpiryReminderDays} onChange={(event) => setReminders((current) => ({ ...current, subscriptionExpiryReminderDays: Number(event.target.value) }))} className="mt-1 block h-11 w-full rounded-lg border border-shade-2 px-3 text-high" /></label><label className="text-sm text-low">Class reminder (minutes before class)<input type="number" min={10} max={20} value={reminders.classReminderMinutes} onChange={(event) => setReminders((current) => ({ ...current, classReminderMinutes: Number(event.target.value) }))} className="mt-1 block h-11 w-full rounded-lg border border-shade-2 px-3 text-high" /></label></div><button disabled={updateReminder.isPending} className="mt-5 rounded-lg bg-orange px-5 py-2.5 text-white disabled:opacity-50">{updateReminder.isPending ? 'Saving…' : 'Save notification settings'}</button></form><div className="rounded-xl border border-shade-2 bg-white p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><div className="flex items-center gap-2"><Wallet className="h-5 w-5 text-orange" /><h2 className="text-xl font-semibold text-high">Billing plans</h2></div><p className="mt-2 text-sm text-low">Configure the flat subscription price, weekly sessions, grace period, and carry-forward policy.</p><p className="mt-2 text-sm text-high">{plans.filter((plan) => plan.active).length} active plan(s) configured</p></div><Link href="/admin/billing-plans" className="rounded-lg bg-orange px-4 py-2.5 text-sm text-white">Manage billing plans</Link></div></div></>}</section>;
}
