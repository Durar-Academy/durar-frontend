import Image from "next/image";
import React from "react";

interface TutorStatProps {
  title: string;
  i: number;
  total: number;
  active: number;
  total2: string;
  active2: string;
  value: string;
}
const TutorStatCard: React.FC<TutorStatProps> = ({
  title,
  value,
  i,
  total2,
  active,
  active2,
}) => {
  return (
    <div className="rounded-xl p-4 flex flex-col justify-between h-36 bg-white place-content-between w-full gap-x-36">
      <div className="flex justify-between items-center">
        <p className="text-high text-base font-medium">{title}</p>
        <Image
          src={i == 0 ? "/SVGs/enrolled-students.svg" : i == 1 ? "/SVGs/students.svg" : "/SVGs/assignment.svg"}
          alt=""
          width={19}
          height={19}
        />
      </div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-high font-semibold text-xl">{value}</h1>
          <p className="font-medium text-low text-xs">{total2}</p>
        </div>
        <div>
          <h1 className="text-high font-semibold text-xl">{active}</h1>
          <p className="font-medium text-low text-xs">{active2}</p>
        </div>
      </div>
    </div>
  );
};

export default TutorStatCard;
