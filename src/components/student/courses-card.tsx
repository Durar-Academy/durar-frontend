import Image from "next/image";
import Link from "next/link";

import { Progress } from "@/components/ui/progress";
import { useFile } from "@/hooks/useStudent";

export function CourseCard({ name, thumbnailId, progress, id, enrolled = true }: CourseCardProps) {
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

  if (!enrolled) {
    return (
      <div className="rounded-xl bg-white p-3 flex flex-col justify-between gap-3 w-full max-w-60">
        {thumbnailBlock}

        <h3 className="text-low text-sm tracking-wide">{name}</h3>

        <Link href="/student/subscription" className="w-full rounded-lg bg-orange px-4 py-2 text-center text-sm font-medium text-white hover:bg-burnt">
          Subscribe to access
        </Link>
      </div>
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
