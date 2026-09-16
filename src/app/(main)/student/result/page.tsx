"use client";

import Image from "next/image";
import { Download } from "lucide-react";

import { TopBar } from "@/components/shared/top-bar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ResultsTable } from "@/components/student/result-table";

import { useCurrentUser } from "@/hooks/useAccount";
import { mockResults } from "@/data2/mockData";

export default function ResultPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

  const results = mockResults;

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={"Check your result"} user={user as User}>
            Result
          </TopBar>
        )}
      </div>

      <div>
        {!!results ? (
          <section className="flex flex-col gap-6 rounded-xl border border-shade-2 bg-white p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Select>
                <SelectTrigger className="h-10 w-full rounded-lg border border-shade-3 bg-white px-4 py-3 text-base text-high focus:ring-0 sm:w-fit">
                  <SelectValue placeholder="Select Session" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem className="capitalize" value={"null"}>
                    2023/2024 Select Session
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={"_outline"}
                className="h-10 w-full whitespace-nowrap bg-white px-4 py-2 text-orange hover:bg-gray-50 sm:w-auto"
              >
                <Download className="h-5 w-5" strokeWidth={3} />
                <span>Download Report</span>
              </Button>
            </div>

            <ResultsTable results={results} />

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-14">
              <p className="font-semibold">
                <span className="text-low text-sm">Average Score:</span>{" "}
                <span className="text-base text-high">250/500</span>
              </p>

              <p className="font-semibold">
                <span className="text-low text-sm">Percentage:</span>{" "}
                <span className="text-base text-high">50%</span>
              </p>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-xl border border-shade-2 flex items-center justify-center py-14">
            <div className="flex flex-col items-center">
              <Image
                src="/empty-slate.svg"
                width={250}
                height={200}
                alt="Empty Icon"
                className="object-cover object-center scale-90"
              />

              <h3 className="text-center max-w-52 text-high text-lg font-semibold">
                You have no result at the moment
              </h3>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
