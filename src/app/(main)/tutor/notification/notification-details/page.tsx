"use client";
import DeliveryStats from "@/components/tutor/Notification-component/DeliveryStats";
import NotificationContentCard from "@/components/tutor/Notification-component/NotificationContent";
import { Top_Bar } from "@/components/tutor/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useState } from "react";

const page = () => {
  const [show, setShow] = useState(false);

  const handleShowNotification = () => {
    setShow(!show);
  };
  return (
    <section className="flex flex-col gap-3">
      <section className="flex justify-between items-center w-full bg-white rounded-xl border border-shade-2 p-4">
        <div className="flex flex-col gap-3.5">
          <div className="text-low text-sm flex items-center gap-1">
            <Image
              src={"/SVGs/dateIcon.svg"}
              alt="date icon"
              height={16}
              width={16}
            />
            Sent On January 3, 2025 at 09:00AM
          </div>
          <div className="text-low text-sm flex items-center gap-1">
            <Image
              src={"/SVGs/userIcon.svg"}
              alt="date icon"
              height={16}
              width={16}
            />
            To All Students
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button className="text-orange flex items-center gap-1">
            <Image
              src={"/SVGs/edit.svg"}
              alt="delete Icon"
              height={17}
              width={17}
            />
            Edit
          </button>
          <button className="text-red-500 gap-1 flex items-center">
            <Image
              src={"/SVGs/delete.svg"}
              alt="delete Icon"
              height={17}
              width={17}
            />
            Delete
          </button>
        </div>
      </section>

      <section className="grid grid-cols-3 ">
        <NotificationContentCard />
        <DeliveryStats />
      </section>
    </section>
  );
};

export default page;
