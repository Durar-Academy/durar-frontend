"use client";

import { useState } from "react";
import { useBookSessionForStudent, useCancelSessionOccurrence, useMarkSessionAttendance, useReviewSessionAbsence, useSessionOccurrences } from "@/hooks/useSessionOperations";
import type { SessionAttendanceStatus } from "@/lib/session-operations";

const statuses: SessionAttendanceStatus[] = ["present", "late", "absent", "excused"];

export function SessionOperationsTable({ canBookStudents = false }: { canBookStudents?: boolean }) {
  const { data: occurrences = [], isLoading, error } = useSessionOccurrences();
  const attendance = useMarkSessionAttendance();
  const cancel = useCancelSessionOccurrence();
  const review = useReviewSessionAbsence();
  const book = useBookSessionForStudent();
  const [message, setMessage] = useState("");
  const [studentIds, setStudentIds] = useState<Record<string, string>>({});

  if (isLoading) return <p className="text-low">Loading sessions…</p>;
  if (error) return <p className="text-red-600">Unable to load sessions.</p>;

  return (
    <div className="space-y-4">
      {message && <p className="rounded-lg bg-green/10 p-3 text-sm text-green">{message}</p>}
      {occurrences.length === 0 ? <p className="text-low">No class sessions found.</p> : occurrences.map((occurrence) => (
        <div key={occurrence.id} className="rounded-xl border border-shade-2 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-semibold text-high">{occurrence.course?.title ?? "Class session"}</h3>
              <p className="text-sm text-low">{new Date(occurrence.scheduledStart).toLocaleString()} – {new Date(occurrence.scheduledEnd).toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center gap-2"><span className="rounded-full bg-shade-1 px-3 py-1 text-xs capitalize">{occurrence.status}</span>{occurrence.status === 'scheduled' && <button type="button" disabled={cancel.isPending} onClick={() => cancel.mutate({ occurrenceId: occurrence.id, reason: 'Cancelled by academy' })} className="rounded-md border border-danger px-2 py-1 text-xs text-danger">Cancel class</button>}</div>
          </div>
          {canBookStudents && occurrence.bookings.length === 0 && <div className="mb-3 flex gap-2"><input value={studentIds[occurrence.id] ?? ''} onChange={(event) => setStudentIds((current) => ({ ...current, [occurrence.id]: event.target.value }))} placeholder="Student ID" className="h-8 flex-1 rounded-md border border-shade-2 px-2 text-xs" /><button type="button" disabled={!studentIds[occurrence.id] || book.isPending} onClick={() => book.mutate({ occurrenceId: occurrence.id, studentId: studentIds[occurrence.id] }, { onSuccess: () => setMessage('Student booked successfully.') })} className="rounded-md bg-orange px-3 py-1 text-xs text-white disabled:opacity-50">Book student</button></div>}
          {occurrence.bookings.length === 0 ? <p className="text-sm text-low">No students booked.</p> : occurrence.bookings.map((booking) => {
            const name = [booking.student?.firstName, booking.student?.lastName].filter(Boolean).join(" ") || booking.student?.email || "Student";
            return <div key={booking.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-shade-1 py-3">
              <span className="text-sm text-high">{name} <span className="text-low">({booking.attendance?.status ?? booking.status})</span></span>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => <button key={status} type="button" disabled={attendance.isPending} onClick={() => attendance.mutate({ bookingId: booking.id, status }, { onSuccess: () => setMessage("Attendance updated."), onError: () => setMessage("Attendance could not be updated.") })} className="rounded-md border border-shade-2 px-2 py-1 text-xs capitalize hover:border-orange disabled:opacity-50">{status}</button>)}
                {booking.absence?.status === 'pending' && <><button type="button" disabled={review.isPending} onClick={() => review.mutate({ absenceId: booking.absence!.id, approved: true }, { onSuccess: () => setMessage('Absence approved.') })} className="rounded-md border border-green px-2 py-1 text-xs text-green">Approve absence</button><button type="button" disabled={review.isPending} onClick={() => review.mutate({ absenceId: booking.absence!.id, approved: false }, { onSuccess: () => setMessage('Absence rejected.') })} className="rounded-md border border-danger px-2 py-1 text-xs text-danger">Reject absence</button></>}
              </div>
            </div>;
          })}
        </div>
      ))}
    </div>
  );
}
