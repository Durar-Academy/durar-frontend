import { useRef } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTutorTimetable } from "@/hooks/tutorQueries";
import { processTutorTimetable } from "@/utils/tutorProcessor";

export default function QuranTimetable() {
  const tableRef = useRef<HTMLDivElement>(null);

  const { data: timetableData, isLoading: loading, error: queryError } = useTutorTimetable({});
  
  const timetable = processTutorTimetable(timetableData);
  const error = queryError ? "Failed to load timetable. Please try again." : "";

  const days = ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"];

  const handleDownload = async () => {
    if (tableRef.current) {
      const dataUrl = await toPng(tableRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "quran-timetable.png";
      link.click();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Quran Timetable</h2>
        <Button
          className="bg-orange text-sm font-medium text-white hover:bg-orange/90 flex justify-center items-center gap-1.5"
          onClick={handleDownload}
        >
          <Image
            src={"/SVGs/download.svg"}
            width={20}
            height={20}
            alt="download icon"
          />
          <span>Download</span>
        </Button>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="text-red-500 font-medium p-4 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((_, idx) => (
            <div
              key={idx}
              className="h-10 bg-gray-200 animate-pulse rounded"
            ></div>
          ))}
        </div>
      ) : (
        <div
          ref={tableRef}
          className="overflow-x-auto rounded-lg border p-4 bg-white"
        >
          <table className="w-full text-sm text-center border-collapse">
            <thead>
              <tr>
                <th className="border p-2">PERIOD</th>
                {days.map((day) => (
                  <th key={day} className="border p-2">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timetable.map((entry, index) => (
                <tr key={index}>
                  <td className="border p-2 font-medium">{entry.period}</td>
                  {days.map((day) => (
                    <td key={day} className="border p-2">
                      {entry.schedule[day] ? (
                        <div className="space-y-1">
                          <p>{entry.schedule[day].teacher}</p>
                          <a
                            href={entry.schedule[day].profileLink}
                            className="text-orange text-xs underline"
                          >
                            view profile
                          </a>
                        </div>
                      ) : (
                        <p className="text-gray-400 text-xs">N/A</p>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
