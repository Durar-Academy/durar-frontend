import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Top_Bar({
  children,
  subtext,
  user,
}: {
  children: React.ReactNode;
  subtext: string;
  user: User;
}) {
  const router = useRouter();

  const userFullName = user.role ? `${user?.firstName} ${user?.lastName}` : "";

  if (user?.firstName == null || user?.lastName == null) {
    router.push("/onboarding");
  }

  return (
    <div className="bg-white border border-shade-2 py-5 px-6 rounded-xl flex justify-between items-center w-full">
      <div>
        <div className="text-low text-sm font-normal">{children}</div>

        <div className="text-high font-semibold text-lg leading-6 mt-3">
          {subtext}
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <div className="flex gap-2 items-center">
          <Link href="/tutor/notification">
            <Image
              src={"/SVGs/bell.svg"}
              alt="notification Icon"
              width={36}
              height={36}
            />
          </Link>

          <Image
            src={"/SVGs/mail-icon.svg"}
            alt="notification Icon"
            width={36}
            height={36}
          />
        </div>
        <div>
          <div className="flex justify-center items-center gap-2">
            <Image
              src={
                user?.profilePictureId == null
                  ? "/SVGs/profile.svg"
                  : user?.profilePictureId
              }
              className="rounded-full"
              alt="notification Icon"
              width={36}
              height={36}
            />
            <div className="flex flex-col gap-1">
              <h1 className="text-sm text-high font-semibold">
                {userFullName}
              </h1>
              <Link
                href="/admin/settings/profile"
                className="hover:underline text-low text-xs font-normal"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
