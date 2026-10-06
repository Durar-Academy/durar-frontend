"use client";

import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

import { Skeleton } from "@/components/ui/skeleton";
import { UserOverviewCard } from "@/components/admin/user-overview-card";

import { useAddSessionCredit, useStudent, useStudentSessionWallet } from "@/hooks/useAdmin";

export default function StudentManagementPage() {
  const { studentId } = useParams();

  const { data: student, isLoading: studentLoading } = useStudent(studentId as string);
  const { data: wallet } = useStudentSessionWallet(studentId as string);
  const addCredit = useAddSessionCredit();
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");

  function submitCredit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reason.trim()) return toast.error("A reason is required.");
    addCredit.mutate({
      studentId: studentId as string,
      quantity,
      reason: reason.trim(),
      idempotencyKey: crypto.randomUUID(),
    }, {
      onSuccess: () => { setReason(""); toast.success("Session credit added."); },
      onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to add session credit."),
    });
  }

  return (
    <div className="space-y-5">
      {studentLoading ? <Skeleton className="h-[200px] rounded-xl" /> : <UserOverviewCard user={student} />}
      <section className="rounded-xl bg-white p-6 dashboard-shadow">
        <h2 className="font-semibold text-high">Session credits</h2>
        <p className="mt-1 text-sm text-low">Available: {wallet?.available ?? 0} · Reserved: {wallet?.reserved ?? 0} · Used: {wallet?.used ?? 0}</p>
        <form onSubmit={submitCredit} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-sm text-low">Credits<input type="number" min={1} max={100} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="mt-1 block w-24 rounded-md border p-2 text-high" /></label>
          <label className="min-w-56 flex-1 text-sm text-low">Reason<input required value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1 block w-full rounded-md border p-2 text-high" placeholder="Approved make-up session" /></label>
          <button type="submit" disabled={addCredit.isPending} className="rounded-md bg-orange px-4 py-2 text-sm text-white disabled:opacity-50">{addCredit.isPending ? "Adding..." : "Add credit"}</button>
        </form>
      </section>
    </div>
  );
}
