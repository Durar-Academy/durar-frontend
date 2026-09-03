import { useState } from "react";
import { Plus, SendHorizonal } from "lucide-react";
import toast from "react-hot-toast";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useCreateNote } from "@/hooks/useAdmin";

export function AddNoteDialog({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { mutate: createNote, isPending } = useCreateNote();

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error("Please enter a note.");
      return;
    }

    createNote(
      { title: title.trim() || undefined, content: content.trim(), studentId },
      {
        onSuccess: () => {
          toast.success("Note added successfully!");
          setTitle("");
          setContent("");
          setOpen(false);
        },
        onError: () => {
          toast.error("Something went wrong. Please try again!");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"_default"} className="bg-orange hover:bg-burnt px-4 py-2 h-10">
          <Plus className="w-6 h-6" strokeWidth={3} />

          <span>Add new note</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Add new Note</DialogTitle>
          <DialogDescription>Add a new note for this student</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="note-title">Title (optional)</Label>

            <Input
              id="note-title"
              className="rounded-xl text-high mt-1"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="note">Note</Label>

            <Textarea
              className="h-40 rounded-xl resize-none text-high mt-1"
              id="note"
              placeholder="New note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="_outline"
              className="text-orange px-6 py-2 h-10 bg-white border border-shade-3 hover:bg-offwhite"
              disabled={isPending}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant={"_default"}
            className="bg-orange hover:bg-burnt px-4 py-2 h-10"
            type="submit"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? (
              <span>Sending...</span>
            ) : (
              <>
                <span>Send Note</span>
                <SendHorizonal className="w-6 h-6" strokeWidth={3} />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
