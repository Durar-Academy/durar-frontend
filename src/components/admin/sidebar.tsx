import { ResponsiveSidebar } from "@/components/shared/responsive-sidebar";
import { SidebarLinks } from "@/components/admin/sidebar-links";

export function AdminSidebar() {
  return (
    <ResponsiveSidebar>
        <SidebarLinks />
    </ResponsiveSidebar>
  );
}
