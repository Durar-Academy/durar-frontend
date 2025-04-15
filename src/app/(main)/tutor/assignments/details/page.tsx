"use client";
import ActivityLog from "@/components/tutor/Profile-component/ActivityLog";
import Assignment from "@/components/tutor/Assignment";
import CommentsNotes from "@/components/tutor/Profile-component/Comments";
import Overview from "@/components/tutor/Profile-component/Overview";
import { Top_Bar } from "@/components/tutor/top-bar";
import { AssignmentData } from "@/data2/constants";
import Image from "next/image";
import { useState } from "react";
import AssignmentDetails from "@/components/tutor/Assignment-component/AssignmentDetails";
import AdvanceSettings from "@/components/tutor/Assignment-component/AdvanceSettings";
import AssignmentPreview from "@/components/tutor/Assignment-component/AssignmentPreview";
import QuestionDetails from "@/components/tutor/Assignment-component/QuestionDetails";

const page = () => {
  const [active, setActive] = useState(0);
  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <section className="flex flex-col gap-3">
      <Top_Bar subtext={`Add New Assignment-Multiple Choice Questions`}>
        {"Assignment > Add Assignment"}
      </Top_Bar>
      <section className="flex gap-3">
        <aside className="w-[227px] min-w-[227px] rounded-xl bg-white border border-shade-2 p-6 h-screen text-sm flex flex-col gap-4 ">
          {AssignmentData.map((profile, i) => (
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
          <div className="flex flex-col gap-3">
            <AssignmentDetails handleShow={handleShow} />
            <AdvanceSettings />
          </div>
        ) : (
          <QuestionDetails />
        )}
      </section>

      <AssignmentPreview show={show} handleShow={handleShow} />
    </section>
  );
};

export default page;
