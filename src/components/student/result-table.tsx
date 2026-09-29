import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Result {
  id: string;
  course: { title: string };
  ca: number;
  exam: number;
  totalScore: number;
  grade: string;
}

export function ResultsTable({ results }: { results: Result[] }) {
  return (
    <div className="h-full min-w-0 max-w-full overflow-y-scroll hide-scrollbar">
      {
        <Table>
          <TableHeader>
            <TableRow className="text-low text-sm font-semibold">
              <TableHead>Course</TableHead>
              <TableHead>CA</TableHead>
              <TableHead>Exam</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Grade</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="space-y-3">
            {results.map((result) => (
              <TableRow
                className="text-sm text-high bg-offwhite h-12"
                key={result.id}
              >
                <TableCell className="capitalize">{result.course.title}</TableCell>
                <TableCell>{result.ca}</TableCell>
                <TableCell>{result.exam}</TableCell>
                <TableCell>{result.totalScore}</TableCell>

                <TableCell className="uppercase">{result.grade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
    </div>
  );
}
