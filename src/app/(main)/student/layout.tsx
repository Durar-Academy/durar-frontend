import { StudentSidebar } from "@/components/student/sidebar";

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
