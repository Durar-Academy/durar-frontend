import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";

import WaveSurfer from "@wavesurfer/react";
import type WaveSurferType from "wavesurfer.js";

interface AudioPlayerProps {
  audioUrl: string;
}

// Format time to MM:SS
const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const wavesurferRef = useRef<WaveSurferType | null>(null);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!wavesurferRef.current) return;

    if (isPlaying) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }
  };

  const onReady = (ws: WaveSurferType, duration: number) => {
    wavesurferRef.current = ws;
    setDuration(duration);
  };

  const onPlay = () => setIsPlaying(true);

  const onPause = () => setIsPlaying(false);

  const onTimeupdate = (ws: WaveSurferType, currentTime: number) => {
    wavesurferRef.current = ws;
    setCurrentTime(currentTime);
  };

  const onFinish = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <div className="flex items-center gap-3 w-[360px] rounded-full p-2">
      <div>
        <button
          onClick={togglePlayPause}
          className="border border-shade-2 text-orange rounded-full p-2"
          disabled={!wavesurferRef.current}
          type="button"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>

      <div className="w-3/4">
        <WaveSurfer
          height={40}
          waveColor="#e5e7eb"
          progressColor="#f38708"
          barWidth={2}
          barGap={6}
          barRadius={12}
          url={audioUrl}
          onReady={onReady}
          onPlay={onPlay}
          onPause={onPause}
          onTimeupdate={onTimeupdate}
          onFinish={onFinish}
        />
      </div>

      <div className="text-low text-sm font-medium">
        <span>{formatTime(currentTime)}</span>/<span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
