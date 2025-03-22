"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Download, FileText, Printer } from "lucide-react";
import { MotionDiv } from "@/components/ui/framer-wrapper";
import { SubjectPerformanceGraph } from "./SubjectPerformanceGraph";
import { TimeSpentGraph } from "./TimeSpentGraph";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { exportStatisticsAsCsv, exportStatisticsAsPdf, StatisticsData } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface DetailedStatisticsProps {
  statistics: StatisticsData;
}

export function DetailedStatistics({ statistics }: DetailedStatisticsProps) {
  const { user } = useAuth();
  const userName = user?.displayName || "User";

  return (
    <div className="space-y-6">
      {/* Performance Overview Card */}
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Performance Overview
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportStatisticsAsCsv(statistics, `${userName.toLowerCase().replace(/\s+/g, "-")}-statistics`)}>
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Export as CSV</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportStatisticsAsPdf(statistics, userName)}>
                  <Printer className="h-4 w-4 mr-2" />
                  <span>Export as PDF</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary/5 rounded-lg p-4 text-center">
                <div className="text-muted-foreground text-sm mb-1">Questions</div>
                <div className="text-2xl font-bold">{statistics.questionsAnswered}</div>
                <div className="text-xs text-muted-foreground">Total questions answered</div>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 text-center">
                <div className="text-muted-foreground text-sm mb-1">Correct</div>
                <div className="text-2xl font-bold text-emerald-500">{statistics.correctAnswers}</div>
                <div className="text-xs text-muted-foreground">Total correct answers</div>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 text-center">
                <div className="text-muted-foreground text-sm mb-1">Exams</div>
                <div className="text-2xl font-bold text-blue-500">{statistics.examsTaken}</div>
                <div className="text-xs text-muted-foreground">Exams completed</div>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 text-center">
                <div className="text-muted-foreground text-sm mb-1">Accuracy</div>
                <div className="text-2xl font-bold">{statistics.accuracy}%</div>
                <div className="text-xs text-muted-foreground">Overall accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Subject Performance Graph */}
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="w-full h-full flex items-center justify-center">
              <SubjectPerformanceGraph />
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Time Spent Analysis */}
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Study Time Analysis</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <div className="w-full h-full flex items-center justify-center">
              <TimeSpentGraph />
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Strengths and Weaknesses */}
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>Strengths & Weaknesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                    <path d="m12 14 4-4" />
                    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                  </svg>
                  Strengths
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between bg-emerald-500/10 p-3 rounded-lg">
                    <span>Physics - Mechanics</span>
                    <span className="font-medium">92% accuracy</span>
                  </li>
                  <li className="flex justify-between bg-emerald-500/10 p-3 rounded-lg">
                    <span>Chemistry - Organic</span>
                    <span className="font-medium">88% accuracy</span>
                  </li>
                  <li className="flex justify-between bg-emerald-500/10 p-3 rounded-lg">
                    <span>Math - Calculus</span>
                    <span className="font-medium">85% accuracy</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                    <path d="m12 14 4 4" />
                    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                  </svg>
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between bg-red-500/10 p-3 rounded-lg">
                    <span>Biology - Genetics</span>
                    <span className="font-medium">65% accuracy</span>
                  </li>
                  <li className="flex justify-between bg-red-500/10 p-3 rounded-lg">
                    <span>Chemistry - Thermodynamics</span>
                    <span className="font-medium">68% accuracy</span>
                  </li>
                  <li className="flex justify-between bg-red-500/10 p-3 rounded-lg">
                    <span>Physics - Electromagnetism</span>
                    <span className="font-medium">72% accuracy</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>
    </div>
  );
}
