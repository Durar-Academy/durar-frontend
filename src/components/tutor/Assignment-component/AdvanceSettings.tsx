import React from "react";
import ToggleSwitch from "../Switch";

const AdvanceSettings = () => {
  const AdvancedData = [
    {
      title: "Randomize Questions",
      desc: "The questions can be in any order",
      toggle: true,
    },
    {
      title: "Auto Grading",
      desc: "Allow the system to grade the performance",
      toggle: true,
    },
    {
      title: "Late Submission",
      desc: "Allow late submissions from students",
      toggle: true,
    },
    {
      title: "Auto Grading",
      desc: "Allow the system to grade the performance",
      toggle: true,
    },
  ];

  return (
    <div className="rounded-xl p-6 w-full border border-shade-3 bg-white h-max flex flex-col gap-4">
      <h1 className="text-[18px] text-high font-medium">Advanced Settings</h1>
      <section className="grid grid-cols-2 gap-4">
        {AdvancedData.map((data, index) => (
          <div key={index} className="flex justify-between items-center px-6 py-4 border-[1px] border-[#D2D4E0] rounded-xl ">
            <div className="text-sm flex flex-col gap-4">
              <p className="text-high font-medium">{data.title}</p>
              <p className="text-low">{data.desc}</p>
            </div>
            <div className="relative">
              <ToggleSwitch />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdvanceSettings;
