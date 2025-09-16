"use client";

import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface note {
  content: string;
  date: string; // example: "2025-04-09"
  title: string;
}

interface noteTableProps {
  notes: note[];
  triggerShowNote: () => void;
  page: number;
  setPage: (page: number) => void;
  isLoading: boolean;
  metaData?: {
    page: number;
    perPage: number;
    pageCount: number;
    totalCount: number;
    hasPreviousPages: boolean;
    hasNextPages: boolean;
    links: { number: number; url: string }[];
  };
}

export default function NotesTable({ notes, triggerShowNote, page, setPage, isLoading, metaData }: noteTableProps) {
  const [search, setSearch] = useState("");

  const filterednotes = notes.filter((note) => {
    return (
      note.content.toLowerCase().includes(search.toLowerCase()) ||
      note.date.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center w-full gap-3">
        <h2 className="text-xl text-high">Notes</h2>
        <span className="flex-1"></span>

        {/* Search Box */}
        <div className="h-11 rounded-lg border-[#D2D4E0] border-[1px] flex items-center justify-center p-3 w-[10rem]">
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[7rem] border-none outline-none text-sm"
          />
          <Image
            src="/SVGs/searchIcon.svg"
            alt="search Icon"
            width={16}
            height={16}
          />
        </div>

        {/* Create note Button */}
        <button
          className="flex gap-3 text-sm bg-orange border-[1px] border-orange text-white p-3 rounded-lg justify-center items-center"
          onClick={triggerShowNote}
        >
          Add new note
          <Image
            src={"/SVGs/arrow.svg"}
            alt="export icon"
            width={16}
            height={16}
          />
        </button>
      </div>

      {/* Table or Loading Skeleton */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <Skeleton className="w-full rounded-xl h-[140px]" />
        ) : (
          <table className="text-sm min-w-full bg-white border-none border-separate border-spacing-y-3">
            <tbody>
              {filterednotes.map((note, i) => (
                <tr
                  key={i}
                  className="border-[1px] bg-[#F8F8FA] border-[#D2D4E0] mt-3"
                >
                  <td className="text-base py-4 pl-3 border-[1px] border-[#D2D4E0] rounded-l-xl border-r-0">
                    {note?.content}
                  </td>

                  <td className="text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl text-orange cursor-pointer hover:underline">
                    <p className="text-sm text-high flex items-center gap-1">
                      <Image
                        src={"/SVGs/dateIcon.svg"}
                        alt="Date Icon"
                        height={16}
                        width={16}
                      />
                      {note.date}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {metaData && (metaData.pageCount > 1) && (
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span className="px-2 text-sm">Page {page} of {metaData.pageCount}</span>
          <button
            className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page >= metaData.pageCount}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
