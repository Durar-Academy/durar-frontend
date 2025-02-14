import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddNoteDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"_default"} className="bg-orange hover:bg-burnt px-4 py-2 h-10">
          <Plus className="w-6 h-6" strokeWidth={3} />

          <span>Add new note</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Add new Note</DialogTitle>
          <DialogDescription>Add new notes</DialogDescription>
        </DialogHeader>

        <>
          <Label htmlFor="note">Note</Label>

          <Textarea
            className="h-40 rounded-xl resize-none text-high"
            id="note"
            placeholder="New note here..."
          />
        </>
      </DialogContent>
    </Dialog>
  );
}
