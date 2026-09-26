"use client";

import { SessionOperationsTable } from "@/components/shared/session-operations-table";

export default function TutorSessionsPage() {
  return <section className="space-y-5"><div><h1 className="text-2xl font-semibold text-high">My class sessions</h1><p className="text-low">Record attendance for your assigned classes.</p></div><div className="rounded-xl border border-shade-2 bg-white p-6"><SessionOperationsTable /></div></section>;
}
