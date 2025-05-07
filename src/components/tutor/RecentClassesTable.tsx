// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";

// interface RecentClass {
//   date: string;
//   student: string;
//   category: string;
//   time: string;
//   start_time: string;
//   status: "Hold" | "Missed";
// }

// interface RecentClassTableProps {
//   RecentClasss: RecentClass[];
// }

// export default function RecentClassesTable({
//   RecentClasss,
// }: RecentClassTableProps) {
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<"All" | "Hold" | "Missed">(
//     "All"
//   );

//   const filteredRecentClasss = RecentClasss.filter((RecentClass) => {
//     const matchesSearch =
//       RecentClass.student.toLowerCase().includes(search.toLowerCase()) ||
//       RecentClass.category.toLowerCase().includes(search.toLowerCase());
//     const matchesStatus =
//       statusFilter === "All" || RecentClass.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const exportToCSV = () => {
//     const headers = [
//       "Date",
//       "Student",
//       "Category",
//       "Time",
//       "Start time",
//       "Status",
//     ];
//     const rows = filteredRecentClasss.map((RecentClass) => [
//       RecentClass.date,
//       RecentClass.student,
//       RecentClass.category,
//       RecentClass.time,
//       RecentClass.start_time,
//       RecentClass.status,
//     ]);

//     const csvContent = [headers, ...rows]
//       .map((e) => e.map((field) => `"${field}"`).join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "RecentClass_list.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center w-full gap-3">
//         <h2 className="text-xl">Recent Classes</h2>
//         <span className="flex-1"></span>
//         <div className="h-11 rounded-lg border-[#D2D4E0] border-[1px] flex items-center justify-center p-3">
//           <input
//             placeholder="Search"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="max-w-sm  border-none outline-none text-sm"
//           />

//           <Image
//             src="/SVGs/searchIcon.svg"
//             alt="search Icon"
//             width={16}
//             height={16}
//           />
//         </div>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button className="h-11" variant="outline">
//               Status
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             <DropdownMenuItem onClick={() => setStatusFilter("All")}>
//               All
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setStatusFilter("Hold")}>
//               Hold
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setStatusFilter("Missed")}>
//               Missed
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//         <button
//           onClick={exportToCSV}
//           className="flex gap-3 text-sm text-orange border-[1px] border-orange p-3 rounded-lg justify-center items-center"
//         >
//           Export List
//           <Image
//             src={"/SVGs/exportImg.svg"}
//             alt="export icon"
//             width={16}
//             height={16}
//           />
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="text-sm min-w-full bg-white border-none border-separate border-spacing-y-3">
//           <thead>
//             <tr className="text-low text-sm text-left">
//               <th className="py-3 px-4 font-semibold">Date</th>
//               <th className="py-3 px-4 font-semibold">Student</th>
//               <th className="py-3 px-4 font-semibold">Category</th>
//               <th className="py-3 px-4 font-semibold">Time</th>
//               <th className="py-3 px-4 font-semibold">Start time</th>
//               <th className="py-3 px-4 font-semibold">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredRecentClasss.map((RecentClass, index) => (
//               <tr
//                 key={index}
//                 className="border-[1px] bg-[#F8F8FA] border-[#D2D4E0] mt-3"
//               >
//                 <td className="text-sm py-4 pl-3 border-[1px] border-[#D2D4E0] rounded-l-xl border-r-0">
//                   {RecentClass.date}
//                 </td>
//                 <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
//                   {RecentClass.student}
//                 </td>
//                 <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
//                   {RecentClass.category}
//                 </td>
//                 <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
//                   {RecentClass.time}
//                 </td>
//                 <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
//                   {RecentClass.start_time}
//                 </td>

//                 <td className="text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl text-orange cursor-pointer hover:underline">
//                   <span
//                     className={
//                       RecentClass.status === "Hold"
//                         ? "text-light-green"
//                         : "text-red-500"
//                     }
//                   >
//                     {RecentClass.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTutorClasses } from "@/hooks/tutorQueries";
import { processTutorClasses } from "@/utils/tutorProcessor";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentClassesTableProps {
  page: number;
  setPage: (page: number) => void;
}

export default function RecentClassesTable({
  page,
  setPage,
}: RecentClassesTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const { data: classesData, isLoading } = useTutorClasses({ page });
  const classes = processTutorClasses(classesData);

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      classItem.student.toLowerCase().includes(search.toLowerCase()) ||
      classItem.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || classItem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ["Day", "Student", "Category", "Time", "Status"];
    const rows = filteredClasses.map((classItem) => [
      classItem.day,
      classItem.student,
      classItem.category,
      classItem.time,
      classItem.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "class_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviousPage = () => {
    if (classesData?.metaData.hasPreviousPages) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (classesData?.metaData.hasNextPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center w-full gap-3">
        <h2 className="text-xl font-semibold">Recent Classes</h2>
        <span className="flex-1"></span>
        <div className="h-11 rounded-lg border-[#D2D4E0] border-[1px] flex items-center justify-center p-3">
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm border-none outline-none text-sm"
          />
          <Image
            src="/SVGs/searchIcon.svg"
            alt="search Icon"
            width={16}
            height={16}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-11" variant="outline">
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("All")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Scheduled")}>
              Scheduled
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Missed")}>
              Missed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Hold")}>
              Hold
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          onClick={exportToCSV}
          className="flex gap-3 text-sm text-orange border-[1px] border-orange p-3 rounded-lg justify-center items-center"
        >
          Export List
          <Image
            src="/SVGs/exportImg.svg"
            alt="export icon"
            width={16}
            height={16}
          />
        </button>
      </div>

      {isLoading ? (
        <Skeleton className="w-full h-[300px] rounded-xl" />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="text-sm min-w-full bg-white border-none border-separate border-spacing-y-3">
              <thead>
                <tr className="text-low text-sm text-left">
                  <th className="py-3 px-4 font-semibold">Day</th>
                  <th className="py-3 px-4 font-semibold">Student</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Time</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-sm text-gray-500">
                      No classes found
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((classItem, index) => (
                    <tr
                      key={index}
                      className="border-[1px] bg-[#F8F8FA] border-[#D2D4E0] mt-3"
                    >
                      <td className="text-sm py-4 pl-3 border-[1px] border-[#D2D4E0] rounded-l-xl border-r-0">
                        {classItem.day}
                      </td>
                      <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                        {classItem.student}
                      </td>
                      <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                        {classItem.category}
                      </td>
                      <td className="text-sm py-4 border-y-[1px] border-[#D2D4E0]">
                        {classItem.time}
                      </td>
                      <td className="text-sm py-4 border-[1px] border-[#D2D4E0] border-l-0 rounded-r-xl">
                        <span
                          className={
                            classItem.status === "Scheduled"
                              ? "text-light-green"
                              : "text-red-500"
                          }
                        >
                          {classItem.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={handlePreviousPage}
              disabled={!classesData?.metaData.hasPreviousPages}
              variant="outline"
              className="h-10"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {classesData?.metaData.page ?? 1} of {classesData?.metaData.pageCount ?? 1}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={!classesData?.metaData.hasNextPages}
              variant="outline"
              className="h-10"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}