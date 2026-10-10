"use client";

import { ChevronRight, UserPlus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Select, { StylesConfig } from "react-select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";
import { useCurrentUser } from "@/hooks/useAccount";
import { useAssignCoursesToUser, useCourses, useTutors } from "@/hooks/useAdmin";

type Option = { label: string; value: string };

const selectStyles: StylesConfig<Option, true> = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "10px",
    border: state.isFocused ? "2px solid #f38708" : "1px solid hsl(0, 0%, 80%)",
    boxShadow: "none",
    "&:hover": { borderColor: "#f38708" },
  }),
  menu: (base) => ({ ...base, zIndex: 20, fontSize: "14px" }),
  valueContainer: (base) => ({ ...base, padding: "4px 10px" }),
  multiValue: (base) => ({ ...base, backgroundColor: "#ffe7ca", borderRadius: "6px" }),
  multiValueLabel: (base) => ({ ...base, color: "#f38708" }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#f38708",
    ":hover": { backgroundColor: "#f38708", color: "white" },
  }),
};

export function AssignTutorForm() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const [tutor, setTutor] = useState<Option | null>(null);
  const [courses, setCourses] = useState<Option[]>([]);
  const assignment = useAssignCoursesToUser();
  const { data: tutors, isLoading: tutorsLoading } = useTutors({ status: "active", page: 1, limit: 100 });
  const { data: allCourses, isLoading: coursesLoading } = useCourses({ status: "published", page: 1, limit: 100 });

  const tutorOptions = (tutors?.records ?? []).map((item: Tutor) => ({
    value: item.id,
    label: `${item.firstName} ${item.lastName} (${item.email})`,
  }));
  const courseOptions = (allCourses ?? []).map((course) => ({ value: course.id, label: course.title }));

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
      setTutor(null);
      setCourses([]);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Unable to assign tutor to course.");
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="h-[80px] w-full rounded-xl" />
        ) : (
          <TopBar subtext="Assign an existing tutor to courses" user={user as User}>
            <p className="flex items-center gap-1">
              <Link href="/admin" className="hover:underline">Users</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/admin/tutors" className="hover:underline">Tutors</Link>
              <ChevronRight className="h-4 w-4" />
              <span>Assign tutor</span>
            </p>
          </TopBar>
        )}
      </div>

      <div className="mx-auto w-full max-w-[675px]">
        <div className="rounded-xl border border-shade-2 bg-white p-6 dashboard-shadow">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-low">Course</Label>
            <Select<Option, true>
              isMulti
              options={courseOptions}
              value={courses}
              onChange={(value) => setCourses(value ? [...value] : [])}
              isLoading={coursesLoading}
              placeholder="Select course..."
              styles={selectStyles}
              className="react-select-container text-sm"
              classNamePrefix="react-select"
              noOptionsMessage={() => "No courses available"}
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
              noOptionsMessage={() => "No active tutors available"}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="_default"
              className="bg-green hover:bg-dark-green"
              onClick={submit}
              disabled={assignment.isPending || tutorsLoading || coursesLoading}
            >
              <UserPlus className="h-4 w-4" />
              {assignment.isPending ? "Assigning..." : "Assign Tutor"}
            </Button>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
