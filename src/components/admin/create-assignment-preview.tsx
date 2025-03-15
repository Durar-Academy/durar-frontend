"use client";

import { format } from "date-fns";
import Image from "next/image";
import { Calendar, Clock, CloudUpload } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CreateAssignmentPreview({
  open,
  assignment,
  courseOptions,
  closeDialog,
}: {
  open: boolean;
  assignment: CreateAssignment;
  courseOptions: {
    value: string;
    label: string;
  }[];
  closeDialog: () => void;
}) {
  const course = courseOptions.find((course) => course.value === assignment.courseId)?.label ?? "";
  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Assignment Preview</DialogTitle>
          <DialogDescription>Assignment Preview</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="w-full h-32 relative border border-shade-2 rounded-xl flex items-center justify-center">
            {assignment.thumbnail ? (
              <Image
                src={assignment.thumbnail.preview}
                alt="Assignment Thumbnail"
                fill
                className="object-center object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-light flex items-center justify-center gap-2">
                <CloudUpload className="text-orange w-4 h-4" />
              </div>
            )}
          </div>

          <div>
            <p className="text-base text-high font-semibold">{assignment.title}</p>

            <div className="text-low text-sm flex items-center gap-5 mt-2">
              <p className="flex gap-2 items-center shrink-0">
                <Calendar className="w-4 h-4 text-low" />
                {format(new Date(assignment.dueAt as Date), "PPP")}
              </p>

              <p className="flex gap-2 items-center shrink-0">
                <Clock className="w-4 h-4 text-low" />
                Max score: {assignment.totalScore}
              </p>
            </div>
          </div>

          <div className="bg-offwhite p-4 rounded-xl border border-shade-2 text-high text-sm">
            <h3 className="font-medium">Assignment Details</h3>

            <div className="mt-3 flex flex-col gap-3">
              <p className="flex flex-col gap-1">
                <span className="text-xs text-low">Course</span>
                <span>{course}</span>
              </p>

              <p className="flex flex-col gap-1">
                <span className="text-xs text-low">Late Submission</span>
                <span>{assignment.allowLate ? "Allowed" : "Not Allowed"}</span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
