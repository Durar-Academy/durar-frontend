import Image from "next/image";
import React from "react";

const RecentNotificatin = () => {
  const RecentNotifionData = [
    "New Students Enrolled",
    "Assignment Submitted",
    "Message from Administration",
    "Missed a class",
    "New Students Enrolled",
  ];
  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center gap-3 pb-2">
        <Image
          src={"/SVGs/plainBell.svg"}
          alt="Bell Icon"
          width={24}
          height={24}
        />
        <h1 className="font-semibold">Recent Notifications</h1>
      </header>

      {RecentNotifionData.map((notification, i) => (
        <div key={i} className="flex items-center gap-2 hover:underline">
          <Image
            className="p-2 bg-orange/25 rounded-full"
            src={"/SVGs/plainBell.svg"}
            alt="bell Icon"
            width={32}
            height={32}
          />
          <p className="text-high">{notification}</p>
        </div>
      ))}
    </div>
  );
};

export default RecentNotificatin;
