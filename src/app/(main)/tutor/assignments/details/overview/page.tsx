"use client";
import AssignmentTable from "@/components/tutor/Assignment-component/AssignmentListTable";
import AssignmentOverview from "@/components/tutor/Assignment-component/AssignmentOverview";
import DescriptionSection from "@/components/tutor/Assignment-component/DescriptionSection";
import FeedbackTable from "@/components/tutor/Assignment-component/FeedbackTable";
import SubmissionLists from "@/components/tutor/Assignment-component/SubmissionList";
import { Top_Bar } from "@/components/tutor/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { AssignmentStatData, OverviewData } from "@/data2/constants";
import { useCurrentUser } from "@/hooks/useAccount";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);

  interface StatDataInterface {
    title: string;
    img: string;
    amount: number;
  }

  const AssignmentListData = [
    {
      title: "Surah Al-Baqarah Memorization",
      course: "Quran Memorization",
      status: "Completed" as "Completed",
      due_date: "Feb 25, 2025",
      submission: 18,
    },
    {
      title: "Surah Al-fatiha Memorization",
      course: "Nahwu",
      status: "Completed" as "Completed",
      due_date: "Feb 24, 2024",
      submission: 18,
    },
    {
      title: "Surah Al-fatiha Memorization",
      course: "Quran Memorization",
      status: "Pending" as "Pending",
      due_date: "Feb 24, 2024",
      submission: 18,
    },
    {
      title: "Surah Al-fatiha Memorization",
      course: "Sorf",
      status: "Pending" as "Pending",
      due_date: "Feb 24, 2024",
      submission: 18,
    },
  ];

  const SubmissionListData = [
    {
      studentName: "Adam Abdullahi Jibreal",
      status: "Submitted" as "Submitted",
      SubmissionDate: "Jan 10 2025",
      grade: "87",
    },
    {
      studentName: "Usman Abdullahi",
      status: "Pending" as "Pending",
      SubmissionDate: "Jan 10 2025",
      grade: "67",
    },
    {
      studentName: "Yusuf saheed",
      status: "Submitted" as "Submitted",
      SubmissionDate: "Dec 10 2025",
      grade: "90",
    },
  ];

  const feedbackData = [
    {
      name: "Usman Abdullahi",
      comment: "You need to improve on your pronunciation",
      date: "Mar 25, 2025",
    },
    {
      name: "Adam saheed",
      comment: "You need to improve on your pronunciation",
      date: "Feb 25, 2024",
    },
    {
      name: "Soliu AhmadDD",
      comment: "You need to improve on your pronunciation",
      date: "Mar 26, 2024",
    },
  ];

  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

  return (
    <section className="flex flex-col gap-3">
      {currentUserLoading ? (
        <Skeleton className="w-full rounded-xl h-[80px]" />
      ) : (
        <Top_Bar subtext="Tajweed Rules - Assignment 1" user={user as User}>
          <p className="flex items-center gap-1">
            {"Assignment > View Details"}
          </p>
        </Top_Bar>
      )}
      <section className="stats">
        {loading ? (
          <Skeleton className="w-full rounded-xl h-[140px]" />
        ) : (
          <AssignmentOverview
            title="Assignment Overview"
            data={AssignmentStatData}
            overview={true}
          >
            <div className="flex gap-3 items-center">
              <button className="text-orange flex items-center gap-1">
                <Image
                  src={"/SVGs/edit.svg"}
                  alt="delete Icon"
                  height={17}
                  width={17}
                />
                Edit
              </button>
              <button className="text-red-500 gap-1 flex items-center">
                <Image
                  src={"/SVGs/delete.svg"}
                  alt="delete Icon"
                  height={17}
                  width={17}
                />
                Delete
              </button>
            </div>
          </AssignmentOverview>
        )}
      </section>
      <section className="p-6 rounded-xl bg-white border border-shade-2 flex flex-col gap-3">
        <header className="bg-[#F8F8FA] rounded-xl border border-shade-3 p-4 flex items-center gap-4 relative">
          {OverviewData.map((overview, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`${
                active == i ? "text-orange" : ""
              } flex gap-1 items-center`}
            >
              <Image
                src={active == i ? overview.activeImage : overview.img}
                height={16}
                width={16}
                alt="overview icon"
              />
              {overview.text}
              <p
                className={`${
                  active == i ? "" : "hidden"
                } -bottom-0 w-12 h-0.5 bg-orange absolute ml-6`}
              ></p>
            </button>
          ))}
        </header>

        {active == 0 ? (
          <DescriptionSection />
        ) : active == 1 ? (
          <SubmissionLists SubmissionList={SubmissionListData} />
        ) : (
          <FeedbackTable feedbacks={feedbackData} />
        )}
      </section>
    </section>
  );
};

export default Page;
