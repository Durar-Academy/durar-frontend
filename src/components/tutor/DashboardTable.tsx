"use client";
import Table from "./Table";

// if you are on Next.js 13+ App Router

interface ClassItem {
  date: string;
  student: string;
  category: string;
  time: string;
}

const classData: ClassItem[] = [
  {
    date: "Feb 12",
    student: "Lawal Wahab Babatunde",
    category: "Thanawiyah",
    time: "3:00 PM",
  },
  {
    date: "Feb 14",
    student: "Lawal Wahab Babatunde",
    category: "Idaadiyah",
    time: "3:00 PM",
  },
  {
    date: "Feb 14",
    student: "Lawal Wahab Babatunde",
    category: "Awal temhidi",
    time: "3:00 PM",
  },
  {
    date: "Feb 14",
    student: "Lawal Wahab Babatunde",
    category: "Idaadiyah",
    time: "3:00 PM",
  },
];

export default function DashboardTable() {
  return (
    <section>
      <h1 className="text-xl mb-0">Upcoming Classes</h1>
      <Table
        headers={["Date", "Student", "Category", "Time", "Action"]}
        data={classData}
        renderRow={(item, index) => (
          <tr
            key={index}
            className="border-[1px] bg-[#F8F8FA] border-[#D2D4E0] mt-3"
          >
            <td className="text-sm py-4 pl-3 border-[1px] border-[#D2D4E0] rounded-l-xl border-r-0">
              {item.date}
            </td>
            <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
              {item.student}
            </td>
            <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
              {item.category}
            </td>
            <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
              {item.time}
            </td>
            <td className="text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl">
              <button className="text-orange-400 font-semibold hover:underline text-sm text-orange">
                Start Class
              </button>
            </td>
          </tr>
        )}
      />
    </section>
  );
}
