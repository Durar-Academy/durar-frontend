"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EnrollmentTrendGraph({ enrollmentData }: { enrollmentData: EnrollmentData }) {
  const [selectedYear, setSelectedYear] = useState("2024");

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

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

          <SelectContent className="">
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CardContent className="p-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={enrollmentData[Number(selectedYear)]}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={10} tickMargin={8} color="#63767E" />

              <YAxis
                axisLine={false}
                tickLine={false}
                fontSize={10}
                tickMargin={8}
                ticks={[0, 15000, 30000, 50000]}
                tickFormatter={(value) => `${value / 1000}K`}
                color="#63767E"
              />

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
