import React, { useState } from "react";
import NotesTable from "./NotesTable";
import Image from "next/image";
import { useStudentNotes, useAddStudentNote } from "@/hooks/tutorQueries";

interface CommentsNotesProps {
  studentId: string;
}

const CommentsNotes: React.FC<CommentsNotesProps> = ({ studentId }) => {
  const [triggerShowNote, setTriggerShowNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [page, setPage] = useState(1);
  const { data, refetch, isLoading } = useStudentNotes({ studentId, page });
  const addNoteMutation = useAddStudentNote();

  const notes = (data?.records || []).map((note) => ({
    content: note.content,
    date: new Date(note.createdAt).toLocaleDateString(),
    title: note.title,
  }));

  const handleShowNote = () => {
    setTriggerShowNote(!triggerShowNote);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim() || !noteTitle.trim()) return;
    await addNoteMutation.mutateAsync({
      title: noteTitle,
      content: noteContent,
      studentId,
    });
    setNoteContent("");
    setNoteTitle("");
    setTriggerShowNote(false);
    refetch();
  };

  return (
    <div className="p-6 bg-white border border-shade-2 rounded-xl h-max w-full">
      <NotesTable
        triggerShowNote={handleShowNote}
        notes={notes}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        metaData={data?.metaData}
      />

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
          <form className="flex gap-6 flex-col" onSubmit={handleAddNote}>
            <div className="flex flex-col gap-2">
              <label htmlFor="note-title" className="text-low text-sm">
                Title
              </label>
              <input
                id="note-title"
                className="text-high w-full px-3 py-2 rounded border border-shade-3 "
                placeholder="Note title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="note-content" className="text-low text-sm">
                Note
              </label>
              <textarea
                id="note-content"
                className="h-[145px] text-high w-full px-3 py-2 rounded border border-shade-3 "
                placeholder="New notes here"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
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
              <button
                type="submit"
                className="flex justify-center items-center gap-1.5 text-sm bg-orange text-white rounded-xl px-6 py-2.5"
                disabled={addNoteMutation.isPending}
              >
                <Image
                  src={"/SVGs/send.svg"}
                  height={24}
                  width={24}
                  alt="Send Icon"
                />
                {addNoteMutation.isPending ? "Sending..." : "Send Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsNotes;
