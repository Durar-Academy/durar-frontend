import { CreateCourseFormProvider } from "@/contexts/create-course-form-provider";

export default function CreateCourseLayout({ children }: { children: React.ReactNode }) {
  return <CreateCourseFormProvider>{children}</CreateCourseFormProvider>;
}
