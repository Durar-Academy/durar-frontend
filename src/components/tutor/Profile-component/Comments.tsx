import React, { useState } from "react";
import NotesTable from "./NotesTable";
import Image from "next/image";

const CommentsNotes = () => {
  const [triggerShowNote, setTriggerShowNote] = useState(false);

  const note = [
    {
      comment: "You need to improve on your pronunciation",
      date: "Mar 300, 2024",
    },
    {
      comment: "Ensure you revise the last lessons",
      date: "Mar 25, 2024",
    },
  ];

  const handleShowNote = () => {
    setTriggerShowNote(!triggerShowNote);
  };
  return (
    <div className="p-6 bg-white border border-shade-2 rounded-xl h-max w-full">
      <NotesTable triggerShowNote={handleShowNote} notes={note} />

      <div
        className={`${
          triggerShowNote ? "scale-100" : "scale-0"
        } left-0 duration-300 transition-all ease-linear fixed w-screen h-screen bg-black/70 top-0  flex justify-center items-center`}
      >
        <div
          className={`bg-white p-5 rounded-3xl w-[500px] flex flex-col gap-4 `}
        >
          <header className="flex justify-between items-center text-xl text-high">
            <h1>Enter new note</h1>
            <Image
              src={"/SVGs/cancel.svg"}
              width={20}
              height={20}
              alt="cancel icon"
              onClick={handleShowNote}
            />
          </header>
          <form className="flex gap-6 flex-col" action="">
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-low text-sm">
                Note
              </label>
              <textarea
                className="h-[145px] text-high w-full px-3 py-2 rounded border border-shade-3 "
                placeholder="New notes here"
                name=""
                id=""
              ></textarea>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleShowNote}
                className="border border-shade-3 text-orange rounded-xl px-6 py-3 text-sm"
              >
                Cancel
              </button>
              <button className="flex justify-center items-center gap-1.5 text-sm bg-orange text-white rounded-xl px-6 py-2.5">
                <Image
                  src={"/SVGs/send.svg"}
                  height={24}
                  width={24}
                  alt="Send Icond"
                />
                Send Note
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsNotes;
