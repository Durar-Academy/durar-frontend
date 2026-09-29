"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, GraduationCap, Link2, UserRound } from "lucide-react";

export type ScheduleDetailData = {
  courseTitle: string;
  status: string;
  day: string;
  start: string;
  end: string;
  link?: string | null;
  tutorName: string;
  tutorEmail: string;
  studentName?: string | null;
  studentEmail?: string | null;
};

const statusStyles: Record<string, string> = {
  scheduled:
    "bg-success/10 text-success border-success/20",
  cancelled:
    "bg-destructive/10 text-destructive border-destructive/20",
  completed:
    "bg-low/10 text-low border-low/20",
};

function getMeetingLink(link?: string | null) {
  const value = link?.trim();
  if (!value) return null;

  const markdownLink = value.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
  return markdownLink
    ? { href: markdownLink[2], label: markdownLink[1] }
    : { href: value, label: value };
}

export function ScheduleDetailModal({
  open,
  onClose,
  schedule,
}: {
  open: boolean;
  onClose: () => void;
  schedule: ScheduleDetailData | null;
}) {
  if (!schedule) return null;

  const statusClass = statusStyles[schedule.status] ?? "bg-low/10 text-low";
  const meetingLink = getMeetingLink(schedule.link);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* Course title + status */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-high leading-snug">
              {schedule.courseTitle}
            </h3>

            <span
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium capitalize border ${statusClass}`}
            >
              {schedule.status}
            </span>
          </div>

          {/* Day & Time */}
          <div className="grid grid-cols-2 gap-3 bg-offwhite rounded-lg p-4 border border-shade-2">
            <div className="flex items-center gap-2.5 text-sm text-low">
              <Calendar className="w-4 h-4 shrink-0 text-orange" />
              <span className="capitalize">{schedule.day}</span>
            </div>

            <div className="flex items-center gap-2.5 text-sm text-low">
              <Clock className="w-4 h-4 shrink-0 text-orange" />
              <span>
                {schedule.start} – {schedule.end}
              </span>
            </div>
          </div>  

          {/* Meeting link */}
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-low uppercase tracking-wider">
              Class meeting link
            </p>

            {meetingLink ? (
              <a
                href={meetingLink.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 rounded-lg border border-shade-2 bg-offwhite p-3.5 text-sm text-orange hover:underline"
              >
                <Link2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{meetingLink.label}</span>
              </a>
            ) : (
              <p className="rounded-lg border border-shade-2 bg-offwhite p-3.5 text-sm text-low">
                No meeting link added.
              </p>
            )}
          </div>

          {/* Tutor */}
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-low uppercase tracking-wider">
              Tutor
            </p>

            <div className="flex items-center gap-3 bg-offwhite rounded-lg p-3.5 border border-shade-2">
              <div className="w-9 h-9 rounded-full bg-orange/10 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4.5 h-4.5 text-orange" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-high truncate">
                  {schedule.tutorName}
                </p>

                <p className="text-xs text-low truncate">
                  {schedule.tutorEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Student (when assigned) */}
          {schedule.studentName && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-low uppercase tracking-wider">
                Student
              </p>

              <div className="flex items-center gap-3 bg-offwhite rounded-lg p-3.5 border border-shade-2">
                <div className="w-9 h-9 rounded-full bg-low/10 flex items-center justify-center shrink-0">
                  <UserRound className="w-4.5 h-4.5 text-low" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-high truncate">
                    {schedule.studentName}
                  </p>

                  {schedule.studentEmail && (
                    <p className="text-xs text-low truncate">
                      {schedule.studentEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
