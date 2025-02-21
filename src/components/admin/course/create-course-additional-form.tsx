"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function CreateCourseAdditionalInfoForm() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex item-center justify-between gap-4">
        <div className="space-y-2 w-full">
          <Label htmlFor="courseLanguage">Course Language</Label>

          <Input
            id="courseLanguage"
            type="text"
            className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
            placeholder="Arabic"
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="difficultyLevel">Difficulty Level</Label>

          <Input
            id="difficultyLevel"
            type="text"
            className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
            placeholder="Beginner"
          />
        </div>
      </div>

      <div className="py-4 px-6 rounded-xl border border-shade-3 bg-white flex justify-between items-center">
        <Label className="text-sm space-y-2" htmlFor="courseCertification">
          <p className="text-high font-medium ">Course Certification</p>

          <p className="text-low font-normal ">Enable Certification upon Course Completion</p>
        </Label>

        <div>
          <Switch aria-readonly className="disabled:opacity-100" id="courseCertification" />
        </div>
      </div>

      <div className="py-4 px-6 rounded-xl border border-shade-3 bg-white flex justify-between items-center">
        <Label className="text-sm space-y-2" htmlFor="progressTracking">
          <p className="text-high font-medium ">Progress Tracking</p>

          <p className="text-low font-normal ">Track Students progress through lessons</p>
        </Label>

        <div>
          <Switch aria-readonly className="disabled:opacity-100" id="progressTracking" />
        </div>
      </div>

      {/* <div className="space-y-2 w-full">
        <Label htmlFor="prerequisites">Prerequisites</Label>

        <Input
          id="prerequisites"
          type="text"
          className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
          placeholder="Add Prerequisites"
        />
      </div> */}

      <div className="flex item-center justify-between gap-4">
        <div className="py-4 px-6 rounded-xl border border-shade-3 bg-white flex justify-between items-center w-full">
          <Label className="text-sm space-y-2" htmlFor="courseVisibility">
            <p className="text-high font-medium ">Course Visibility</p>

            <p className="text-low font-normal ">Make this course Public</p>
          </Label>

          <div>
            <Switch aria-readonly className="disabled:opacity-100" id="courseVisibility" />
          </div>
        </div>

        <div className="py-4 px-6 rounded-xl border border-shade-3 bg-white flex justify-between items-center w-full">
          <Label className="text-sm space-y-2" htmlFor="enableComments">
            <p className="text-high font-medium">Enable Comments</p>

            <p className="text-low font-normal">Allow students to comment on Lessons</p>
          </Label>

          <div>
            <Switch aria-readonly className="disabled:opacity-100" id="enableComments" />
          </div>
        </div>
      </div>

      <div className="space-y-2 w-full">
        <Label htmlFor="additionalNotes">Additional Notes</Label>

        <Textarea
          id="additionalNotes"
          className="h-40 resize-none shadow-none px-3 py-2 rounded-[10px] placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
          placeholder="Any Additional notes about the course"
        />
      </div>
    </div>
  );
}
