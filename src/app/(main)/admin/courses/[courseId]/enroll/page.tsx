"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import ReactSelect from "react-select";
import { ArrowLeft, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "@/components/shared/top-bar";
import { useCurrentUser } from "@/hooks/useAccount";
import { useCourse, useEnrollStudent, useStudents } from "@/hooks/useAdmin";

type StudentOption = { label: string; value: string };

export default function EnrolStudentPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const courseId = params.courseId;
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: students, isLoading: studentsLoading } = useStudents();
  const enrollment = useEnrollStudent();
  const [selected, setSelected] = useState<StudentOption | null>(null);


  const studentRecords = Array.isArray(students) ? students : [];
  const options: StudentOption[] = studentRecords.map((student: Student) => ({
    value: student.id,
    label: `${student.firstName} ${student.lastName} (${student.email})`,
  }));

  const submit = async () => {
    if (!selected) return;
    try {
      await enrollment.mutateAsync({ courseId, userId: selected.value });
      toast.success("Student enrolled successfully.");
      router.push("/admin/courses");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to enrol student. Please try again.";
      toast.error(message);
    }
  };

  return (
    <section className="flex flex-col gap-5">
      {userLoading ? <Skeleton className="h-20 w-full rounded-xl" /> : <TopBar subtext="Enrol a student" user={user as User}><span>Courses / Enrol Student</span></TopBar>}
      <div className="mx-auto w-full max-w-[700px] rounded-xl border border-shade-2 bg-white p-6">
        <Link href="/admin/courses" className="mb-6 flex items-center gap-2 text-sm text-low hover:text-green"><ArrowLeft className="h-4 w-4" />Back to courses</Link>
        <h1 className="text-xl font-semibold text-high">Enrol Student</h1>
        <p className="mt-1 text-sm text-low">Select a student to enrol in {courseLoading ? "this course" : course?.title ?? "this course"}.</p>
        <div className="mt-6 space-y-2">
          <label className="text-sm font-medium text-low" htmlFor="student">Student</label>
          <ReactSelect inputId="student" isLoading={studentsLoading} options={options} value={selected} onChange={(value) => setSelected(value)} placeholder="Search and select a student..." isClearable />
        </div>
        <Button onClick={submit} disabled={!selected || enrollment.isPending} className="mt-6 h-12 w-full rounded-xl bg-green text-white hover:bg-dark-green">
          <GraduationCap className="h-4 w-4" />{enrollment.isPending ? "Enrolling..." : "Enrol Student"}
        </Button>
      </div>
    </section>
  );
}
