import Image from "next/image";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useFile } from "@/hooks/useStudent";

export function CourseCard({ name, thumbnailId, progress, id, enrolled = true, subscriptionActive = true, variant = "courses" }: CourseCardProps) {
  // thumbnailId is a raw storage ID, not a URL — resolve it to the media src before rendering.
  const { data: media } = useFile(thumbnailId);
  const thumbnail = media?.src;

  const thumbnailBlock = thumbnail ? (
    <Image
      src={thumbnail}
      alt={name}
      width={168}
      height={100}
      className="object-cover rounded-md"
    />
  ) : (
    <div className="h-[100px] w-full rounded-md bg-shade-1 flex items-center justify-center">
      <p className="text-low text-sm font-medium px-3 text-center">{name}</p>
    </div>
  );

  const lockedThumbnail = (
    <div className="relative">
      <div className="blur-[1px] opacity-80">{thumbnailBlock}</div>
      <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/10">
        <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-high shadow-sm">
          <LockKeyhole className="h-3.5 w-3.5 text-orange" aria-hidden="true" />
          Subscription required
        </span>
      </div>
    </div>
  );

  if (variant === "dashboard" && (!enrolled || !subscriptionActive)) {
    return (
      <Link
        href={`/student/courses/${id}`}
        className="rounded-xl bg-white p-3 flex flex-col justify-between gap-3 w-full max-w-60"
        aria-label={`Subscribe to view ${name}`}
      >
        {lockedThumbnail}

        <div className="flex items-center justify-between gap-2">
          <h3 className="text-low text-sm tracking-wide">{name}</h3>
          <span className="text-xs text-low">{progress}%</span>
        </div>

      </Link>
    );
  }

  if (variant !== "dashboard" && (!enrolled || !subscriptionActive)) {
    return (
      <Link
        href={`/student/courses/${id}`}
        className="rounded-xl bg-white p-3 flex flex-col justify-between gap-3 w-full max-w-60"
        aria-label={`Open ${name}`}
      >
        {lockedThumbnail}

        <div className="flex items-center justify-between gap-2">
          <h3 className="text-low text-sm tracking-wide">{name}</h3>
          <span className="text-xs text-low">{progress}%</span>
        </div>

      </Link>
    );
  }

  return (
    <Link
      href={`/student/courses/${id}`}
      className="rounded-xl bg-white p-3 flex flex-col justify-between gap-3 w-full max-w-60"
    >
      {thumbnailBlock}

      <div className="flex justify-between items-center">
        <h3 className="text-low text-sm tracking-wide">{name}</h3>

        <p className="text-orange text-xs tracking-wide">{progress}%</p>
      </div>

      <div>
        <Progress value={progress} indicatorClassName="bg-orange" />
      </div>
    </Link>
  );
}
