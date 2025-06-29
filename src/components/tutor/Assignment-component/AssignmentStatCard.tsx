import Image from "next/image";
import React from "react";

const AssignmentStatCard = () => {
  return (
    <div className="rounded-xl p-4 border border-shade-2 flex justify-between items-center gap-10 bg-[#F8F8FA]">
      <div className="flex flex-col gap-3.5 ">
        <p className="text-sm text-low">Total Assignment</p>
        <p className="text-xl font-semibold text-high">9</p>
      </div>
      <Image
        src={"/SVGs/harmburger.svg"}
        height={50}
        width={50}
        className="w-[50px] h-[50px]"
        alt={"Image Icon"}
      />
    </div>
  );
};

export default AssignmentStatCard;
