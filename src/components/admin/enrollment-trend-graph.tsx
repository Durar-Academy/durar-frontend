"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { processEnrollmentData } from "@/utils/processor";

export function EnrollmentTrendGraph({ users }: EnrollmentTrendGraphProps) {
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>({});
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    const processedData = processEnrollmentData(users);
    setEnrollmentData(processedData);

    const years = Object.keys(processedData);
    if (years.length > 0) {
      setSelectedYear(years[years.length - 1]);
    }
  }, [users]);

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  if (!selectedYear || !enrollmentData[selectedYear]) {
    return (
      <Card className="w-full p-4 shadow-none border-0 dashboard-shadow h-full">
        <div>Loading enrollment data...</div>
      </Card>
    );
  }

  return (
    <Card className="w-full p-4 shadow-none border-0 dashboard-shadow h-full">
      <div className="flex items-center justify-between mb-4 flex-row p-0">
        <div>
          <p className="font-semibold text-high text-base leading-5">Enrollment trends</p>
        </div>

        <Select value={selectedYear} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[100px] text-high bg-white border border-shade-3 rounded-lg">
            <SelectValue placeholder="Year" />
          </SelectTrigger>

          <SelectContent>
            {Object.keys(enrollmentData).map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <CardContent className="p-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={enrollmentData[Number(selectedYear)]}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={10} tickMargin={8} color="#63767E" />

              <YAxis axisLine={false} tickLine={false} fontSize={10} tickMargin={8} color="#63767E" />

              <Bar
                dataKey="value"
                fill="#F38708"
                radius={12}
                maxBarSize={10}
                background={{ fill: "#F387081A", radius: 12 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
