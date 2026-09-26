"use client";
import Table from "./Table";
import { useTutorClasses } from "@/hooks/tutorQueries";
import { processTutorClasses } from "@/utils/tutorProcessor";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

function getMeetingUrl(link?: string | null) {
  const value = link?.trim();
  if (!value) return null;

  const markdownLink = value.match(/^\[[^\]]+\]\((https?:\/\/[^\s)]+)\)$/);
  return markdownLink ? markdownLink[1] : value;
}

export default function UpcomingClasses() {
  const [page, setPage] = useState(1);
  const { data: classesData, isLoading } = useTutorClasses({ page });

  const classData = processTutorClasses(classesData);
  return (
    <section>
      <h1 className="text-xl mb-4 font-semibold">Upcoming Classes</h1>
      {isLoading ? (
        <Skeleton className="w-full h-[200px] rounded-xl" />
      ) : classData.length == 0 ? (
        <p className="text-sm text-high">No upcoming classes found</p>
      ) : (
        <Table
          headers={["Day", "Student", "Category", "Time", "Action"]}
          data={classData}
          renderRow={(item, index) => {
            const meetingUrl = getMeetingUrl(item.link);

            return (
            <tr
              key={index}
              className="bg-[#F8F8FA] text-sm"
            >
              <td className="w-[110px] whitespace-nowrap rounded-l-xl border-y border-l border-[#D2D4E0] px-4 py-3">
                {item.day}
              </td>
              <td className="max-w-[180px] truncate border-y border-[#D2D4E0] px-4 py-3" title={item.student}>
                {item.student}
              </td>
              <td className="max-w-[150px] truncate border-y border-[#D2D4E0] px-4 py-3" title={item.category}>
                {item.category}
              </td>
              <td className="w-[150px] whitespace-nowrap border-y border-[#D2D4E0] px-4 py-3">
                {item.time}
              </td>
              <td className="w-[120px] whitespace-nowrap rounded-r-xl border-y border-r border-[#D2D4E0] px-4 py-3 text-right">
                {meetingUrl ? (
                  <a
                    href={meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-md border border-orange px-2.5 py-1 text-sm font-semibold text-orange hover:bg-orange hover:text-white"
                  >
                    Start Class
                  </a>
                ) : (
                  <span className="text-low text-sm">No link</span>
                )}
              </td>
            </tr>
            );
          }}
        />
      )}
    </section>
  );
}
