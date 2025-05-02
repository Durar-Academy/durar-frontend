"use client";
import ActivityLog from "@/components/tutor/Profile-component/ActivityLog";
import Assignment from "@/components/tutor/Assignment";
import CommentsNotes from "@/components/tutor/Profile-component/Comments";
import Overview from "@/components/tutor/Profile-component/Overview";
import { Top_Bar } from "@/components/tutor/top-bar";
import { profileData } from "@/data2/constants";
import Image from "next/image";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/useAccount";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const [active, setActive] = useState(0);
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

  return (
    <section className="flex flex-col gap-3">
      {currentUserLoading ? (
        <Skeleton className="w-full rounded-xl h-[80px]" />
      ) : (
        <Top_Bar subtext="Profile" user={user as User}>
          <p className="flex items-center gap-1">
            {"Users > Students > Profile"}
          </p>
        </Top_Bar>
      )}
      <section className="flex gap-3">
        <aside className="w-[227px] min-w-[227px] rounded-xl bg-white border border-shade-2 p-6 h-screen text-sm flex flex-col gap-4 ">
          {profileData.map((profile, i) => (
            <button
              onClick={() => setActive(i)}
              key={i}
              className="flex items-center gap-2"
            >
              <Image
                src={active == i ? profile.activeImage : profile.img}
                width={16}
                height={16}
                alt="overview Icon"
              />
              <p
                className={`${
                  active == i ? "text-orange" : "text-low"
                } text-sm`}
              >
                {profile.text}
              </p>
            </button>
          ))}
        </aside>
        {active == 0 ? (
          <Overview />
        ) : active == 1 ? (
          <ActivityLog />
        ) : active == 2 ? (
          <Assignment />
        ) : (
          <CommentsNotes />
        )}
      </section>
    </section>
  );
};

export default Page;
