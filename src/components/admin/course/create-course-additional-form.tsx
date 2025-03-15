"use client";

// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useCreateCourseFormProvider } from "@/hooks/useForm";
import { COURSE_DIFFICULTY, COURSE_LANGUAGE } from "@/data/constants";

export function CreateCourseAdditionalInfoForm() {
  const { formData, updateFormData } = useCreateCourseFormProvider();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex item-center justify-between gap-4">
        <div className="space-y-2 w-full">
          <Label htmlFor="courseLanguage">Course Language</Label>

          <Select
            value={formData.language}
            onValueChange={(value) => updateFormData({ ...formData, language: value })}
          >
            <SelectTrigger className="h-12 text-high bg-white border border-shade-3 rounded-lg text-base px-4 py-3 focus:ring-0">
              <SelectValue placeholder="Select Course Language" />
            </SelectTrigger>

            <SelectContent>
              {COURSE_LANGUAGE.map((courseLanguage, index) => (
                <SelectItem
                  value={courseLanguage.status}
                  key={courseLanguage.status + index}
                  className="capitalize"
                >
                  {courseLanguage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="difficultyLevel">Difficulty Level</Label>

          <Select
            value={formData.difficultyLevel}
            onValueChange={(value) => updateFormData({ ...formData, difficultyLevel: value })}
          >
            <SelectTrigger className="h-12 text-high bg-white border border-shade-3 rounded-lg text-base px-4 py-3 focus:ring-0">
              <SelectValue placeholder="Select Difficulty Level" />
            </SelectTrigger>

            <SelectContent>
              {COURSE_DIFFICULTY.map((courseDifficulty, index) => (
                <SelectItem
                  value={courseDifficulty.status}
                  key={courseDifficulty.status + index}
                  className="capitalize"
                >
                  {courseDifficulty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="py-4 px-6 rounded-xl border border-shade-3 bg-white flex justify-between items-center">
        <Label className="text-sm space-y-2" htmlFor="courseCertification">
          <p className="text-high font-medium ">Course Certification</p>

          <p className="text-low font-normal ">Enable Certification upon Course Completion</p>
        </Label>

        <div>
          <Switch
            aria-readonly
            className="disabled:opacity-100"
            id="courseCertification"
            checked={formData.enableCertification}
            onCheckedChange={(checked) =>
              updateFormData({ ...formData, enableCertification: checked })
            }
          />
        </div>
      </div>

      <div className="py-4 px-6 rounded-xl border border-shade-3 bg-white flex justify-between items-center">
        <Label className="text-sm space-y-2" htmlFor="progressTracking">
          <p className="text-high font-medium ">Progress Tracking</p>

          <p className="text-low font-normal ">Track Students progress through lessons</p>
        </Label>

        <div>
          <Switch
            aria-readonly
            className="disabled:opacity-100"
            id="progressTracking"
            checked={formData.trackProgress}
            onCheckedChange={(checked) => updateFormData({ ...formData, trackProgress: checked })}
          />
        </div>
      </div>

      <div className="py-4 px-6 rounded-xl border border-shade-3 bg-white flex justify-between items-center w-full">
        <Label className="text-sm space-y-2" htmlFor="courseVisibility">
          <p className="text-high font-medium ">Course Visibility</p>

          <p className="text-low font-normal ">Make this course Public</p>
        </Label>

        <div>
          <Switch
            aria-readonly
            className="disabled:opacity-100"
            id="courseVisibility"
            checked={formData.status === "draft" ? false : true}
            onCheckedChange={(checked) =>
              updateFormData({ ...formData, status: checked ? "published" : "draft" })
            }
          />
        </div>
      </div>

      <div className="py-4 px-6 rounded-xl border border-shade-3 bg-white flex justify-between items-center w-full">
        <Label className="text-sm space-y-2" htmlFor="enableComments">
          <p className="text-high font-medium">Enable Comments</p>

          <p className="text-low font-normal">Allow students to comment on Lessons</p>
        </Label>

        <div>
          <Switch
            aria-readonly
            className="disabled:opacity-100"
            id="enableComments"
            checked={formData.enableComments}
            onCheckedChange={(checked) => updateFormData({ ...formData, enableComments: checked })}
          />
        </div>
      </div>

      <div className="space-y-2 w-full">
        <Label htmlFor="additionalNotes">Additional Notes</Label>

        <Textarea
          id="additionalNotes"
          className="h-40 resize-none shadow-none px-3 py-2 rounded-[10px] placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
          placeholder="Any Additional notes about the course"
          value={formData.additionalNotes}
          onChange={(event) => updateFormData({ ...formData, additionalNotes: event.target.value })}
        />
      </div>
    </div>
  );
}
