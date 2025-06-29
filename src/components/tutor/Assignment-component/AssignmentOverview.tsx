"use client";
import React, { ReactNode } from "react";
import AssignmentStatCard from "../AssignmentStatCard";

interface DataStructure {
  img: string;
  title: string; // example: "2025-04-09"
  amount: number;
}

interface overviewProps {
  overview: boolean;
  title: string;
  data: DataStructure[];
  children: ReactNode;
}
const AssignmentOverview = ({ title, data, children }: overviewProps) => {
  return (
    <div className="flex flex-col gap-4  border border-shade-3 rounded-xl bg-white p-6 w-full">
      <header className="flex items-center gap-3">
        <h1 className="text-xl font-medium">{title} </h1>
        <span className="flex-1"></span>
        {children}
      </header>
      <div
        className={`grid ${
          data.length === 3 ? "grid-cols-3" : "grid-cols-4"
        } gap-[18px]`}
      >
        {data.map((stat, i) => (
          <AssignmentStatCard key={i} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default AssignmentOverview;
