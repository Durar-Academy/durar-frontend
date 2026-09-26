"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";

import { TopBar } from "@/components/shared/top-bar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ResultsTable } from "@/components/student/result-table";
import { useCurrentUser } from "@/hooks/useAccount";
import { useMyResults } from "@/hooks/useResults";
import type { StudentResult } from "@/lib/result";

function downloadCsv(results: StudentResult[]) {
  const header = ["Course", "Session", "CA", "Exam", "Total", "Grade"];
  const rows = results.map((result) => [result.course.title, result.session, result.ca, result.exam, result.totalScore, result.grade]);
  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "student-results.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function ResultPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const [selectedSession, setSelectedSession] = useState<string | undefined>();
  const { data: results = [], isLoading, isError, error } = useMyResults(selectedSession);
  const { data: allResults = [] } = useMyResults();

  const sessions = useMemo(
    () => Array.from(new Set(allResults.map((result) => result.session))).sort().reverse(),
    [allResults],
  );
  const summary = useMemo(() => {
    const totalScore = results.reduce((sum, result) => sum + result.totalScore, 0);
    const maximumScore = results.length * 100;
    return { totalScore, maximumScore, percentage: maximumScore ? Math.round((totalScore / maximumScore) * 100) : 0 };
  }, [results]);
  const loading = currentUserLoading || isLoading;

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? <Skeleton className="h-[80px] w-full rounded-xl" /> : <TopBar subtext="Check your result" user={user as User}>Result</TopBar>}
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : isError ? (
        <section className="rounded-xl border border-red-200 bg-white px-6 py-14 text-center text-red-600">
          {error instanceof Error ? error.message : "Unable to load your results."}
        </section>
      ) : results.length === 0 ? (
        <section className="flex items-center justify-center rounded-xl border border-shade-2 bg-white py-14">
          <div className="flex flex-col items-center">
            <Image src="/empty-slate.svg" width={250} height={200} alt="Empty Icon" className="scale-90 object-cover object-center" />
            <h3 className="max-w-52 text-center text-lg font-semibold text-high">You have no result at the moment</h3>
          </div>
        </section>
      ) : (
        <section className="flex flex-col gap-6 rounded-xl border border-shade-2 bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Select value={selectedSession ?? "all"} onValueChange={(value) => setSelectedSession(value === "all" ? undefined : value)}>
              <SelectTrigger className="h-10 w-full rounded-lg border border-shade-3 bg-white px-4 py-3 text-base text-high focus:ring-0 sm:w-fit"><SelectValue placeholder="Select Session" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sessions</SelectItem>
                {sessions.map((session) => <SelectItem key={session} value={session}>{session}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="_outline" onClick={() => downloadCsv(results)} className="h-10 w-full whitespace-nowrap bg-white px-4 py-2 text-orange hover:bg-gray-50 sm:w-auto">
              <Download className="h-5 w-5" strokeWidth={3} /><span>Download Report</span>
            </Button>
          </div>

          <ResultsTable results={results} />
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-14">
            <p className="font-semibold"><span className="text-sm text-low">Total Score:</span> <span className="text-base text-high">{summary.totalScore}/{summary.maximumScore}</span></p>
            <p className="font-semibold"><span className="text-sm text-low">Percentage:</span> <span className="text-base text-high">{summary.percentage}%</span></p>
          </div>
        </section>
      )}
    </section>
  );
}
