"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  UploadCloud,
  Play,
  Pause,
  Minus,
  Plus,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAccount";
import { useTutorStudents } from "@/hooks/tutorQueries";
import { processTutorStudents } from "@/utils/tutorProcessor";
import { useCourses } from "@/hooks/useAdmin";
import { uploadFile } from "@/lib/storage";
import { axiosInstance } from "@/lib/axios";
import { Top_Bar } from "@/components/tutor/top-bar";

export default function AddNewAssignmentPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: studentsData, isLoading: studentsLoading } = useTutorStudents({
    page: 1,
  });
  const { data: allCourses, isLoading: coursesLoading } = useCourses({
    status: "published",
  });
  const students = processTutorStudents(studentsData);

  const courseOptions = allCourses
    ? allCourses.map((course) => {
        return { value: course.id, label: course.title };
      })
    : [];

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
  const [recitationCount, setRecitationCount] = useState(2);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  type RecordingStatus = "idle" | "recording" | "recorded";
  const [recordingStatus, setRecordingStatus] =
    useState<RecordingStatus>("idle");
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const setAudioFromFile = async (file: File, isUploaded = false) => {
    if (!file.type.startsWith("audio/")) {
      toast.error("Please upload an audio file");
      return;
    }

    // Check for supported audio formats (Cloudinary typically supports: wav, mp3, ogg, m4a, aac, flac)
    const supportedTypes = [
      "audio/wav",
      "audio/wave",
      "audio/x-wav",
      "audio/mpeg",
      "audio/mp3",
      "audio/mp4",
      "audio/m4a",
      "audio/ogg",
      "audio/oga",
      "audio/aac",
      "audio/flac",
    ];

    const isSupported = supportedTypes.some((type) => file.type.includes(type.split("/")[1]));

    // If it's a WebM file (recorded or uploaded), convert it to WAV
    if (file.type.includes("webm")) {
      try {
        toast.loading("Converting audio to WAV format...", { id: "converting" });
        const wavFile = await convertWebMToWAV(file);
        toast.success("Audio converted successfully", { id: "converting" });
        file = wavFile;
      } catch (error) {
        console.error("Error converting WebM to WAV:", error);
        toast.error("Error converting audio. Please try a different format.", { id: "converting" });
        return;
      }
    } else if (!isSupported) {
      toast.error(
        "Unsupported audio format. Please use WAV, MP3, OGG, M4A, or AAC format."
      );
      return;
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    const url = URL.createObjectURL(file);
    setAudioFile(file);
    setAudioUrl(url);
    setAudioDuration(0);
    setAudioCurrentTime(0);
    setIsPlaying(false);
  };

  const handleFileInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await setAudioFromFile(file, true);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await setAudioFromFile(file, true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRecitationChange = (delta: number) => {
    setRecitationCount((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > 10) return 10;
      return next;
    });
  };

  const resetForm = () => {
    setSelectedStudentId("");
    setSelectedCourseId("");
    setTitle("");
    setDescription("");
    setDueDate("");
    setRecitationCount(2);
    setAudioFile(null);
    setAudioUrl(null);
    setAudioDuration(0);
    setAudioCurrentTime(0);
    setIsPlaying(false);
    setRecordingStatus("idle");
    setRecordingSeconds(0);
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    return `${hrs}.${mins}.${secs}`;
  };

  // Convert WebM blob to WAV format (supported by Cloudinary)
  const convertWebMToWAV = async (webmBlob: Blob): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          // Convert AudioBuffer to WAV
          const wavBuffer = audioBufferToWav(audioBuffer);
          const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });
          const file = new File([wavBlob], `quran-assignment-${Date.now()}.wav`, {
            type: "audio/wav",
          });
          resolve(file);
        } catch (error) {
          console.error("Error converting to WAV:", error);
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(webmBlob);
    });
  };

  // Helper function to convert AudioBuffer to WAV format
  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * numChannels * bytesPerSample);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + length * numChannels * bytesPerSample, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, "data");
    view.setUint32(40, length * numChannels * bytesPerSample, true);

    // Convert audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  };

  const handleTogglePlay = () => {
    if (!audioUrl || !audioElementRef.current) return;
    const audio = audioElementRef.current;
    if (audio.paused) {
      audio
        .play()
        .then(() => {
          /* no-op */
        })
        .catch(() => {
          toast.error("Unable to play audio");
        });
    } else {
      audio.pause();
    }
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Recording is not supported in this browser");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const webmFile = new File([blob], `quran-assignment-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        
        // Convert WebM to WAV format (supported by Cloudinary/backend)
        try {
          await setAudioFromFile(webmFile, false);
          toast.success("Recording completed and converted to WAV format");
        } catch (error) {
          console.error("Error converting recording:", error);
          toast.error("Error processing recording. Please try again.");
        }
        
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecordingStatus("recording");
      setRecordingSeconds(0);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording", error);
      toast.error("Unable to start recording. Please check microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setRecordingStatus("recorded");
  };

  const handleToggleRecording = () => {
    if (recordingStatus === "recording") {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Attach audio element listeners for duration / progress
  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setAudioDuration(audio.duration || 0);
    };
    const handleTimeUpdate = () => {
      setAudioCurrentTime(audio.currentTime || 0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [audioUrl]);

  const handleSubmit = async () => {
    if (!selectedStudentId) {
      toast.error("Please select a student");
      return;
    }
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!dueDate) {
      toast.error("Please select a due date");
      return;
    }
    if (!audioFile) {
      toast.error("Please upload an audio file or record one");
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload audio file
      let fileResponse;
      try {
        fileResponse = await uploadFile(audioFile);
      } catch (uploadError: any) {
        console.error("Error uploading file", uploadError);
        
        // Check if it's a file type error from the backend
        if (uploadError?.response?.data?.message?.toLowerCase().includes("unsupported file type")) {
          toast.error(
            "Unsupported audio format. Please use WAV, MP3, OGG, M4A, or AAC format."
          );
        } else if (uploadError?.code === "ERR_NETWORK") {
          toast.error("Network error. Please check your internet connection and try again.");
        } else {
          toast.error("Failed to upload audio file. Please try again.");
        }
        return;
      }

      const payload = {
        title,
        courseId: selectedCourseId,
        dueAt: format(new Date(dueDate), "yyyy-MM-dd"),
        type: "assignment",
        description,
        allowLate: false,
        storageId: fileResponse?.storageId ?? null,
        totalScore: 0,
        studentId: selectedStudentId,
        recitationCount,
      };

      await axiosInstance.post("/assignment", payload);

      toast.success("Assignment sent successfully");
      resetForm();
      router.push("/tutor/assignments");
    } catch (error: any) {
      console.error("Error creating assignment", error);
      
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your internet connection and try again.");
      } else {
        toast.error("Something went wrong while sending assignment");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
        <div className="top-bar">
          {currentUserLoading ? (
            <Skeleton className="w-full rounded-xl h-[100px]" />
          ) : (
          <Top_Bar subtext={"Add New Assignment - Quran Audio"} user={user as User}>
            <p className="flex items-center gap-2 text-sm">
              <span>Assignment</span>
              <ChevronRight className="h-4 w-4" />
              <span>Add Assignment</span>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium">Add New Assignment - Quran Audio</span>
            </p>
            </Top_Bar>
          )}
        </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1.7fr)_minmax(0,1.3fr)] gap-6">
        {/* Left column - form */}
        <div className="bg-white rounded-xl border border-shade-2 p-6 flex flex-col gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-low">Select Student</Label>
            <Select
              value={selectedStudentId}
              onValueChange={setSelectedStudentId}
              disabled={studentsLoading}
            >
              <SelectTrigger className="h-11 rounded-lg border border-orange/70 focus:ring-0 focus-visible:ring-0">
                <SelectValue placeholder={studentsLoading ? "Loading..." : "Select Student"} />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-low">Course</Label>
            <Select
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
              disabled={coursesLoading}
              required
            >
              <SelectTrigger className="h-11 rounded-lg border border-shade-3 focus:ring-0 focus-visible:ring-0 focus-visible:border-orange">
                <SelectValue placeholder={coursesLoading ? "Loading..." : "Select Course"} />
              </SelectTrigger>
              <SelectContent>
                {courseOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-low">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Jizu Nabayi"
              className="h-11 rounded-lg border border-shade-3 focus-visible:ring-0 focus-visible:border-orange"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-low">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jizu Nabayi"
              className="min-h-[120px] resize-none rounded-lg border border-shade-3 focus-visible:ring-0 focus-visible:border-orange"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-low">Due Date</Label>
                  <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-11 rounded-lg border border-shade-3 focus-visible:ring-0 focus-visible:border-orange"
                  />
                </div>

          <div className="pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-orange hover:bg-orange-600 text-white px-6 h-11 rounded-lg"
            >
              {isSubmitting ? "Sending..." : "Send Assignment"}
            </Button>
                </div>
              </div>

        {/* Middle column - upload + playback */}
        <div className="flex flex-col gap-4">
          {/* Upload box */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="bg-white rounded-xl border border-shade-2 flex flex-col items-center justify-center gap-4 py-10 px-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-orange/20 flex items-center justify-center">
              <UploadCloud className="w-8 h-8 text-orange" />
            </div>
            <p className="text-sm text-low">
              Drag and drop files here, or{" "}
              <span className="text-orange font-medium">click to browse</span>
            </p>
            <label className="relative mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg border border-shade-3 text-xs cursor-pointer bg-offwhite hover:bg-[#ECECF2] text-high">
              <span className="font-medium mr-1">Choose File</span>
              <Input
                type="file"
                accept="audio/*"
                onChange={handleFileInput}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {audioFile && (
                <span className="ml-1 truncate max-w-[160px] text-xs text-low">
                  {audioFile.name}
                </span>
              )}
            </label>
            {audioFile && (
              <p className="text-xs text-low mt-1">
                Selected:{" "}
                <span className="font-medium truncate max-w-[220px] inline-block align-bottom">
                  {audioFile.name}
                </span>
              </p>
            )}
          </div>

          {/* Playback + recitation count */}
          <div className="bg-white rounded-xl border border-shade-2 p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-9 h-9 rounded-full border border-orange flex items-center justify-center text-orange"
                disabled={!audioUrl}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <div className="flex-1 h-2 rounded-full bg-[#F2F2F5] overflow-hidden">
                <div
                  className="h-full bg-orange transition-all"
                  style={{
                    width:
                      audioDuration > 0
                        ? `${(audioCurrentTime / audioDuration) * 100}%`
                        : "0%",
                  }}
                />
              </div>
              <span className="text-xs text-low">
                {audioDuration > 0 ? formatTime(audioCurrentTime) : "00:00"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-low">Add Number of times to be recited</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleRecitationChange(-1)}
                  className="w-8 h-8 rounded-full bg-offwhite flex items-center justify-center text-high"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-10 h-8 rounded-lg bg-offwhite flex items-center justify-center text-sm font-medium">
                  {recitationCount}
                </div>
                <button
                  type="button"
                  onClick={() => handleRecitationChange(1)}
                  className="w-8 h-8 rounded-full bg-offwhite flex items-center justify-center text-high"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - recording UI */}
        <div className="bg-white h-max rounded-xl border border-shade-2 p-6 flex flex-col items-center justify-center gap-4">
          <div className="w-full h-24 rounded-2xl bg-[#F8F8FA] flex items-center justify-center px-6">
            <div className="flex gap-[3px] w-full justify-center">
              {Array.from({ length: 24 }).map((_, index) => (
                <span
                  key={index}
                  className={`w-[3px] rounded-full ${
                    recordingStatus === "recording" ? "bg-orange" : "bg-orange/60"
                  }`}
                  style={{
                    height: `${10 + ((index * 9 + (recordingStatus === "recording" ? recordingSeconds : 0)) % 36)}px`,
                    transition: "height 150ms ease-out",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs text-low">
              {recordingStatus === "recording"
                ? formatRecordingTime(recordingSeconds)
                : "00.00.00"}
            </p>
            <button
              type="button"
              onClick={handleToggleRecording}
              className="flex items-center gap-2 text-sm text-orange"
            >
              <span>
                {recordingStatus === "recording"
                  ? "Stop Recording"
                  : recordingStatus === "recorded"
                  ? "Record Again"
                  : "Start Recording"}
              </span>
              <Mic className="w-4 h-4" />
            </button>
          </div>
          </div>
        </div>

      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio ref={audioElementRef} src={audioUrl} className="hidden" preload="metadata" />
      )}
      </section>
  );
}
