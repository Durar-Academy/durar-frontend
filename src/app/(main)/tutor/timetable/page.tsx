"use client";
import QuranTimetable from "@/components/tutor/QuranTimeTable";
import { Top_Bar } from "@/components/tutor/top-bar";

const page = () => {
  return (
    <section className="flex flex-col gap-3">
      <Top_Bar subtext={`Timetable`}>Timetable</Top_Bar>
      <section className=" bg-white p-6 border-[1px] border-[#E7E8EE] rounded-xl">
        <QuranTimetable />
      </section>
    </section>
  );
};

export default page;
