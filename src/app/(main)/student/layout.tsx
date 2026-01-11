import { StudentSidebar } from "@/components/student/sidebar";
import type { Metadata } from "next";

// Force metadata generation to ensure manifest is created
export const metadata: Metadata = {
  title: "Student Dashboard",
};

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="w-full h-screen overflow-hidden flex bg-offwhite">
      <StudentSidebar />

      <main className="p-6 w-full h-full overflow-y-scroll">{children}</main>
    </section>
  );
}
