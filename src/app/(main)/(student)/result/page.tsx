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
import { mockResults } from "@/data/mockData";

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
          <section className="bg-white rounded-xl border border-shade-2 p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <Select>
                <SelectTrigger className="w-fit h-10 text-high bg-white border border-shade-3 rounded-lg text-base px-4 py-3 focus:ring-0">
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
                className="bg-white hover:bg-gray-50 text-orange px-4 py-2 h-10"
              >
                <Download className="w-6 h-6" strokeWidth={3} />
                <span>Download Report</span>
              </Button>
            </div>

            <ResultsTable results={results} />

            <div className="flex items-center gap-14">
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
