"use client";

import { useState } from "react";
import { TopBar } from "@/components/shared/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAccount";
import { useAcademicSessions, useArchiveAcademicSession, useCreateAcademicSession } from "@/hooks/useAcademicSessions";

export default function AcademicSessionsPage() {
  const { data: user } = useCurrentUser(); const { data: sessions = [], isLoading } = useAcademicSessions();
  const create = useCreateAcademicSession(); const archive = useArchiveAcademicSession();
  const [name, setName] = useState("");
  async function submit(event: React.FormEvent) { event.preventDefault(); await create.mutateAsync({ name }); setName(""); }
  return <section className="space-y-5"><TopBar subtext="Configure continuous academic sessions used for results" user={user as User}>Academic Sessions</TopBar><section className="rounded-xl border border-shade-2 bg-white p-6"><h1 className="mb-4 text-xl font-semibold text-high">Add academic session</h1><p className="mb-4 text-sm text-low">Sessions are continuous and do not have holidays or end dates.</p><form onSubmit={submit} className="flex max-w-xl gap-3"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Quran Studies 2026" required /><Button disabled={create.isPending}>Create session</Button></form></section><section className="rounded-xl border border-shade-2 bg-white p-6"><h2 className="mb-4 text-xl font-semibold text-high">Active sessions</h2>{isLoading ? <Skeleton className="h-24 w-full rounded-xl" /> : sessions.length === 0 ? <p className="text-sm text-low">No academic sessions configured.</p> : <div className="space-y-3">{sessions.map((session) => <div key={session.id} className="flex items-center justify-between rounded-lg bg-offwhite p-4"><p className="font-medium text-high">{session.name}</p><Button variant="outline" onClick={() => archive.mutate(session.id)} disabled={archive.isPending}>Archive</Button></div>)}</div>}</section></section>;
}
