import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Result {
  id: string;
  course: string;
  ca: number;
  exam: number;
  grade: string;
  remarks: string;
}

export function ResultsTable({ results }: { results: Result[] }) {
  return (
    <div className="h-full overflow-y-scroll hide-scrollbar">
      {
        <Table>
          <TableHeader>
            <TableRow className="text-low text-sm font-semibold">
              <TableHead>Course</TableHead>
              <TableHead>CA</TableHead>
              <TableHead>Exam</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Tutor Remarks</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="space-y-3">
            {results.map((result) => (
              <TableRow
                className="text-sm text-high bg-offwhite h-12"
                key={result.id + result.course}
              >
                <TableCell className="capitalize">{result.course}</TableCell>
                <TableCell>{result.ca}</TableCell>
                <TableCell>{result.exam}</TableCell>

                <TableCell className="uppercase">{result.grade}</TableCell>
                <TableCell className="capitalize">{result.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
    </div>
  );
}
