"use client";

import { AxiosError } from "axios";
import { Plus, SendHorizonal } from "lucide-react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import Select, { StylesConfig } from "react-select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { inviteTutorFormSchema } from "@/lib/schemas";
import { inviteTutor } from "@/lib/account";
import { useCourses } from "@/hooks/useAdmin";

interface OptionType {
  label: string;
  value: string;
}

const selectStyles: StylesConfig<OptionType, true> = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "10px",
    minHeight: "40px",
    border: state.isFocused ? "1px solid #f38708" : "1px solid hsl(0, 0%, 80%)",
    boxShadow: "none",
    "&:hover": {
      border: "1px solid hsl(0, 0%, 80%)",
    },
    padding: "4px",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#ffe7ca",
    borderRadius: "6px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#f38708",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#f38708",
    ":hover": {
      backgroundColor: "#f38708",
      color: "white",
    },
  }),
};

export function AddTutorDialog() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [courses, setCourses] = useState<OptionType[]>([]);
  const [errors, setErrors] = useState<{ email?: string; courseIds?: string }>({});

  const { data: allCourses, isLoading: coursesLoading } = useCourses({ status: "published" });

  const courseOptions = allCourses
    ? allCourses.map((course) => {
        return { value: course.id, label: course.title };
      })
    : [];

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const courseIds = courses.map((course) => course.value);

    const zodResponse = inviteTutorFormSchema.safeParse({ email, courseIds });

    if (!zodResponse.success) {
      const fieldErrors = zodResponse.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        courseIds: fieldErrors.courseIds?.[0],
      });
      return;
    }

    // console.log(email, courseIds);

    setIsSubmitting(true);

    try {
      const response = await inviteTutor({ email, courseIds });
      console.log("Invite Tutor Response Data", response);

      toast.success("Tutor invitation sent successfully!");
      setErrors({});
      setEmail("");
      setCourses([]);
    } catch (error) {
      console.error("Invite Tutor Form Error", error);

      if (error instanceof AxiosError)
        toast.error(
          error.response?.data?.message || "Unable to send invitation. Please try again.",
        );
      else toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDialogClose(open: boolean) {
    if (!open) {
      setErrors({});
      setEmail("");
      setCourses([]);
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant={"_default"} className="bg-orange hover:bg-burnt px-4 py-2 h-10">
          <Plus className="w-6 h-6" strokeWidth={3} />
          <span>Add Tutor</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[500px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Invite Tutor</DialogTitle>
            <DialogDescription>Add new tutor</DialogDescription>
          </DialogHeader>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              placeholder="someone@example.com"
              type="email"
              id="email"
              className={cn(
                "shadow-none px-4 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange",
                !!errors.email && "border-2 border-destructive",
              )}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            {errors.email && (
              <p className="text-sm font-medium text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="courses">Courses</Label>

            {coursesLoading ? (
              <>Loading...</>
            ) : (
              <Select
                isMulti
                options={courseOptions}
                value={courses}
                onChange={(selected) => setCourses(selected ? (selected as OptionType[]) : [])}
                styles={selectStyles}
                placeholder="Select courses..."
                className="react-select-container text-sm"
                classNamePrefix="react-select"
              />
            )}
            {errors.courseIds && (
              <p className="text-sm font-medium text-destructive mt-1">{errors.courseIds}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="_outline"
                className="text-orange px-6 py-2 h-10 bg-white border border-shade-3 hover:bg-offwhite"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              variant={"_default"}
              className="bg-orange hover:bg-burnt px-4 py-2 h-10"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <span>Send Invite</span>
                  <SendHorizonal className="w-6 h-6" strokeWidth={3} />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
