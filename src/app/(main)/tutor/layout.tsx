
import { TutorSidebar } from "@/components/tutor/sidebar";

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-screen h-screen overflow-hidden flex bg-offwhite">
      <TutorSidebar />
      <main className="p-6 w-full h-full overflow-y-scroll">{children}</main>
    </section>
  );
}
