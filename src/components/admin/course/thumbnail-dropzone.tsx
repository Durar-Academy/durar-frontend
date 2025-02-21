"use client";

import { AlertCircle, CloudUpload, X } from "lucide-react";
import Image from "next/image";
import Dropzone, { FileError } from "react-dropzone";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function ThumbnailDropzone() {
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
  const [error, setError] = useState("");

  const handleThumbnailDrop = (
    acceptedFiles: File[],
    fileRejections: {
      file: File;
      errors: readonly FileError[];
    }[],
  ) => {
    setError("");
    previews.forEach((preview) => URL.revokeObjectURL(preview.preview));

    if (acceptedFiles.length > 1 || fileRejections.length > 0) {
      setError("Only one image can be used as thumbnail.");
      return;
    }

    const newPreviews = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPreviews(newPreviews);
  };

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.preview));
    };
  }, [previews]);

  return (
    <>
      <Dropzone
        onDrop={handleThumbnailDrop}
        accept={{
          "image/*": [],
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

      {previews.length > 0 && (
        <div className="preview mt-4">
          <div className="relative h-40 w-40 border border-shade-2 rounded-xl">
            <Image
              src={previews[0].preview}
              alt="Thumbnail preview"
              className="object-center object-cover aspect-video"
              fill
            />

            <button
              onClick={(event) => {
                event.stopPropagation();
                URL.revokeObjectURL(previews[0].preview);
                setPreviews([]);
              }}
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
