"use client";

import { AxiosError } from "axios";
import { Plus, SendHorizonal } from "lucide-react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { resetPasswordFormSchema } from "@/lib/schemas";
import { inviteTutor } from "@/lib/account";

export function AddTutorDialog() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [inputError, setInputError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const zodResponse = resetPasswordFormSchema.safeParse(email);

    if (!zodResponse.success) {
      setInputError(zodResponse.error?.flatten().formErrors[0] as unknown as string);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await inviteTutor({ email });
      console.log("Invite Tutor Response Data", response);

      toast.success("Tutor invitation sent successfully!");

      // reset everything when successful
      setInputError("");
      setEmail("");
    } catch (error) {
      console.error("Invite Tutor Form Error", error);

      if (error instanceof AxiosError)
        toast.error(
          error.response?.data?.message || "Unable to send invitation. Please try again.",
        );
      else toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDialogClose(open: boolean) {
    // When Dialog closes, reset everything
    if (!open) {
      setInputError("");
      setEmail("");
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant={"_default"} className="bg-orange hover:bg-burnt px-4 py-2 h-10">
          <Plus className="w-6 h-6" strokeWidth={3} />

          <span>Add Tutor</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[500px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Invite Tutor</DialogTitle>
            <DialogDescription>Add new tutor</DialogDescription>
          </DialogHeader>

          <>
            <Label htmlFor="email">Email</Label>

            <Input
              placeholder="someone@example.com"
              type="email"
              id="email"
              className={cn(
                "shadow-none px-4 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange",

                !!inputError && "border-2 border-destructive",
              )}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            {!!inputError && (
              <p className="text-sm font-medium text-destructive mt-0 flex">{inputError}</p>
            )}
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
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <span>Send Invite</span>
                  <SendHorizonal className="w-6 h-6" strokeWidth={3} />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
