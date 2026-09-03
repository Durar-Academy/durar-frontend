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
              className="border-[1px] bg-[#F8F8FA] border-[#D2D4E0] mt-3"
            >
              <td className="text-sm py-4 pl-3 border-[1px] border-[#D2D4E0] rounded-l-xl border-r-0">
                {item.day}
              </td>
              <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                {item.student}
              </td>
              <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                {item.category}
              </td>
              <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                {item.time}
              </td>
              <td className="text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl">
                {meetingUrl ? (
                  <a
                    href={meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange font-semibold hover:underline text-sm"
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
