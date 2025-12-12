"use client";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { recipientTypeOptions } from "@/data/constants";
import { axiosInstance } from "@/lib/axios";
import { notificationFormSchema } from "@/lib/schemas";
import { uploadFile } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Paperclip, Plus, SendHorizonal, Upload } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import Select, { StylesConfig } from "react-select";

interface OptionType {
  label: string;
  value: RecipientType;
}

const selectStyles: StylesConfig<OptionType, false> = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "10px",
    minHeight: "40px",
    border: state.isFocused ? "1px solid #f38708" : "1px solid hsl(0, 0%, 80%)",
    boxShadow: "none",
    "&:hover": {
      border: "1px solid hsl(0, 0%, 80%)",
    },
    padding: "4px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#f38708",
  }),
};

export function AddNotificationDialog() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recipientType, setRecipientType] = useState<RecipientType | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof notificationFormSchema._type, string>>
  >({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const formData = { title, content, recipientType, file };

    const validation = notificationFormSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0],
        content: fieldErrors.content?.[0],
        recipientType: fieldErrors.recipientType?.[0],
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // upload file
      let fileResponse;
      if (formData.file) {
        fileResponse = await uploadFile(formData.file);
      }

      const payload = {
        title: formData.title,
        content: formData.content,
        mediaId: fileResponse ? fileResponse.storageId : null,
        recipientType: formData.recipientType,
      };
      console.log("Payload", payload);

      const createNotificationResponse = await axiosInstance.post("/notification", payload);
      console.log("CREATE NOTIFICATION", createNotificationResponse);

      toast.success("Notification sent!");

      // Reset
      setTitle("");
      setContent("");
      setRecipientType(null);
      setFile(null);
      setErrors({});
    } catch (error) {
      console.error("Notification Error:", error);
      toast.error("Failed to send notification.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDialogClose(open: boolean) {
    if (!open) {
      setTitle("");
      setContent("");
      setRecipientType(null);
      setFile(null);
      setErrors({});
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="_default" className="bg-orange hover:bg-burnt px-4 py-2 h-10">
          <Plus className="w-6 h-6" strokeWidth={3} />
          <span>Create Notification</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[800px]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Add New Notification</DialogTitle>
            <DialogDescription>Send a message to selected users or roles.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Title Field */}
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Notification title"
                className={cn(
                  "shadow-none px-4 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange",
                  errors.title && "border-2 border-destructive",
                )}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
            </div>

            {/* Content Field */}
            <div>
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                placeholder="Notification content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={cn(
                  "w-full rounded-[10px] border px-4 py-3 h-40 resize-none text-sm text-high placeholder:text-low shadow-none focus-visible:outline-0 focus-visible:ring-0 focus-visible:border-2 focus-visible:border-orange",
                  errors.content && "border-2 border-destructive",
                )}
              />
              {errors.content && <p className="text-sm text-destructive mt-1">{errors.content}</p>}
            </div>

            {/* Recipient Type Field */}
            <div>
              <Label htmlFor="recipientType">Recipients</Label>
              <Select
                id="recipientType"
                options={recipientTypeOptions}
                isClearable
                styles={selectStyles}
                value={recipientTypeOptions.find((opt) => opt.value === recipientType)}
                onChange={(option) => setRecipientType(option?.value ?? null)}
                placeholder="Select recipient type"
                className="react-select-container text-sm"
                classNamePrefix="react-select"
              />
              {errors.recipientType && (
                <p className="text-sm text-destructive mt-1">{errors.recipientType}</p>
              )}
            </div>

            {/* File Upload Field */}
            <div className="flex items-center justify-between border border-shade-3 rounded-[10px] px-4 py-2 h-12 bg-white">
              <label
                htmlFor="file"
                className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-4 h-4 text-muted-foreground" />
                <span> {file ? file.name : "Upload Attachment"}</span>
              </label>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-orange hover:bg-burnt text-white rounded-[6px] p-2 transition"
              >
                <Upload className="w-4 h-4" />
              </button>

              <input
                ref={fileInputRef}
                id="file"
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </div>
          </div>

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
              type="submit"
              disabled={isSubmitting}
              className="bg-orange hover:bg-burnt px-4 py-2 h-10"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <span>Send</span>
                  <SendHorizonal className="w-5 h-5 ml-2" strokeWidth={2.5} />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
