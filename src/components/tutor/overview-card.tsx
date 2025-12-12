export function OverviewCard({ overview }: { overview: OverviewCardProps }) {
    return (
      <div className="bg-offwhite border border-shade-2 p-6 rounded-xl w-full flex justify-between items-center h-full">
        <div className="flex flex-col gap-1">
          <p className="capitalize text-low text-sm font-medium">{overview.title}</p>
  
          <h3 className="text-high font-semibold text-left">{overview.figure}</h3>
        </div>
  
        <div className="rounded-full bg-white w-12 h-12 flex items-center justify-center">{overview.children}</div>
      </div>
    );
  }
  