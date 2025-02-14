import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-shade-3 bg-transparent px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-0 focus-visible:ring-0 focus-visible:border-2 focus-visible:border-orange disabled:cursor-not-allowed disabled:opacity-50 text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
