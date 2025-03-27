"use client";

import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";

import { useCurrentUser } from "@/hooks/useAccount";

export default function ResultPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

  const result = null;

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
        {!!result ? (
          <>Your Result</>
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
