"use client";

import { useParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DisplayList } from "@/components/admin/display-list";
import { AddNoteDialog } from "@/components/admin/add-note-dialog";

import { useStudentNotes } from "@/hooks/useAdmin";

type StudentNote = { id: string; title?: string; content: string; createdAt: string };

export default function StudentManagementCommentPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const { data: notesResponse, isLoading } = useStudentNotes(studentId);

  const notes: StudentNote[] = notesResponse?.records ?? [];

  return (
    <div className="p-6 rounded-xl bg-white border border-shade-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-low font-medium text-base leading-5">Notes</h3>

        <div className="flex gap-3 items-center">
          <div className="relative w-[200px]">
            <Input
              className="w-full text-sm h-10 px-4 pr-10 rounded-lg border border-shade-3 bg-white shadow-none placeholder:text-low


            focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
              placeholder="Search..."
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-low" />
          </div>

          <div>
            <AddNoteDialog studentId={studentId} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : notes.length > 0 ? (
          notes.map((note) => (
            <DisplayList
              key={note.id}
              text={note.title ? `${note.title}: ${note.content}` : note.content}
              date={new Date(note.createdAt)}
            />
          ))
        ) : (
          <p className="text-sm text-low text-center py-8">No notes yet.</p>
        )}
      </div>
    </div>
  );
}
