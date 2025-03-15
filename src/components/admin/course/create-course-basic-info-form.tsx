"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThumbnailDropzone } from "./thumbnail-dropzone";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useCreateCourseFormProvider } from "@/hooks/useForm";
import { COURSE_CATEGORY } from "@/data/constants";

export function CreateCourseBasicInfoForm() {
  const { formData, updateFormData } = useCreateCourseFormProvider();

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
            value={formData.title}
            onChange={(event) => updateFormData({ ...formData, title: event.target.value })}
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => updateFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="h-12 text-high bg-white border border-shade-3 rounded-lg text-base px-4 py-3 focus:ring-0">
              <SelectValue placeholder="Select Course Category" />
            </SelectTrigger>

            <SelectContent>
              {COURSE_CATEGORY.map((courseCategory, index) => (
                <SelectItem
                  value={courseCategory.status}
                  key={courseCategory.status + index}
                  className="capitalize"
                >
                  {courseCategory.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>

        <Textarea
          id="description"
          className="shadow-none px-3 py-2 rounded-[10px] placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange h-24 resize-none border border-shade-3"
          placeholder="This course is about..."
          value={formData.description}
          onChange={(event) => updateFormData({ ...formData, description: event.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail (1920 x 1080)</Label>

        <div className="h-60" id="thumbnail">
          <ThumbnailDropzone
            onFileDrop={({ file, preview }) =>
              updateFormData({ ...formData, thumbnailId: { file, preview } })
            }
            value={formData.thumbnailId}
          />
        </div>
      </div>
    </div>
  );
}
