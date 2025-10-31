"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axios";
import { notificationFormSchema } from "@/lib/schemas";
import { uploadFile } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Paperclip, SendHorizonal, Upload } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import Select, { StylesConfig } from "react-select";
import { recipientTypeOptions } from "@/data/constants";
import toast from "react-hot-toast";

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

export function EditNotificationDialog({
  notification,
  open,
  onOpenChange,
}: {
  notification: _Notification;
  open: boolean;
  onOpenChange: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(notification.title);
  const [content, setContent] = useState(notification.content);
  const [recipientType, setRecipientType] = useState<RecipientType | string>(
    notification.recipientType,
  );
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
      let fileResponse;
      if (file) {
        fileResponse = await uploadFile(file);
      }

      const payload = {
        title,
        content,
        recipientType,
        mediaId: fileResponse?.storageId ?? null,
      };

      const response = await axiosInstance.patch(`/notification/${notification.id}`, payload);
      console.log("UPDATE NOTIFICATION", response);
      toast.success("Notification updated!");
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update notification.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDialogClose() {
    setErrors({});
    setFile(null);
    setIsSubmitting(false);
    onOpenChange();
  }

  return (
    <Dialog onOpenChange={handleDialogClose} open={open}>
      <DialogContent className="w-[800px]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Edit Notification</DialogTitle>
            <DialogDescription>Modify and update this notification.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                className={cn(
                  "shadow-none px-4 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange",
                  errors.title && "border-2 border-destructive",
                )}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={cn(
                  "w-full rounded-[10px] border px-4 py-3 h-40 resize-none text-sm text-high placeholder:text-low shadow-none focus-visible:outline-0 focus-visible:ring-0 focus-visible:border-2 focus-visible:border-orange",
                  errors.content && "border-2 border-destructive",
                )}
              />
              {errors.content && <p className="text-sm text-destructive mt-1">{errors.content}</p>}
            </div>

            <div>
              <Label htmlFor="recipientType">Recipients</Label>
              <Select
                id="recipientType"
                options={recipientTypeOptions}
                isClearable
                styles={selectStyles}
                value={recipientTypeOptions.find((opt) => opt.value === recipientType)}
                onChange={(option) => setRecipientType(option?.value ?? recipientType)}
                className="react-select-container text-sm"
                classNamePrefix="react-select"
              />
              {errors.recipientType && (
                <p className="text-sm text-destructive mt-1">{errors.recipientType}</p>
              )}
            </div>

            <div className="flex items-center justify-between border border-shade-3 rounded-[10px] px-4 py-2 h-12 bg-white">
              <label
                htmlFor="file"
                className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-4 h-4 text-muted-foreground" />
                <span>
                  {file ? file.name : notification.media?.fileName ?? "Upload Attachment"}
                </span>
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
            <Button
              type="button"
              variant="_outline"
              className="text-orange px-6 py-2 h-10 bg-white border border-shade-3 hover:bg-offwhite"
              onClick={handleDialogClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange hover:bg-burnt px-4 py-2 h-10"
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <span>Update</span>
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
