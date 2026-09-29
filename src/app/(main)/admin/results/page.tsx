"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

import { TopBar } from "@/components/shared/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAccount";
import { useCourses, useStudents } from "@/hooks/useAdmin";
import { useCourseResults, useCreateResult, useDeleteResult, useUpdateResult } from "@/hooks/useAdminResults";
import { useResultWorkflow } from "@/hooks/useResultWorkflow";
import { useAcademicSessions } from "@/hooks/useAcademicSessions";

export default function AdminResultsPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: courses = [], isLoading: coursesLoading } = useCourses({ status: "published", page: 1, limit: 100 });
  const { data: students = [], isLoading: studentsLoading } = useStudents({ status: "active", page: 1, limit: 100 });
  const [courseId, setCourseId] = useState("");
  const [session, setSession] = useState("");
  const { data: academicSessions = [] } = useAcademicSessions();
  const [studentId, setStudentId] = useState("");
  const [ca, setCa] = useState("");
  const [exam, setExam] = useState("");
  const { data: results = [], isLoading: resultsLoading, isError } = useCourseResults(courseId, session);
  const createMutation = useCreateResult();
  const deleteMutation = useDeleteResult();
  const updateMutation = useUpdateResult();
  const workflowMutation = useResultWorkflow();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCa, setEditingCa] = useState("");
  const [editingExam, setEditingExam] = useState("");

  const selectedStudent = useMemo(() => students.find((student) => student.id === studentId), [students, studentId]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!studentId || !courseId || !session) return;
    await createMutation.mutateAsync({ studentId, courseId, session, ca: Number(ca), exam: Number(exam) });
    setStudentId("");
    setCa("");
    setExam("");
  }

  async function handleUpdate(id: string) {
    await updateMutation.mutateAsync({ id, payload: { ca: Number(editingCa), exam: Number(editingExam) } });
    setEditingId(null);
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {userLoading ? <Skeleton className="h-[80px] w-full rounded-xl" /> : <TopBar subtext="Review and manage student scores" user={user as User}>Results</TopBar>}
      </div>

      <section className="rounded-xl border border-shade-2 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-high">Result filters</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger><SelectValue placeholder={coursesLoading ? "Loading courses..." : "Select course"} /></SelectTrigger>
            <SelectContent>{courses.map((course) => <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={session} onValueChange={setSession}><SelectTrigger><SelectValue placeholder="Select academic session" /></SelectTrigger><SelectContent>{academicSessions.map((item) => <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>)}</SelectContent></Select>
        </div>
      </section>

      <section className="rounded-xl border border-shade-2 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-high">Add result</h2>
        <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-5">
          <Select value={studentId} onValueChange={setStudentId}>
            <SelectTrigger><SelectValue placeholder={studentsLoading ? "Loading students..." : "Select student"} /></SelectTrigger>
            <SelectContent>{students.map((student) => <SelectItem key={student.id} value={student.id}>{student.firstName} {student.lastName}</SelectItem>)}</SelectContent>
          </Select>
          <Input value={ca} onChange={(event) => setCa(event.target.value)} type="number" min={0} max={30} placeholder="CA / 30" required />
          <Input value={exam} onChange={(event) => setExam(event.target.value)} type="number" min={0} max={70} placeholder="Exam / 70" required />
          <div className="flex items-center text-sm text-low">{selectedStudent?.email ?? "Select a student"}</div>
          <Button type="submit" disabled={!courseId || !session || !studentId || createMutation.isPending}>Save result</Button>
        </form>
        {createMutation.isError && <p className="mt-3 text-sm text-red-600">Unable to save result. Check the student, course, session, and score values.</p>}
      </section>

      <section className="rounded-xl border border-shade-2 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-high">Course results</h2>
        {!courseId || !session ? <p className="text-sm text-low">Select a course and enter an academic session to view results.</p> : resultsLoading ? <Skeleton className="h-32 w-full rounded-xl" /> : isError ? <p className="text-sm text-red-600">Unable to load course results.</p> : results.length === 0 ? <p className="text-sm text-low">No results have been entered for this course and session.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm"><thead><tr className="border-b text-low"><th className="p-3">Student</th><th className="p-3">CA</th><th className="p-3">Exam</th><th className="p-3">Total</th><th className="p-3">Grade</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
              <tbody>{results.map((result) => <tr key={result.id} className="border-b bg-offwhite"><td className="p-3">{result.student.firstName} {result.student.lastName}</td><td className="p-3">{editingId === result.id ? <Input className="w-20" type="number" min={0} max={30} value={editingCa} onChange={(event) => setEditingCa(event.target.value)} /> : result.ca}</td><td className="p-3">{editingId === result.id ? <Input className="w-20" type="number" min={0} max={70} value={editingExam} onChange={(event) => setEditingExam(event.target.value)} /> : result.exam}</td><td className="p-3">{result.totalScore}</td><td className="p-3 uppercase">{result.grade}</td><td className="p-3 capitalize">{result.status}</td><td className="flex gap-1 p-3">
                {editingId === result.id ? <><Button type="button" size="sm" disabled={updateMutation.isPending} onClick={() => handleUpdate(result.id)}>Save</Button><Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button></> : result.status !== "locked" && <Button type="button" size="sm" variant="outline" onClick={() => { setEditingId(result.id); setEditingCa(String(result.ca)); setEditingExam(String(result.exam)); }}>Edit</Button>}
                {result.status === "draft" && <Button type="button" size="sm" disabled={workflowMutation.isPending} onClick={() => workflowMutation.mutate({ id: result.id, action: "publish" })}>Publish</Button>}
                {result.status === "submitted" && <Button type="button" size="sm" disabled={workflowMutation.isPending} onClick={() => workflowMutation.mutate({ id: result.id, action: "publish" })}>Publish</Button>}
                {result.status === "published" && <Button type="button" size="sm" variant="outline" disabled={workflowMutation.isPending} onClick={() => workflowMutation.mutate({ id: result.id, action: "lock" })}>Lock</Button>}
                {result.status !== "locked" && <Button type="button" variant="ghost" size="icon" aria-label="Delete result" disabled={deleteMutation.isPending} onClick={() => { if (window.confirm("Delete this result?")) deleteMutation.mutate(result.id); }}><Trash2 className="h-4 w-4 text-red-600" /></Button>}
              </td></tr>)}</tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
