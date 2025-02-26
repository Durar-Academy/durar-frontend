import { Plus, SendHorizonal } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="_outline"
              className="text-orange px-6 py-2 h-10 bg-white border border-shade-3 hover:bg-offwhite"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant={"_default"}
            className="bg-orange hover:bg-burnt px-4 py-2 h-10"
            type="submit"
          >
            <span>Send Note</span>
            <SendHorizonal className="w-6 h-6" strokeWidth={3} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
