"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThumbnailDropzone } from "./thumbnail-dropzone";

export function CreateCourseBasicInfoForm() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex item-center justify-between gap-4">
        <div className="space-y-2 w-full">
          <Label htmlFor="courseTitle">Course Title</Label>

          <Input
            id="courseTitle"
            type="text"
            className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
            placeholder="Qur'an Memorization"
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="category">Category</Label>

          <Input
            id="category"
            type="text"
            className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
            placeholder="Idaadiyah"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>

        <Textarea
          id="description"
          className="shadow-none px-3 py-2 rounded-[10px] placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange h-24 resize-none border border-shade-3"
          placeholder="This course is about..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail (1920 x 1080)</Label>

        <div className="" id="thumbnail">
          <ThumbnailDropzone />
        </div>
      </div>
    </div>
  );
}
