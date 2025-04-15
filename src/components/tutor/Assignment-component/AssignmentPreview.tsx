import Image from "next/image";
import React from "react";

interface AssignmentProps {
  handleShow: () => void;
  show: boolean;
}

const AssignmentPreview = ({ handleShow, show }: AssignmentProps) => {
  return (
    <div
      className={`${
        show ? "scale-100" : "scale-0"
      } transition-all ease-in-out duration-300 h-screen w-screen fixed left-0 top-0 bg-black/70 grid place-content-center`}
    >
      <div className="bg-white rounded-3xl p-5 border border-shade-2 w-[39.75rem] flex flex-col gap-4">
        <header className="flex justify-between items-center text-xl text-high">
          <h1>Assignment Preview</h1>
          <Image
            src={"/SVGs/cancel.svg"}
            width={20}
            height={20}
            alt="cancel icon"
            onClick={handleShow}
            className="cursor-pointer"
          />
        </header>
        <Image
          src={"/"}
          alt="assignment image"
          height={116}
          width={596}
          className="rounded-xl h-[116px] border border-shade-3 w-full"
        />
        <h1>Jizu Nabayi</h1>
        <div className="flex items-center gap-6">
          <p className="flex items-center gap-2">
            <Image
              src={"/SVGs/dateIcon.svg"}
              height={16}
              width={16}
              alt={"date Icon"}
            />
            <span className="text-low text-sm">Feb 12th, 2024 | 09:00 am</span>
          </p>
          <p className="flex items-center gap-2">
            <Image
              src={"/SVGs/score.svg"}
              height={16}
              width={16}
              alt={"date Icon"}
            />
            <span className="text-low text-sm">Max Score: 100</span>
          </p>
        </div>

        <div className="bg-[#F8F8FA] border border-shade-3 p-4 rounded-xl flex flex-col gap-5">
          <h1 className="text-sm text-high font-medium">Assignment Details</h1>
          <div className="grid grid-cols-2 gap-5">
            <aside className="flex flex-col gap-2">
              <p className="text-low text-xs">Course</p>
              <h2 className="text-sm text-high">Quran Memorisation</h2>
            </aside>
            <aside className="flex flex-col gap-2">
              <p className="text-low text-xs">Tutor</p>
              <h2 className="text-sm text-high">Ahmad Hassan</h2>
            </aside>
            <aside className="flex flex-col gap-2">
              <p className="text-low text-xs">Laste Submissions</p>
              <h2 className="text-sm text-high">Not Allowed</h2>
            </aside>
            <aside className="flex flex-col gap-2">
              <p className="text-low text-xs">Visibility</p>
              <h2 className="text-sm text-high">Idaadiyah Level</h2>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPreview;
