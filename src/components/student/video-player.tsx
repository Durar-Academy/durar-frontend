"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { initializeLesson, updateLessonProgress } from "@/lib/student";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export function VideoPlayer({ lesson }: { lesson: Lesson | undefined }) {
  const lastReportedProgress = useRef(0);
  const hasStarted = useRef(false);
  const hasEnded = useRef(false);
  const [loading, setLoading] = useState(true);

  const handleStart = useCallback(async () => {
    if (hasStarted.current || !lesson) return;

    try {
      hasStarted.current = true;
      setLoading(false);

      const response = await initializeLesson(lesson.id);
      console.log("INITIALIZE VIDEO RESPONSE: ", response.data);
    } catch (error) {
      console.log("INITIALIZE VIDEO ERROR: ", error);
    }
  }, [lesson]);

  const handleEnd = useCallback(async () => {
    if (hasEnded.current || !lesson) return;

    try {
      hasEnded.current = true;
      const response = await updateLessonProgress(lesson.id, { progress: 100 });
      console.log("VIDEO COMPLETE RESPONSE: ", response.data);
    } catch (error) {
      console.log("VIDEO COMPLETE ERROR: ", error);
    }
  }, [lesson]);

  const handleProgress = useCallback(
    async ({ played }: { played: number }) => {
      if (!lesson) return;

      const currentProgress = Math.floor(played * 100);
      const nextCheckpoint = lastReportedProgress.current + 5;

      if (currentProgress < nextCheckpoint || currentProgress >= 100) return;
      lastReportedProgress.current = currentProgress;

      try {
        const response = await updateLessonProgress(lesson.id, { progress: currentProgress });
        console.log("VIDEO PROGRESS RESPONSE: ", response.data);
      } catch (error) {
        console.log("VIDEO PROGRESS ERROR: ", error);
      }
    },
    [lesson],
  );

  if (!lesson) {
    return (
      <div className="w-full h-[450px] flex items-center justify-center rounded-xl border border-shade-2 bg-white text-low text-lg">
        Requested lesson is unavailable
      </div>
    );
  }

  if (lesson.isLocked) {
    return (
      <div className="relative w-full h-[450px] flex items-center justify-center rounded-xl border border-shade-2 bg-white">
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-xl font-bold z-10">
          This video is currently locked
        </div>
      </div>
    );
  }

  if (!lesson.mediaId) {
    return (
      <div className="w-full h-[450px] flex items-center justify-center rounded-xl border border-shade-2 bg-white text-low text-lg">
        Requested video is unavailable
      </div>
    );
  }

  return (
    <div className="relative w-full border border-shade-3 rounded-xl">
      {loading ? (
        <Skeleton className="w-full h-[450px] rounded-xl" />
      ) : (
        <ReactPlayer
          url={lesson.mediaId}
          controls
          playing
          width="100%"
          height="450px"
          pip
          light
          onStart={handleStart}
          onEnded={handleEnd}
          onProgress={handleProgress}
        />
      )}
    </div>
  );
}
