import { EyeIcon } from "lucide-react";
import Image from "next/image";

export default function NotificationContentCard() {
  return (
    <div className="col-span-2 w-[98%] flex flex-col gap-3">
      <div className="border border-shade-2 rounded-lg p-6 bg-white space-y-4">
        <h2 className="text-lg font-semibold">Notification Contents</h2>

        <div className="text-sm text-gray-700 space-y-4 leading-relaxed">
          <p>
            Dear Students,
            <br />
            We are pleased to inform you that the next Quran Memorization
            Assessment is scheduled to take place on{" "}
            <strong>Friday, January 12th, 2024</strong>. This assessment will
            cover Surah Al-Baqarah, Ayahs 1-50.
          </p>

          <div>
            <p className="font-medium">Details of the Assessment:</p>
            <ul className="list-disc pl-6">
              <li>
                <strong>Date:</strong> Friday, January 12th, 2024
              </li>
              <li>
                <strong>Time:</strong> 10:00 AM (Your Local Time)
              </li>
              <li>
                <strong>Mode:</strong> Online (via Zoom)
              </li>
              <li>
                <strong>Duration:</strong> 45 Minutes
              </li>
            </ul>
          </div>

          <p>
            Please ensure that you have prepared thoroughly and tested your
            internet connection prior to the assessment. Zoom meeting details
            will be shared with you a day before the event.
          </p>

          <p>
            If you have any questions or concerns, feel free to reach out to
            your tutor or contact support via the platform. <br />
            <strong>Best Regards,</strong>
            <br />
            The Durar Academy Team
          </p>
        </div>
      </div>
      <button className="p-3 flex gap-3 items-center bg-white rounded-lg w-[300px]">
        <Image src="/SVGs/file.svg" height={24} width={24} alt="file icon" />
        Course_Schedule_2025.pdf
        <span className="flex-1"></span>
        <p className="text-orange p-1 flex justify-center items-center rounded-lg bg-[#F1F1F1]">
          <EyeIcon className="w-5 h-5" />
        </p>
      </button>
    </div>
  );
}
