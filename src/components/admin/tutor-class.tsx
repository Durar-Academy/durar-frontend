import { Calendar, Clock, MoreVertical } from "lucide-react";

export function TutorClass({ classDetail }: { classDetail: TutorClassProps }) {
  return (
    <div className="flex items-center justify-between w-[400px]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-light flex items-center justify-center">
          <span className="uppercase font-medium text-xs text-burnt">
            {classDetail.firstName[0]}
            {classDetail.lastName[0]}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-medium text-high text-sm">
            {classDetail.firstName} {classDetail.lastName}
          </p>

          <div className="text-xs flex gap-3">
            <p className="flex gap-1 text-low items-center">
              <Calendar className="w-3 h-3" />

              <span>{classDetail.date}</span>
            </p>

            <p className="flex gap-1 text-low items-center">
              <Clock className="w-3 h-3" />

              <span>{classDetail.time}</span>
            </p>
          </div>
        </div>
      </div>

      <button>
        <MoreVertical className="w-6 h-6" />
      </button>
    </div>
  );
}
