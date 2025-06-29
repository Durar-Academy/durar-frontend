"use client";

import { format } from "date-fns";
import { ArrowRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ControlledDatePicker } from "@/components/ui/date-picker";

import { useCourses } from "@/hooks/useAdmin";
import { useTutorQuizFormProvider } from "@/hooks/useTutorForm";

export default function AddNewQuizPage() {
  const { data: allCourses, isLoading: coursesLoading } = useCourses({
    status: "published",
  });

  const { formData, updateFormData, cancelForm, nextStep } =
    useTutorQuizFormProvider();

  console.log("FORMDATA:PAGE 1", formData);

  const courseOptions = allCourses
    ? allCourses.map((course) => {
        return { value: course.id, label: course.title };
      })
    : [];

  return (
    <section className="flex flex-col gap-5 w-full h-full">
      <div className="w-full bg-white rounded-xl border border-shade-2 p-6 h-full flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-high font-medium text-lg">Quiz Details</h3>

          <div className="flex gap-3">
            <Button
              variant={"_outline"}
              className="text-danger bg-white rounded-xl py-2 px-4 h-10 hover:bg-offwhite"
              onClick={cancelForm}
            >
              <X className="w-5 h-5 text-inherit" />
              <span>Cancel</span>
            </Button>

            <Button
              variant={"_outline"}
              onClick={nextStep}
              className="text-orange bg-white rounded-xl py-2 px-4 h-10 hover:bg-offwhite"
            >
              <ArrowRight className="w-5 h-5 text-inherit" />
              <span>Next</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex item-center justify-between gap-4 flex-col lg:flex-row">
            <div className="space-y-2 w-full">
              <Label htmlFor="title">Title</Label>

              <Input
                id="title"
                type="text"
                className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                placeholder="Quiz"
                value={formData.title}
                onChange={(event) =>
                  updateFormData({
                    ...formData,
                    title: event.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="category">Course</Label>

              <Select
                value={formData.courseId}
                onValueChange={(value) =>
                  updateFormData({
                    ...formData,
                    courseId: value,
                  })
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
              className="h-24 resize-none shadow-none px-3 py-2 rounded-[10px] placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
              placeholder="Description"
              value={formData.description}
              onChange={(event) =>
                updateFormData({
                  ...formData,
                  description: event.target.value,
                })
              }
            />
          </div>

          <div className="flex item-center justify-between gap-4 flex-col xl:flex-row">
            <div className="space-y-2 w-full">
              <Label htmlFor="dueDate">Due Date</Label>

              <ControlledDatePicker
                date={formData.dueAt as Date}
                setDate={(date) =>
                  updateFormData({
                    ...formData,
                    dueAt: date
                      ? (format(date, "yyyy-MM-dd") as unknown as Date)
                      : null,
                  })
                }
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="timeLimit">Time Limit (Minutes)</Label>

              <Input
                id="timeLimit"
                type="text"
                className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                placeholder="1"
                value={String(formData.duration)}
                onChange={({ target: { value } }) => {
                  if (value === "" || !isNaN(Number(value))) {
                    updateFormData({
                      ...formData,
                      duration: value === "" ? 0 : Number(value),
                    });
                  }
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
                value={String(formData.totalScore)}
                onChange={({ target: { value } }) => {
                  if (value === "" || !isNaN(Number(value))) {
                    updateFormData({
                      ...formData,
                      totalScore: value === "" ? 0 : Number(value),
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-xl border border-shade-2 p-6 flex flex-col gap-4">
        <h3 className="text-high font-medium text-lg">Advanced Settings</h3>

        <div className="flex gap-4 flex-col xl:flex-row">
          <div className="py-4 px-6 rounded-xl border border-shade-3 bg-white flex justify-between items-center w-full">
            <Label className="text-sm space-y-2" htmlFor="randomize">
              <p className="text-high font-medium">Randomize Questions</p>

              <p className="text-low font-normal">
                The questions can be in any order
              </p>
            </Label>

            <div>
              <Switch
                aria-readonly
                className="disabled:opacity-100"
                id="randomize"
                checked={formData.randomnize}
                onCheckedChange={(checked) =>
                  updateFormData({ ...formData, randomnize: checked })
                }
              />
            </div>
          </div>

          <div className="py-4 px-6 rounded-xl border border-shade-3 bg-white flex justify-between items-center w-full">
            <Label className="text-sm space-y-2" htmlFor="autoGrade">
              <p className="text-high font-medium">Auto Grading</p>

              <p className="text-low font-normal">
                {" "}
                Allow the system to grade the performance
              </p>
            </Label>

            <div>
              <Switch
                aria-readonly
                className="disabled:opacity-100"
                id="autoGrade"
                checked={formData.autograded}
                onCheckedChange={(checked) =>
                  updateFormData({ ...formData, autograded: checked })
                }
              />
            </div>
          </div>
        </div>

        <div className="py-4 px-6 rounded-xl border border-shade-3 bg-white flex justify-between items-center w-full">
          <Label className="text-sm space-y-2" htmlFor="lateSubmission">
            <p className="text-high font-medium"> Late Submission</p>

            <p className="text-low font-normal">
              Allow late submissions from students
            </p>
          </Label>

          <div>
            <Switch
              aria-readonly
              className="disabled:opacity-100"
              id="lateSubmission"
              checked={formData.allowLate}
              onCheckedChange={(checked) =>
                updateFormData({ ...formData, allowLate: checked })
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
