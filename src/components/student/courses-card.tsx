import Image from "next/image";
import Link from "next/link";

import { Progress } from "@/components/ui/progress";

export function CourseCard({ name, thumbnail, progress, id }: CourseCardProps) {
  return (
    <Link
      href={`/student/courses/${id}`}
      className="rounded-xl bg-white p-3 flex flex-col justify-between gap-3 w-full max-w-60"
    >
      <Image
        src={thumbnail}
        alt={name}
        width={168}
        height={100}
        className="object-cover rounded-md"
      />

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
