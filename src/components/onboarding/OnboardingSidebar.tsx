import { onboardingSidebarData } from "@/data2/constants";
import Image from "next/image";

interface Onboarding {
  progress: number;
  handleClick: (index: number) => void; // Updated to explicitly accept an index parameter
}

export function OnboardingSidebar({ progress, handleClick }: Onboarding) {

  return (
    <aside className="w-[260px] shrink-0 h-full bg-green p-8 min-h-screen">
      <div className="relative w-32 h-10">
        <Image
          src={"/logo-white.svg"}
          fill
          alt="Durar Logo"
          className="object-cover object-center"
        />
      </div>

      <div className="mt-[60px] flex flex-col gap-[22.33px]">
        <h2 className="text-base text-orange pb-0.5">Onboarding</h2>

        {onboardingSidebarData.map((eachSidebar, i) => (
          <div
            onClick={() => handleClick(i)} // Wrap handleClick(i) in an arrow function
            key={i}
            className={`${
              i <= progress ? "bg-orange" : "bg-[#FFFFFF0D]"
            } text-white flex items-center justify-start gap-2 rounded-[6px] p-3 cursor-pointer`}
          >
            <p className="h-[13px] w-[13px] border-[1.5px] rounded-full border-white bg-transparent"></p>
            <span className="w-full truncate">{eachSidebar.txt}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}