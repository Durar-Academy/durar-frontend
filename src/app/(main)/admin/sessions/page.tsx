"use client";

import { SessionOperationsTable } from "@/components/shared/session-operations-table";
import { useAttendanceWindow, useUpdateAttendanceWindow } from "@/hooks/useSessionOperations";
import { useEffect, useState } from "react";

export default function AdminSessionsPage() {
  const { data: windowConfig } = useAttendanceWindow();
  const updateWindow = useUpdateAttendanceWindow();
  const [minutes, setMinutes] = useState(60);
  useEffect(() => { if (windowConfig) setMinutes(windowConfig.minutes); }, [windowConfig]);
  return <section className="space-y-5"><div><h1 className="text-2xl font-semibold text-high">Class sessions</h1><p className="text-low">Review bookings, record attendance, and configure the attendance window.</p></div><div className="flex flex-wrap items-end gap-3 rounded-xl border border-shade-2 bg-white p-6"><label className="text-sm text-low">Attendance marking window (minutes)<input type="number" min={0} max={10080} value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} className="mt-1 block h-10 rounded-md border border-shade-2 px-3 text-high" /></label><button type="button" disabled={updateWindow.isPending} onClick={() => updateWindow.mutate(minutes)} className="h-10 rounded-md bg-orange px-4 text-sm text-white disabled:opacity-50">Save setting</button></div><div className="rounded-xl border border-shade-2 bg-white p-6"><SessionOperationsTable canBookStudents canEditTimings /></div></section>;
}
