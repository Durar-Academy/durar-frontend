"use client";

import { MoreVertical, Plus } from "lucide-react";
import { ChangeEvent } from "react";

import { VideoDropzone } from "@/components/admin/course/video-dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { useCreateCourseFormProvider } from "@/hooks/useForm";
import { Switch } from "@/components/ui/switch";

export function CreateCourseStructure() {
  const { formData, updateFormData } = useCreateCourseFormProvider();

  const addLesson = () => {
    const maxId = formData.Lesson.reduce((max, lesson) => (lesson.id > max ? lesson.id : max), 0);
    const newId = maxId + 1;
    updateFormData({
      ...formData,
      Lesson: [
        ...formData.Lesson,
        { name: "", video: null, id: newId, type: "video", isLocked: true },
      ],
    });
  };

  const removeLesson = (id: number) => {
    const filteredLessons = formData.Lesson.filter((lesson) => lesson.id !== id);
    updateFormData({ ...formData, Lesson: filteredLessons });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = event.target;
    const newLessons = [...formData.Lesson];

    if (name === "name") newLessons[index][name] = value;

    updateFormData({
      ...formData,
      Lesson: newLessons,
    });
  };

  const handleVideoUpload = (file: FileDropValue, index: number) => {
    const newLessons = [...formData.Lesson];

    newLessons[index].video = file;

    updateFormData({
      ...formData,
      Lesson: newLessons,
    });
  };

  const handleLessonStatus = (checked: boolean, index: number) => {
    const newLessons = [...formData.Lesson];

    newLessons[index].isLocked = checked;

    updateFormData({
      ...formData,
      Lesson: newLessons,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-6">
        {formData.Lesson.map((lesson, index) => (
          <div className="lesson-field relative" key={lesson.id}>
            <button
              className="text-xs absolute top-2 right-0 text-danger underline"
              onClick={() => removeLesson(lesson.id)}
            >
              Remove Lesson
            </button>

            <div className="space-y-2 w-full">
              <Label htmlFor={`lesson-name-${lesson.id}`}>Lesson Name</Label>

              <div className="flex gap-4">
                <Input
                  id={`lesson-name-${lesson.id}`}
                  type="text"
                  name="name"
                  className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                  placeholder="Lesson"
                  value={lesson.name}
                  onChange={(event) => handleInputChange(event, index)}
                />

                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-center justify-center cursor-pointer border rounded-xl px-2">
                      <MoreVertical className="h-6 w-6 text-low" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col gap-3">
                    <h3 className="text-high font-medium text-sm">Options</h3>

                    <div className="py-2 px-3 rounded-xl border border-shade-3 bg-white flex justify-between items-center">
                      <Label className="text-sm space-y-2" htmlFor="lockLesson">
                        <p className="text-high font-medium">Lock Lesson</p>
                        <p className="text-low font-normal">
                          Restrict access to this lesson until unlocked
                        </p>
                      </Label>

                      <div>
                        <Switch
                          aria-readonly
                          className="disabled:opacity-100"
                          id="lockLesson"
                          checked={lesson.isLocked}
                          onCheckedChange={(checked) => handleLessonStatus(checked, index)}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2 w-full mt-4">
              <Label htmlFor={`lesson-video-${lesson.id}`}>Lesson Video</Label>

              <div className="" id={`lesson-video-${lesson.id}`}>
                <VideoDropzone
                  value={lesson.video}
                  onFileDrop={(file) => handleVideoUpload(file, index)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="add-new-lesson-button">
        <button
          className="gap-2 transition-colors p-6 rounded-xl border-2 border-dashed border-shade-3 flex items-center justify-center bg-white hover:bg-offwhite w-full"
          onClick={addLesson}
        >
          <Plus className="w-5 h-5 text-orange" />

          <span className="text-high text-sm font-medium">Add New Lesson</span>
        </button>
      </div>
    </div>
  );
}
