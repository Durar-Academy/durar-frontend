import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full h-screen overflow-hidden flex bg-offwhite">
      <AdminSidebar />

      <main className="p-6">{children}</main>
    </section>
  );
}
