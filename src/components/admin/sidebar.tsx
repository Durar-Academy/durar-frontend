import Image from "next/image";

import { SidebarLinks } from "@/components/admin/sidebar-links";

export function AdminSidebar() {
  return (
    <aside className="w-[260px] shrink-0 h-full bg-green p-8">
      <div className="relative w-32 h-10">
        <Image src={"/logo-white.svg"} fill alt="Durar Logo" className="object-cover object-center" />
      </div>

      <div className="mt-[60px]">
        <SidebarLinks />
      </div>
    </aside>
  );
}
