"use client";

import { AlertCircle, CloudUpload, X } from "lucide-react";
import Dropzone, { FileError } from "react-dropzone";
import { useState, MouseEvent } from "react";

import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 1_000 * 1024 * 1024; // 1GB

export function VideoDropzone({ onFileDrop, value }: DropzoneProps) {
  const [previews, setPreviews] = useState<FileDropValue>(value);
  const [error, setError] = useState("");
  const [videoDuration, setVideoDuration] = useState<string>("");

  const getVideoDuration = (file: File) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      const duration = Math.round(video.duration);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      setVideoDuration(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };
  };

  const handleVideoRemove = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setPreviews(null);
  };

  const handleVideoDrop = (
    acceptedFiles: File[],
    fileRejections: {
      file: File;
      errors: readonly FileError[];
    }[],
  ) => {
    setError("");

    // Check file size
    if (acceptedFiles[0]?.size > MAX_FILE_SIZE) {
      setError("Video must be smaller than 1GB");
      return;
    }

    if (acceptedFiles.length > 1 || fileRejections.length > 0) {
      setError("A lesson can only have one video.");
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    const previewUrl = "";
    const newPreviews = { file, preview: previewUrl };

    getVideoDuration(file);
    setPreviews(newPreviews);
    onFileDrop(newPreviews);
  };

  return (
    <>
      <Dropzone
        onDrop={handleVideoDrop}
        accept={{
          "video/*": [],
        }}
        maxFiles={1}
      >
        {({ getRootProps, getInputProps }) => (
          <section
            className={cn(
              "w-full h-60 flex flex-col items-center justify-center border-2 border-dashed border-shade-3 rounded-xl focus:border-orange transition-colors cursor-pointer hover:border-orange",
              error && "border-red-500",
            )}
            {...getRootProps()}
          >
            <div className="flex flex-col items-center justify-center gap-3 w-full h-full relative">
              <input {...getInputProps()} />

              <div className="bg-light rounded-full w-20 h-20 flex items-center justify-center">
                <CloudUpload className="text-orange w-6 h-6" />
              </div>

              <p className="max-w-[200px] text-center text-low font-medium text-sm">
                Drag and drop files here, or click to browse
              </p>
            </div>
          </section>
        )}
      </Dropzone>

      {error && (
        <div className="flex items-center gap-2 text-danger text-sm mt-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {previews && (
        <div className="preview mt-4">
          <div className="relative p-4 h-40 w-72 border border-shade-2 rounded-xl">
            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm truncate">{previews.file.name}</p>
              <div className="flex gap-4 text-sm text-low">
                <span>{(previews.file.size / (1024 * 1024)).toFixed(2)}MB</span>

                {videoDuration && <span>{videoDuration}</span>}
              </div>
            </div>

            <button
              onClick={handleVideoRemove}
              className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-danger/85"
            >
              <X className="w-4 h-4 text-inherit" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
