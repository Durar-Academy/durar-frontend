"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";
import { useCurrentUser } from "@/hooks/useAccount";
import { useClassOccurrences, useRequestClassAbsence, useSessionBookings, useSessionWallet } from "@/hooks/useSubscription";

export default function StudentSessionsPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: wallet, isLoading: walletLoading } = useSessionWallet();
  const { data: bookings, isLoading: bookingsLoading } = useSessionBookings();
  const { data: occurrences, isLoading: occurrencesLoading } = useClassOccurrences();
  const absence = useRequestClassAbsence();

  return <section className="flex flex-col gap-5">
    {userLoading ? <Skeleton className="h-20 w-full rounded-xl" /> : <TopBar subtext="Your weekly class allowance" user={user as User}>Sessions</TopBar>}
    {walletLoading ? <Skeleton className="h-32 w-full rounded-xl" /> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{[['Allocated', wallet?.allocated ?? 0], ['Carried in', wallet?.carriedIn ?? 0], ['Booked', wallet?.used ?? 0], ['Available', wallet?.available ?? 0], ['Reserved', wallet?.reserved ?? 0]].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-white p-5 dashboard-shadow"><p className="text-sm text-low">{label}</p><p className="mt-2 text-2xl font-semibold text-high">{value}</p></div>)}</div>}
    <div className="rounded-xl bg-white p-6 dashboard-shadow"><h2 className="mb-4 font-semibold text-high">Available sessions</h2>{occurrencesLoading ? <Skeleton className="h-24 w-full" /> : occurrences?.length ? <div className="space-y-3">{occurrences.map((occurrence: any) => { const booking = occurrence.bookings?.[0]; const automaticStatus = occurrence.autoChargeStatus ?? 'pending'; const canRequestAbsence = booking?.status === 'booked' && !booking.absence && new Date(occurrence.scheduledStart).getTime() > Date.now(); return <div key={occurrence.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-offwhite p-4"><div><p className="font-medium text-high">{occurrence.course?.title ?? 'Course'}</p><p className="text-sm text-low">{new Date(occurrence.scheduledStart).toLocaleString()}</p></div>{booking ? <div className="flex items-center gap-2"><span className="capitalize text-sm text-low">{String(booking.status).replace('_', ' ')}</span>{canRequestAbsence && <button type="button" onClick={() => { const reason = window.prompt('Why do you need to request absence?'); if (reason) absence.mutate({ bookingId: booking.id, reason }); }} className="rounded-md border border-orange px-3 py-1 text-xs text-orange">Request absence</button>}</div> : <span className="text-sm text-low">{automaticStatus === 'insufficient_credit' ? 'Credit required' : automaticStatus === 'failed' ? 'Automatic booking needs admin review' : 'Automatic booking pending'}</span>}</div>; })}</div> : <p className="text-low">No enrolled course sessions are available.</p>}</div>
    <div className="rounded-xl bg-white p-6 dashboard-shadow"><h2 className="mb-4 font-semibold text-high">Bookings & attendance</h2>{bookingsLoading ? <Skeleton className="h-24 w-full" /> : bookings?.length ? <div className="space-y-3">{bookings.map((booking: any) => <div key={booking.id} className="flex items-center justify-between rounded-lg bg-offwhite p-4"><div><p className="font-medium text-high">{booking.occurrence?.course?.title ?? 'Course'}</p><p className="text-sm text-low">{booking.occurrence?.scheduledStart ? new Date(booking.occurrence.scheduledStart).toLocaleString() : '—'}</p></div><span className="capitalize text-sm text-low">{String(booking.attendance?.status ?? booking.status).replaceAll('_', ' ')}</span></div>)}</div> : <p className="text-low">No class bookings yet.</p>}</div>
  </section>;
}
