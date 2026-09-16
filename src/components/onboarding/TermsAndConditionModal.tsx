import React from "react";
import { TermsAndConditions } from "@/data2/constants";

interface TermsProps {
  handleModal: () => void;
  modal: boolean;
}

export default function TermsAndConditionModal({
  handleModal,
  modal,
}: TermsProps) {
  return (
    <div
      className={`${
        modal ? "sacle-100" : "scale-0"
      } transition-all duration-300 ease-in-out h-screen w-screen bg-black/30 backdrop-blur-sm fixed top-0 left-0 flex justify-center items-center`}
    >
      <div className="relative flex h-[min(90dvh,720px)] w-[calc(100%-2rem)] max-w-[609px] flex-col overflow-hidden rounded-t-xl bg-white">
        <h1 className="text-[18px] top-0 w-full font-semibold text-high p-3 sticky text-center border-b-[1px] border-b-shade-2 overflow-hidden">
          Terms and Conditions
        </h1>
        <div className="min-h-0 flex-1 overflow-y-auto bg-white py-6 px-5 text-high flex flex-col gap-3">
          {TermsAndConditions.map((term, i) => (
            <div className="text-sm flex flex-col gap-1.5" key={i}>
              <p className="font-medium">{i + 1 + ". " + term.title}</p>
              <ul className="flex flex-col gap-1">
                {term.descList.map((list, i) => (
                  <li
                    key={i}
                    className={`${
                      term.descList.length <= 1 ? "list-none" : "list-disc"
                    } ml-4`}
                  >
                    {list}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="p-4 border-t-[1px] border-t-shade-2 ">
          <button
            onClick={handleModal}
            className="p-3 text-white rounded-xl bg-orange w-full text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
