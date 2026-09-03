"use client";

import Image from "next/image";
import Link from "next/link";

import { useFile } from "@/hooks/useStudent";

type PendingAssignmentCardProps = {
  id: string;
  title: string;
  mediaId?: string | null;
};

export function PendingAssignmentCard({ id, title, mediaId }: PendingAssignmentCardProps) {
  const { data: media } = useFile(mediaId);

  return (
    <article className="relative flex min-h-[176px] items-center overflow-hidden rounded-xl border border-shade-2 bg-green px-14 text-white">
      {media?.src && (
        <Image
          src={media.src}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />

      <div className="relative z-10 flex flex-col items-start gap-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Link
          href={`/student/assignments/${id}`}
          className="rounded-xl bg-orange px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-burnt"
        >
          Go to Assignment
        </Link>
      </div>
    </article>
  );
}
