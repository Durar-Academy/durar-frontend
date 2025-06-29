"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { QuizFormProvider } from "@/contexts/tutor-quiz-form-provider";

import { useCurrentUser } from "@/hooks/useAccount";
import { cn } from "@/lib/utils";
import { quizLinks } from "@/data2/constants";
import { Top_Bar } from "@/components/tutor/top-bar";

export default function AddNewQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

  return (
    <section className="flex flex-col gap-3">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <Top_Bar subtext={"Add New Quiz"} user={user as User}>
            <p className="flex items-center gap-1">Assignments</p>
          </Top_Bar>
        )}
      </div>

      <div className="flex h-[720px] gap-5">
        <div className="w-full h-full max-w-[220px] bg-white rounded-xl border border-shade-2 text-sm shrink-0 lg:flex flex-col gap-4 p-6 hidden">
          {quizLinks.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              className={cn(
                "flex items-center gap-2 text-low hover:underline",

                pathname === link.url && "text-orange"
              )}
            >
              {React.createElement(link.icon, {
                key: "icon",
                className: "w-4 h-4",
              })}

              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="w-full h-full">
          {<QuizFormProvider>{children}</QuizFormProvider>}
        </div>
      </div>
    </section>
  );
}
