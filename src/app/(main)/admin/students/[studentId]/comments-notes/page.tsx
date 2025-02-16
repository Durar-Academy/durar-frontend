import { Search } from "lucide-react";

import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { DisplayList } from "@/components/admin/display-list";
import { AddNoteDialog } from "@/components/admin/add-note-dialog";

import { studentNotes } from "@/data/mockData";

export default function StudentManagementCommentPage() {
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
            <DatePicker />
          </div>

          <div>
            <div>
              <AddNoteDialog />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {studentNotes.map((note, index) => (
          <DisplayList key={index} text={note.text} date={note.date as unknown as Date} />
        ))}
      </div>
    </div>
  );
}
