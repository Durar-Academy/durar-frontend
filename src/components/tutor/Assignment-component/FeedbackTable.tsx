"use client";

import { useState } from "react";
import Image from "next/image";

interface feedback {
  comment: string;
  date: string; // example: "2025-04-09"
  name: string;
}

interface feedbackTableProps {
  feedbacks: feedback[];
}

export default function FeedbackTable({ feedbacks }: feedbackTableProps) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredfeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.comment.toLowerCase().includes(search.toLowerCase()) ||
      feedback.name.toLowerCase().includes(search.toLowerCase());

    const matchesDate = dateFilter === "" || feedback.date === dateFilter;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center w-full gap-3">
        <h2 className="text-xl text-high">Student Feedback</h2>
        <span className="flex-1"></span>

        {/* Search Box */}
        <div className="h-11 rounded-lg border-[#D2D4E0] border-[1px] flex items-center justify-center p-3 w-[10rem]">
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[7rem] border-none outline-none text-sm"
          />
          <Image
            src="/SVGs/searchIcon.svg"
            alt="search Icon"
            width={16}
            height={16}
          />
        </div>

        {/* Date Filter Input */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-11 border rounded-lg px-3 text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="text-sm min-w-full bg-white border-none border-separate border-spacing-y-3">
          <tbody>
            {filteredfeedbacks.map((feedback, i) => (
              <tr
                key={i}
                className="border-[1px] bg-[#F8F8FA] border-[#D2D4E0] mt-3"
              >
                <td className="text-base py-4 pl-3 border-[1px] border-[#D2D4E0] rounded-l-xl border-r-0">
                  <p className="text-base font-semibold mb-4">{feedback.name}</p>
                  {feedback.comment}
                </td>

                <td className="text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl text-orange cursor-pointer hover:underline">
                  <p className="text-sm text-high flex items-center gap-1">
                    <Image
                      src={"/SVGs/dateIcon.svg"}
                      alt="Date Icon"
                      height={16}
                      width={16}
                    />
                    {feedback.date}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
