export function OverviewCard({ overview }: { overview: OverviewCardProps }) {
    return (
      <div className="flex h-full min-w-0 w-full items-center justify-between gap-3 rounded-xl border border-shade-2 bg-offwhite p-4 sm:p-6">
        <div className="min-w-0 flex flex-col gap-1">
          <p className="truncate capitalize text-sm font-medium text-low">{overview.title}</p>
  
          <h3 className="text-high font-semibold text-left">{overview.figure}</h3>
        </div>
  
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">{overview.children}</div>
      </div>
    );
  }
