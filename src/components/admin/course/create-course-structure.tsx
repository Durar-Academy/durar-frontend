"use client";

import { Plus } from "lucide-react";
import { ChangeEvent } from "react";

import { VideoDropzone } from "@/components/admin/course/video-dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreateCourseFormProvider } from "@/hooks/useForm";

export function CreateCourseStructure() {
  const { formData, updateFormData } = useCreateCourseFormProvider();

  const addLesson = () => {
    const maxId = formData.Lesson.reduce((max, lesson) => (lesson.id > max ? lesson.id : max), 0);
    const newId = maxId + 1;
    updateFormData({
      ...formData,
      Lesson: [...formData.Lesson, { name: "", video: null, id: newId }],
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

    console.log(newLessons);

    newLessons[index].video = file;

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

              <Input
                id={`lesson-name-${lesson.id}`}
                type="text"
                name="name"
                className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                placeholder="Lesson"
                value={lesson.name}
                onChange={(event) => handleInputChange(event, index)}
              />
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
