import { CircleStop, Mic, Pause, Play, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

type RecorderState = "idle" | "recording" | "paused" | "recorded" | "playing";

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  onDelete?: () => void;
  className?: string;
}

interface RecordingData {
  blob: Blob;
  url: string;
  duration: number;
}

export function AudioRecorder({
  onRecordingComplete,
  onDelete,
  className = "",
}: AudioRecorderProps) {
  const [state, setState] = useState<RecorderState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingData, setRecordingData] = useState<RecordingData | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (state === "recording") {
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 0.1);
      }, 100);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [state]);

  useEffect(() => {
    if (!recordingData || !waveformRef.current) return;

    const wave = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#e5e7eb",
      progressColor: "#f38708",
      barWidth: 2,
      barGap: 6,
      barRadius: 12,
      height: 40,
      cursorWidth: 0,
    });

    wave.loadBlob(recordingData.blob);

    const handlers = {
      finish: () => setState("recorded"),
      play: () => setState("playing"),
      pause: () => setState("recorded"),
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      wave.on(event as keyof typeof handlers, handler);
    });

    waveSurferRef.current = wave;

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        wave.un(event as keyof typeof handlers, handler);
      });
      wave.destroy();
    };
  }, [recordingData]);

  const cleanupMediaResources = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      // const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      const recorder = new MediaRecorder(stream);

      const startTime = Date.now(); // Track actual start time

      audioChunksRef.current = [];
      streamRef.current = stream;
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const duration = (Date.now() - startTime) / 1000; // Calculate actual duration
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        const data = { blob, url, duration };
        setRecordingData(data);
        setState("recorded");
        onRecordingComplete?.(blob, duration);

        cleanupMediaResources();
      };

      recorder.start(100); // Request data every 100ms to ensure we capture short recordings
      setRecordingTime(0);
      setState("recording");
    } catch (err) {
      console.error("Failed to start recording", err);
      alert("Microphone access denied or not available.");
      setState("idle");
    }
  };

  const stopRecording = () => mediaRecorderRef.current?.stop();
  const pauseRecording = () => {
    mediaRecorderRef.current?.pause();
    setState("paused");
  };
  const resumeRecording = () => {
    mediaRecorderRef.current?.resume();
    setState("recording");
  };

  const playRecording = () => {
    waveSurferRef.current?.play();
    setState("playing");
  };

  const pausePlayback = () => {
    waveSurferRef.current?.pause();
    setState("recorded");
  };

  const deleteRecording = () => {
    cleanupAllResources();
    setRecordingData(null);
    setRecordingTime(0);
    setState("idle");
    onDelete?.();
  };

  const cleanupAllResources = () => {
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Cleanup media resources
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    mediaRecorderRef.current = null;
    audioChunksRef.current = [];

    // Cleanup WaveSurfer
    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
      waveSurferRef.current = null;
    }

    // Cleanup recording data URL
    if (recordingData) {
      URL.revokeObjectURL(recordingData.url);
    }
  };

  const renderControls = () => {
    const buttonClass = "p-2 rounded-full hover:bg-gray-100";

    switch (state) {
      case "idle":
        return (
          <button
            onClick={startRecording}
            className={`${buttonClass} text-orange`}
            title="Start recording"
          >
            <Mic size={16} />
          </button>
        );

      case "recording":
        return (
          <>
            <button
              onClick={pauseRecording}
              className={`${buttonClass} text-orange`}
              title="Pause recording"
            >
              <Pause size={16} />
            </button>

            <button
              onClick={stopRecording}
              className={`${buttonClass} text-danger`}
              title="Stop recording"
            >
              <CircleStop size={16} />
            </button>
          </>
        );

      case "paused":
        return (
          <>
            <button
              onClick={resumeRecording}
              className={`${buttonClass} text-orange`}
              title="Resume recording"
            >
              <Play size={16} />
            </button>
            <button
              onClick={stopRecording}
              className={`${buttonClass} text-danger`}
              title="Stop recording"
            >
              <CircleStop size={16} />
            </button>
          </>
        );

      case "recorded":
        return (
          <>
            <button
              onClick={playRecording}
              className={`${buttonClass} text-orange`}
              title="Play recording"
            >
              <Play size={16} />
            </button>

            <button
              onClick={deleteRecording}
              className={`${buttonClass} text-danger`}
              title="Delete recording"
            >
              <Trash2 size={16} />
            </button>
          </>
        );
      case "playing":
        return (
          <>
            <button
              onClick={pausePlayback}
              className={`${buttonClass} text-orange`}
              title="Pause playback"
            >
              <Pause size={16} />
            </button>
            <button
              onClick={deleteRecording}
              className={`${buttonClass} text-danger`}
              title="Delete recording"
            >
              <Trash2 size={16} />
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center gap-3 p-2 rounded-full border w-full ${className} h-14`}>
      {/* Recording Controls */}
      <div>{renderControls()}</div>

      {/* Waveform OR Progress Bar */}
      <div className="w-3/4">
        {(state === "recording" || state === "paused") && (
          <div className="flex items-center gap-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange"
                style={{
                  width: `${Math.min((recordingTime / 60) * 100, 100)}%`,
                }}
              />
            </div>
            <span className="shrink-0 text-low text-sm font-medium">
              {formatTime(recordingTime)}s
            </span>
          </div>
        )}

        {(state === "recorded" || state === "playing") && (
          <div className="flex items-center gap-2">
            <div ref={waveformRef} className="w-full" />

            <span className="shrink-0 text-low text-sm font-medium">
              {recordingData ? formatTime(recordingData.duration) : "0.0"}s
            </span>
          </div>
        )}

        {state === "idle" && <div className="w-full bg-gray-100 rounded-full h-2" />}
      </div>
    </div>
  );
}
