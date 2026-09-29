"use client";

import { useMemo, useState } from "react";

import { Top_Bar } from "@/components/tutor/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAccount";
import { useTutorCourseResults, useTutorCreateResult, useTutorResultRoster, useTutorSubmitResult } from "@/hooks/useTutorResults";
import { useAcademicSessions } from "@/hooks/useAcademicSessions";

export default function TutorResultsPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: roster = [], isLoading: rosterLoading } = useTutorResultRoster();
  const [courseId, setCourseId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [session, setSession] = useState("");
  const { data: academicSessions = [] } = useAcademicSessions();
  const [ca, setCa] = useState("");
  const [exam, setExam] = useState("");
  const createMutation = useTutorCreateResult();
  const submitMutation = useTutorSubmitResult();
  const { data: results = [], isLoading: resultsLoading } = useTutorCourseResults(courseId, session);

  const courses = useMemo(() => Array.from(new Map(roster.map((entry) => [entry.course.id, entry.course])).values()), [roster]);
  const students = useMemo(() => roster.filter((entry) => entry.course.id === courseId), [roster, courseId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!courseId || !studentId || !session) return;
    await createMutation.mutateAsync({ studentId, courseId, session, ca: Number(ca), exam: Number(exam) });
    setStudentId("");
    setCa("");
    setExam("");
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">{userLoading ? <Skeleton className="h-[80px] w-full rounded-xl" /> : <Top_Bar subtext="Enter student results" user={user as User}>Results</Top_Bar>}</div>
      <section className="rounded-xl border border-shade-2 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-high">Result details</h2>
        {rosterLoading ? <Skeleton className="h-24 w-full rounded-xl" /> : <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-5">
          <Select value={courseId} onValueChange={(value) => { setCourseId(value); setStudentId(""); }}><SelectTrigger><SelectValue placeholder="Select assigned course" /></SelectTrigger><SelectContent>{courses.map((course) => <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>)}</SelectContent></Select>
          <Select value={studentId} onValueChange={setStudentId}><SelectTrigger><SelectValue placeholder="Select enrolled student" /></SelectTrigger><SelectContent>{students.map((entry) => <SelectItem key={entry.userId} value={entry.userId}>{entry.user.firstName} {entry.user.lastName}</SelectItem>)}</SelectContent></Select>
          <Select value={session} onValueChange={setSession}><SelectTrigger><SelectValue placeholder="Select academic session" /></SelectTrigger><SelectContent>{academicSessions.map((item) => <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>)}</SelectContent></Select>
          <Input value={ca} onChange={(event) => setCa(event.target.value)} type="number" min={0} max={30} placeholder="CA / 30" required />
          <Input value={exam} onChange={(event) => setExam(event.target.value)} type="number" min={0} max={70} placeholder="Exam / 70" required />
          <Button type="submit" disabled={!courseId || !studentId || !session || createMutation.isPending}>Save draft</Button>
        </form>}
        {createMutation.isError && <p className="mt-3 text-sm text-red-600">Unable to save this result. Confirm the student is enrolled in the selected course.</p>}
      </section>
      <section className="rounded-xl border border-shade-2 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-high">Existing results</h2>
        {!courseId || !session ? <p className="text-sm text-low">Select a course and session to review results.</p> : resultsLoading ? <Skeleton className="h-32 w-full rounded-xl" /> : results.length === 0 ? <p className="text-sm text-low">No results found for this course and session.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-low"><th className="p-3">Student</th><th className="p-3">CA</th><th className="p-3">Exam</th><th className="p-3">Total</th><th className="p-3">Grade</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{results.map((result) => <tr key={result.id} className="border-b bg-offwhite"><td className="p-3">{result.student.firstName} {result.student.lastName}</td><td className="p-3">{result.ca}</td><td className="p-3">{result.exam}</td><td className="p-3">{result.totalScore}</td><td className="p-3 uppercase">{result.grade}</td><td className="p-3 capitalize">{result.status}</td><td className="p-3">{result.status === "draft" && <Button type="button" size="sm" disabled={submitMutation.isPending} onClick={() => submitMutation.mutate(result.id)}>Submit</Button>}</td></tr>)}</tbody></table></div>}
      </section>
    </section>
  );
}
