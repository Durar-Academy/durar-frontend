import { StudentSidebar } from "@/components/student/sidebar";

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex min-h-screen w-full bg-offwhite lg:h-screen lg:overflow-hidden">
      <StudentSidebar />

      <main className="min-w-0 w-full overflow-x-hidden px-4 pb-6 pt-20 sm:px-6 sm:pt-6 lg:h-full lg:overflow-y-auto lg:pt-6">{children}</main>
    </section>
  );
}
