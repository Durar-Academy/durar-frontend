"use client";

import dynamic from "next/dynamic";

// Dynamically import ReactPlayer to prevent hydration errors
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export function VideoPlayer({ lesson }) {
  // Handle case where lesson is not available
  if (!lesson) {
    return (
      <div className="w-full h-[450px] flex items-center justify-center rounded-xl border-shade-2 text-low text-lg border bg-white">
        Requested lesson is Unavailable
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Show video if available, otherwise show a message */}
      {!lesson.videoUrl ? (
        <div className="w-full h-[450px] flex items-center justify-center rounded-xl border-shade-2 text-low text-lg border bg-white">
          Requested video is Unavailable
        </div>
      ) : (
        <div className="border border-shade-3">
          <ReactPlayer
            url={lesson.videoUrl}
            controls
            playing
            width="100%"
            height="450px"
            pip
            light
          />
        </div>
      )}

      {/* Overlay for locked lessons */}
      {lesson.locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-xl font-bold">
          This video is currently locked
        </div>
      )}
    </div>
  );
}
