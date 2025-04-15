import Image from "next/image";
import React from "react";

interface AssignmentStatProps {
  title: string;
  img: string;
  amount: number;
}
const AssignmentStatCard: React.FC<AssignmentStatProps> = ({
  title,
  img,
  amount,
}) => {
  return (
    <div className="rounded-xl border border-shade-3 p-6 flex justify-between bg-[#F8F8FA] place-content-between w-full">
      <div className="flex flex-col gap-3.5">
        <p className="text-low text-sm font-medium">{title}</p>
        <h1>{amount}</h1>
      </div>
      <Image src={img} alt="icon" width={50} height={50} />
    </div>
  );
};

export default AssignmentStatCard;
