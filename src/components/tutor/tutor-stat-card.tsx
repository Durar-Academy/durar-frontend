import React from "react";

interface TutorStatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const TutorStatCard: React.FC<TutorStatCardProps> = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="rounded-xl p-4 flex flex-col justify-between h-36 bg-white place-content-between w-full gap-x-36">
      <div className="flex justify-between items-center">
        <p className="text-high text-base font-medium">{title}</p>
        {icon}
      </div>
      <div className="flex items-end justify-between h-full">
        <h1 className="text-high font-semibold text-2xl">{value}</h1>
      </div>
    </div>
  );
};

export default TutorStatCard;
