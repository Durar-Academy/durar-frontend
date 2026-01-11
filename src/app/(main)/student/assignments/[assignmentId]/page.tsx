"use client";

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

import { ChevronRight, Plus, SendHorizonalIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

import { TopBar } from "@/components/shared/top-bar";
import { AudioPlayer } from "@/components/student/audio-player";
import { AudioRecorder } from "@/components/student/audio-recorder";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAccount";

interface RecordingItem {
  id: string;
  blob: Blob | null;
  url: string;
  duration: number;
  createdAt: Date;
}
export default function Assignment() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();

  const [recordings, setRecordings] = useState<RecordingItem[]>(
    Array.from({ length: 10 }).map(() => ({
      id: uuidV4(),
      blob: null,
      url: "",
      duration: 0,
      createdAt: new Date(),
    })),
  );

  const addNewVerseRecorder = () => {
    const newItem: RecordingItem = {
      id: uuidV4(),
      blob: null,
      url: "",
      duration: 0,
      createdAt: new Date(),
    };
    setRecordings((prev) => [...prev, newItem]);
  };

  const handleRecordingComplete = (id: string, blob: Blob, duration: number) => {
    const url = URL.createObjectURL(blob);

    setRecordings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, blob, url, duration } : item)),
    );
  };

  const deleteVerse = (id: string) => {
    const item = recordings.find((r) => r.id === id);
    if (item?.url) URL.revokeObjectURL(item.url);

    setRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  // Clean up audio URLs on unmount
  useEffect(() => {
    return () => {
      recordings.forEach((r) => {
        if (r.url) URL.revokeObjectURL(r.url);
      });
    };
  }, [recordings]);

  return (
    <section className="flex flex-col gap-3">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={"Assignment - Name"} user={user as User}>
            <p className="flex items-center gap-1">
              <Link href={"/assignments"} className="hover:underline">
                Assignments
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span>Submit Assignment</span>
            </p>
          </TopBar>
        )}
      </div>

      <div className="bg-white border border-shade-2 rounded-xl p-6 flex justify-between flex-wrap gap-6">
        <div className="flex flex-col gap-4 font-medium">
          <h3 className="text-high text-sm">Surat Name</h3>

          <p className="text-low text-sm">Assignment Instruction</p>

          <div className="mt-2">
            <AudioPlayer />
          </div>
        </div>

        <div>
          <Button className="bg-orange hover:bg-burnt" variant={"_default"}>
            <SendHorizonalIcon className="size-4" />
            Submit Assignment
          </Button>
        </div>
      </div>

      <div className="bg-white border border-shade-2 rounded-xl p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-base text-high font-semibold ">Verse Recordings</h2>
            <button
              onClick={addNewVerseRecorder}
              className="bg-white border border-orange text-orange px-3 py-1 rounded-md flex items-center gap-2"
            >
              <Plus size={16} />
              Add Verse
            </button>
          </div>

          {/* Recording List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
            {recordings.map((item, index) => (
              <div key={item.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-700">Verse {index + 1}</p>

                  <button
                    onClick={() => deleteVerse(item.id)}
                    className="text-danger text-sm gap-1 flex items-center"
                    title="Delete this verse"
                  >
                    <Trash2 size={16} />
                    Verse {index + 1}
                  </button>
                </div>

                <AudioRecorder
                  onRecordingComplete={(blob, duration) =>
                    handleRecordingComplete(item.id, blob, duration)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
