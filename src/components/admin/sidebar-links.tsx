"use client";

import { ADMIN_SIDEBAR_LINKS } from "@/data/constants";

export function SidebarLinks() {
  return (
    <div className="flex flex-col gap-3">
      {ADMIN_SIDEBAR_LINKS.map((item, index) => {
        const Component = item.component;
        return <Component key={index} {...item.props} />;
      })}
    </div>
  );
}
