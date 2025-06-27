import React from "react";
import AssignmentStatCard from "./Assignment-component/AssignmentStatCard";
import AssignmentTable from "./Profile-component/AssignmentTable";

const Assignment = () => {
  const assignment = [
    {
      course: "001",
      date: "Lawal Wahab Babatunde",
      score: "Thanawiyah",
      status: "Done" as const,
    },
    {
      course: "001",
      date: "Lawal Wahab Babatunde",
      score: "Idaadiyah",
      status: "Done" as const,
    },
    {
      course: "002",
      date: "Lawal Wahab Babatunde",
      score: "Awal temhidi",
      status: "Done" as const,
    },
    {
      course: "003",
      date: "Lawal Wahab Babatunde",
      score: "Idaadiyah",
      status: "Done" as const,
    },
    {
      course: "004",
      date: "Lawal Wahab Babatunde",
      score: "Idaadiyah",
      status: "Done" as const,
    },
    {
      course: "005",
      date: "Akanji Abayomi Biodun",
      score: "Idaadiyah",
      status: "Pending" as const,
    },
  ];
  return (
    <section className="flex flex-col gap-3">
      <div className="rounded-xl p-6 border border-shade-2 flex flex-col gap-4 bg-white">
        <h1 className="text-low font-medium">Assignment Overview</h1>
        <div className="grid grid-cols-3 gap-4">
          <AssignmentStatCard />
          <AssignmentStatCard />
          <AssignmentStatCard />
        </div>
      </div>
      <div className="rounded-xl p-6 border border-shade-2 flex flex-col gap-4 bg-white">
        <AssignmentTable assignments={assignment} />
      </div>
    </section>
  );
};

export default Assignment;
