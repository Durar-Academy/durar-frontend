// Server component wrapper to ensure manifest generation
import { StudentPageClient } from "./page-client";

export const metadata = {
  title: "Student Dashboard",
};

export default function StudentPage() {
  return <StudentPageClient />;
}

