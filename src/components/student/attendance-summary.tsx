"use client";

import { CalendarCheck, CheckCircle2, Clock3, XCircle } from "lucide-react";

type AttendanceBooking = {
  id: string;
  status: string;
  occurrence?: { scheduledStart?: string; course?: { title?: string } };
  attendance?: { status: "present" | "late" | "absent" | "excused" } | null;
};

const labels: Record<string, string> = { present: "Present", late: "Late", absent: "Absent", excused: "Excused", no_show: "No show", booked: "Awaiting attendance", attended: "Attended", excused_absence: "Excused absence" };

export function AttendanceSummary({ bookings, loading = false }: { bookings: AttendanceBooking[]; loading?: boolean }) {
  const counts = bookings.reduce((summary, booking) => {
    const status = booking.attendance?.status ?? booking.status;
    if (status === "present" || status === "attended") summary.present += 1;
    else if (status === "late") summary.late += 1;
    else if (status === "excused" || status === "excused_absence") summary.excused += 1;
    else if (status === "absent" || status === "no_show") summary.absent += 1;
    return summary;
  }, { present: 0, late: 0, excused: 0, absent: 0 });
  const recorded = counts.present + counts.late + counts.excused + counts.absent;
  const percentage = recorded ? Math.round(((counts.present + counts.late) / recorded) * 100) : 0;

  return <section className="rounded-xl border border-shade-2 bg-white p-6">
    <div className="mb-5 flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-lg font-semibold text-high"><CalendarCheck className="h-5 w-5 text-orange" />Attendance</h2><span className="rounded-full bg-orange/10 px-3 py-1 text-sm font-medium text-orange">{percentage}% attendance</span></div>
    {loading ? <div className="h-20 animate-pulse rounded-lg bg-offwhite" /> : <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Metric icon={<CheckCircle2 className="h-4 w-4" />} label="Present" value={counts.present} tone="text-green" /><Metric icon={<Clock3 className="h-4 w-4" />} label="Late" value={counts.late} tone="text-orange" /><Metric icon={<XCircle className="h-4 w-4" />} label="Absent" value={counts.absent} tone="text-danger" /><Metric icon={<CheckCircle2 className="h-4 w-4" />} label="Excused" value={counts.excused} tone="text-blue-600" /></div>
      <div className="mt-5 space-y-2">{bookings.length === 0 ? <p className="rounded-lg bg-offwhite p-4 text-sm text-low">Your attendance history will appear after you book a session.</p> : bookings.slice().reverse().slice(0, 10).map((booking) => { const status = booking.attendance?.status ?? booking.status; return <div key={booking.id} className="flex items-center justify-between gap-3 rounded-lg bg-offwhite px-4 py-3 text-sm"><div><p className="font-medium text-high">{booking.occurrence?.course?.title ?? "Class session"}</p><p className="text-xs text-low">{booking.occurrence?.scheduledStart ? new Date(booking.occurrence.scheduledStart).toLocaleString() : "Session date unavailable"}</p></div><span className="rounded-full border border-shade-2 bg-white px-3 py-1 text-xs text-low">{labels[status] ?? status.replaceAll("_", " ")}</span></div>; })}</div>
    </>}
  </section>;
}

function Metric({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: string }) {
  return <div className="rounded-lg bg-offwhite p-3"><div className={`flex items-center gap-2 text-xs ${tone}`}>{icon}{label}</div><p className="mt-1 text-xl font-semibold text-high">{value}</p></div>;
}
