"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Eye, Save, SendHorizonal, X } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ControlledDatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { TopBar } from "@/components/shared/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbnailDropzone } from "@/components/admin/course/thumbnail-dropzone";
import { CreateAssignmentPreview } from "@/components/admin/create-assignment-preview";

import { useCurrentUser } from "@/hooks/useAccount";
import { useCourses } from "@/hooks/useAdmin";
import { createAssignmentDefaultValues } from "@/data/constants";
import { uploadFile } from "@/lib/storage";
import { axiosInstance } from "@/lib/axios";

export default function AddNewAssignmentPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: allCourses, isLoading: coursesLoading } = useCourses({ status: "published" });

  const [assignment, setAssignment] = useState(createAssignmentDefaultValues);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioFiles, setAudioFiles] = useState<File[]>([]);

  const router = useRouter();

  // transform courses
  const courseOptions = allCourses
    ? allCourses.map((course) => {
        return { value: course.id, label: course.title };
      })
    : [];


  const cancelCreate = () => {
    // clear state and route back
    setAssignment(createAssignmentDefaultValues);
    setAudioFiles([]);
    router.back();
  };

  const showPreview = () => setOpen(true);
  const closePreview = () => setOpen(false);

  const createAssignment = async () => {
    if (!assignment.courseId) {
      toast.error("Select a course before publishing the assignment.");
      return;
    }

    if (!assignment.dueAt) {
      toast.error("Select a due date before publishing the assignment.");
      return;
    }

    if (audioFiles.length === 0) {
      toast.error("Add at least one audio attachment before publishing.");
      return;
    }

    if (audioFiles.length > 5) {
      toast.error("You can attach up to 5 audio files.");
      return;
    }

    setIsSubmitting(true);

    try {
      // upload thumbnail
      let thumbnailResponse;
      if (assignment.thumbnail?.file) {
        thumbnailResponse = await uploadFile(assignment.thumbnail.file);
      }

      const uploadedAudio = await Promise.all(audioFiles.map((file) => uploadFile(file)));

      // construct assignment payload. The thumbnail is linked through `mediaId`
      // (the media record id); the schema strips unknown keys, so the old
      // `storageId` field was silently dropped. Only send `mediaId` when an
      // upload happened — the schema rejects `null`.
      const payload = {
        title: assignment.title,
        courseId: assignment.courseId,
        dueAt: assignment.dueAt,
        type: "assignment",
        description: assignment.description,
        allowLate: assignment.allowLate,
        totalScore: assignment.totalScore,
        attachments: uploadedAudio.map((file, index) => ({
          mediaId: file.id,
          kind: "instruction_audio" as const,
          position: index + 1,
        })),
        ...(thumbnailResponse?.id ? { mediaId: thumbnailResponse.id } : {}),
      };


      // await axiosInstance.post("/assignment", payload);

      const createAssignmentResponse = await axiosInstance.post("/assignment", payload);

      toast.success("Assignment Created Successfully!");

      // reset form
      setAssignment(createAssignmentDefaultValues);
      setAudioFiles([]);
      router.push("/admin/assignments");
    } catch (error) {
      console.error("CREATE ASSIGNMENT ERROR: ", error);
      toast.error("Something went Wrong. Please try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="flex flex-col gap-5">
        <div className="top-bar">
          {currentUserLoading ? (
            <Skeleton className="w-full rounded-xl h-[100px]" />
          ) : (
            <TopBar subtext={"Add New Assignment"} user={user as User}>
              <p className="flex items-center gap-1">
                <Link href={"/admin/assignments"} className="hover:underline">
                  Assignments
                </Link>

                <ChevronRight className="h-4 w-4" />

                <span>Add Assignment</span>
              </p>
            </TopBar>
          )}
        </div>

        <div className="flex gap-5">
          {/* SIDE 1 */}
          <div className="w-full max-w-xs h-[360px] bg-white rounded-xl">
            <ThumbnailDropzone
              onFileDrop={({ file, preview }) =>
                setAssignment((previous) => ({
                  ...previous,
                  thumbnail: { file, preview },
                }))
              }
              value={assignment.thumbnail}
              showThumbnail={false}
            />
          </div>

          {/* SIDE 2 */}
          <div className="w-full bg-white rounded-xl border border-shade-2 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex item-center justify-between gap-4">
                <div className="space-y-2 w-full">
                  <Label htmlFor="title">Title</Label>

                  <Input
                    id="title"
                    type="text"
                    className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                    placeholder="Asssignment"
                    value={assignment.title}
                    onChange={(event) =>
                      setAssignment((previous) => ({
                        ...previous,
                        title: event.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="category">Course</Label>

                  <Select
                    value={assignment.courseId}
                    onValueChange={(value) =>
                      setAssignment((previous) => ({
                        ...previous,
                        courseId: value,
                      }))
                    }
                    required
                  >
                    <SelectTrigger className="h-12 text-high bg-white border border-shade-3 rounded-lg text-sm px-4 py-3 focus:ring-0">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>

                    <SelectContent>
                      {coursesLoading ? (
                        <>Loading...</>
                      ) : (
                        courseOptions.map((option, index) => (
                          <SelectItem
                            key={option.value + index}
                            value={option.value}
                            className="capitalize"
                          >
                            {option.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="description">Description</Label>

                <Textarea
                  id="description"
                  className="h-40 resize-none shadow-none px-3 py-2 rounded-[10px] placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                  placeholder="Description"
                  value={assignment.description}
                  onChange={(event) =>
                    setAssignment((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-shade-2 flex flex-col gap-4">
          <h3 className="text-high text-base font-medium">Assignment Settings</h3>

          <div className="flex item-center justify-between gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="dueDate">Due Date</Label>

              <ControlledDatePicker
                date={assignment.dueAt as Date}
                setDate={(date) => {
                  setAssignment((previous) => ({
                    ...previous,
                    dueAt: date ? (format(date, "yyyy-MM-dd") as unknown as Date) : null,
                  }));
                }}
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="maxScore">Maximum Score</Label>

              <Input
                id="maxScore"
                type="text"
                className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                placeholder="1"
                value={String(assignment.totalScore)}
                onChange={({ target: { value } }) => {
                  if (value === "" || !isNaN(Number(value))) {
                    setAssignment((previous) => ({
                      ...previous,
                      totalScore: value === "" ? 0 : Number(value),
                    }));
                  }
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-low font-medium" htmlFor="lateSubmission">
              Allow late Submissions
            </Label>

            <Checkbox
              id="lateSubmission"
              className="h-5 w-5 border border-shade-1 shadow-none data-[state=checked]:bg-orange data-[state=checked]:text-white"
              checked={assignment.allowLate}
              onCheckedChange={(checked) =>
                setAssignment((previous) => ({
                  ...previous,
                  allowLate: Boolean(checked),
                }))
              }
            />
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-shade-2 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-high text-base font-medium">Instruction Audio</h3>
              <p className="text-low text-sm">Add at least one audio recording for this assignment.</p>
            </div>
            <Label className="cursor-pointer rounded-lg border border-shade-3 bg-offwhite px-4 py-2 text-sm text-high hover:bg-[#ECECF2]">
              Choose Files
              <Input
                type="file"
                accept="audio/*"
                multiple
                className="hidden"
                onChange={(event) => {
                  const selected = Array.from(event.target.files ?? []);
                  setAudioFiles((current) => [...current, ...selected].slice(0, 5));
                  event.target.value = "";
                }}
              />
            </Label>
          </div>
          {audioFiles.length > 0 && (
            <div className="flex flex-col gap-2">
              {audioFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-lg bg-offwhite px-3 py-2 text-sm text-high">
                  <span className="truncate">{index + 1}. {file.name}</span>
                  <button
                    type="button"
                    className="ml-3 text-danger"
                    onClick={() => setAudioFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-between">
          <Button
            variant={"_outline"}
            className="text-danger bg-white rounded-xl py-2 px-4 h-10 hover:bg-offwhite"
            onClick={cancelCreate}
          >
            <X className="w-5 h-5 text-inherit" />
            <span>Cancel</span>
          </Button>

          <div className="flex gap-3">
            <Button
              variant={"_outline"}
              className="text-orange bg-white rounded-xl py-2 px-4 h-10 hover:bg-offwhite mr-auto"
              onClick={showPreview}
            >
              <Eye className="w-5 h-5 text-inherit" />
              <span>Preview</span>
            </Button>

            <Button
              variant={"_outline"}
              className="text-orange bg-white rounded-xl py-2 px-4 h-10 hover:bg-offwhite"
              disabled={true}
            >
              <Save className="w-5 h-5 text-inherit" />
              <span>Save Draft</span>
            </Button>

            <Button
              variant={"_default"}
              onClick={createAssignment}
              className="text-white bg-success rounded-xl py-2 px-4 h-10 hover:bg-light-green"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Publishing...</>
              ) : (
                <>
                  <span>Publish</span>
                  <SendHorizonal className="w-5 h-5 text-inherit" />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      <CreateAssignmentPreview
        open={open}
        courseOptions={courseOptions}
        assignment={assignment}
        closeDialog={closePreview}
      />
    </>
  );
}
