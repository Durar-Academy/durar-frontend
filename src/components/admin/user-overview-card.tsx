import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import { formatDateAndTime } from "@/utils/formatter";
import { format } from "date-fns";

export function UserOverviewCard({ user }: { user: Student }) {
  const { date } = formatDateAndTime(user.createdAt);
  const userEnrollmentDate = format(new Date(date), "PPP");

  return (
    <div className="w-full rounded-xl p-6 bg-white border border-shade-2 flex gap-4">
      <Avatar className="h-[154px] w-[188px] rounded-xl">
        {user.profilePictureId && (
          <AvatarImage
            src={user.profilePictureId as string}
            alt="User Profile Picture"
            className="object-cover object-center"
          />
        )}

        <AvatarFallback className="bg-offwhite flex item-center justify-center rounded-xl">
          <UserRound className="h-16 w-16 text-shade-3" strokeWidth={1} />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-4 text-sm text-low">
        <p>
          <span>Full Name: </span>
          <span className="font-medium text-high">
            {user.firstName} {user.middleName ? user.middleName : ""} {user.lastName}
          </span>
        </p>

        <p>
          <span>Email: </span>
          <span className="font-medium text-high">{user.email}</span>
        </p>

        <p>
          <span>Phone Number: </span>
          <span className="font-medium text-high">{user.phone}</span>
        </p>

        <p>
          <span>Enrollment Date: </span>
          <span className="font-medium text-high capitalize">{userEnrollmentDate}</span>
        </p>

        <p>
          <span className="text-high">Status: </span>
          <span
            className={cn(
              "font-medium capitalize",
              user.status === "active" && "text-success",
              user.status === "unverified" && "text-orange",
              (user.status === "suspended" || user.status === "deactivated") && "text-danger",
              user.status === "graduated" && "text-success-light"
            )}
          >
            {user.status}
          </span>
        </p>
      </div>
    </div>
  );
}
