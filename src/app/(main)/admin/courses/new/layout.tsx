import { CreateCourseFormProvider } from "@/contexts/create-course-form-context";

export default function CreateCourseLayout({ children }: { children: React.ReactNode }) {
  return <CreateCourseFormProvider>{children}</CreateCourseFormProvider>;
}
