import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function StudentCoursesTable({ courses }: { courses: StudentCoursesTableProps }) {
  return (
    <div className="p-6 rounded-xl bg-white h-full border border-shade-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base text-high font-semibold">Courses List</h3>
      </div>

      <div className="h-[480px] overflow-y-scroll hide-scrollbar">
        {courses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="text-low text-sm font-semibold">
                <TableHead>Course Name</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Date Completed</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="space-y-3">
              {courses.map((course) => (
                <TableRow className="text-sm text-high bg-offwhite h-12" key={course.id + course.courseTitle}>
                  <TableCell className="capitalize">{course.courseTitle}</TableCell>
                  <TableCell>{course.progress}</TableCell>
                  <TableCell>{course.startDate}</TableCell>
                  <TableCell>{course.completionDate}</TableCell>
                  <TableCell>{course.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm mt-4 text-low">No Courses Found</p>
        )}
      </div>
    </div>
  );
}
