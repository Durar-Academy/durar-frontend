import Image from "next/image";
import React from "react";

const ActivityLog = () => {
  return (
    <section className="rounded-lg p-6 border border-shade-3 flex bg-white gap-3 flex-col w-full">
      <h1 className="text-low font-medium mb-3">Recent Activities</h1>
      <div className="bg-[#F8F8FA] border border-shade-3 rounded-xl p-3 flex items-center gap-4">
        <p className="text-sm">Submitted Assignment for Quran Memorization</p>
        <p className="text-sm text-low flex items-center gap-1">
          <Image
            src={"/SVGs/dateIcon.svg"}
            alt="Date Icon"
            height={16}
            width={16}
          />
          Mar 25, 2024
        </p>
        <span className="flex-1"></span>
        <button className="text-orange text-sm">Check Assignment</button>
      </div>
    </section>
  );
};

export default ActivityLog;
