"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Select, { StylesConfig } from "react-select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAssignCoursesToUser, useCourses, useTutors } from "@/hooks/useAdmin";

type Option = { label: string; value: string };

const selectStyles: StylesConfig<Option, boolean> = {
  control: (base, state) => ({
    ...base,
    minHeight: "40px",
    borderRadius: "10px",
    border: state.isFocused ? "1px solid #f38708" : "1px solid hsl(0, 0%, 80%)",
    boxShadow: "none",
    "&:hover": { border: "1px solid #f38708" },
  }),
  menu: (base) => ({ ...base, fontSize: "14px" }),
  valueContainer: (base) => ({ ...base, padding: "2px 8px" }),
};

export function AssignTutorDialog() {
  const [tutor, setTutor] = useState<Option | null>(null);
  const [courses, setCourses] = useState<Option[]>([]);
  const assignment = useAssignCoursesToUser();
  const { data: tutors, isLoading: tutorsLoading } = useTutors({ status: "active", page: 1, limit: 100 });
  const { data: allCourses, isLoading: coursesLoading } = useCourses({ page: 1, limit: 100 });

  const tutorOptions = (tutors?.records ?? []).map((item: Tutor) => ({
    value: item.id,
    label: `${item.firstName} ${item.lastName} (${item.email})`,
  }));
  const courseOptions = (allCourses ?? []).map((course) => ({ value: course.id, label: course.title }));

  const reset = () => {
    setTutor(null);
    setCourses([]);
  };

  const submit = async () => {
    if (!tutor || courses.length === 0) {
      toast.error("Select a tutor and at least one course.");
      return;
    }

    try {
      await assignment.mutateAsync({
        userId: tutor.value,
        courseIds: courses.map((course) => course.value),
      });
      toast.success("Tutor assigned to course successfully.");
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Unable to assign tutor to course.");
    }
  };

  return (
    <Dialog onOpenChange={(open) => !open && reset()}>
      <DialogTrigger asChild>
        <Button variant="_outline" className="h-10 border-green px-4 py-2 text-green hover:bg-offwhite">
          <UserPlus className="h-5 w-5" />
          <span>Assign Tutor</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Tutor to Courses</DialogTitle>
          <DialogDescription>Select an existing tutor and the courses they should manage.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-low">Course</Label>
            <Select<Option, true>
              isMulti
              options={courseOptions}
              value={courses}
              onChange={(value) => setCourses(value as Option[])}
              isLoading={coursesLoading}
              placeholder="Select course..."
              styles={selectStyles}
              className="react-select-container text-sm"
              classNamePrefix="react-select"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-low">Tutor</Label>
            <Select<Option, false>
              options={tutorOptions}
              value={tutor}
              onChange={(value) => setTutor(value)}
              isLoading={tutorsLoading}
              placeholder="Select tutor..."
              isClearable
              styles={selectStyles as unknown as StylesConfig<Option, false>}
              className="react-select-container text-sm"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="_outline" onClick={reset}>Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            variant="_default"
            className="bg-green hover:bg-dark-green"
            onClick={submit}
            disabled={assignment.isPending}
          >
            {assignment.isPending ? "Assigning..." : "Assign Tutor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
