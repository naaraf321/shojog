"use client";

import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eraser } from "lucide-react";

// Mock data for subjects and exams
const SUBJECTS = [
  { id: "math", name: "Mathematics" },
  { id: "physics", name: "Physics" },
  { id: "chemistry", name: "Chemistry" },
  { id: "biology", name: "Biology" },
  { id: "english", name: "English" },
];

const EXAMS = [
  { id: "midterm1", name: "Midterm 1" },
  { id: "midterm2", name: "Midterm 2" },
  { id: "final", name: "Final Exam" },
  { id: "admission", name: "Admission Test" },
  { id: "scholarship", name: "Scholarship Exam" },
];

interface LeaderboardFiltersProps {
  onFilterChange: (subject: string | null, exam: string | null) => void;
  onReset: () => void;
  selectedSubject: string | null;
  selectedExam: string | null;
}

export function LeaderboardFilters({ onFilterChange, onReset, selectedSubject, selectedExam }: LeaderboardFiltersProps) {
  const [activeTab, setActiveTab] = useState<string>(selectedSubject ? "subject" : "exam");
  const [subjectId, setSubjectId] = useState<string | null>(selectedSubject);
  const [examId, setExamId] = useState<string | null>(selectedExam);

  const handleSubjectChange = (value: string) => {
    setSubjectId(value);
    setExamId(null); // Reset exam when selecting a subject
  };

  const handleExamChange = (value: string) => {
    setExamId(value);
    setSubjectId(null); // Reset subject when selecting an exam
  };

  const handleApplyFilter = () => {
    if (activeTab === "subject" && subjectId) {
      onFilterChange(subjectId, null);
    } else if (activeTab === "exam" && examId) {
      onFilterChange(null, examId);
    } else {
      onReset();
    }
  };

  const handleResetFilters = () => {
    setSubjectId(null);
    setExamId(null);
    onReset();
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subject">By Subject</TabsTrigger>
          <TabsTrigger value="exam">By Exam</TabsTrigger>
        </TabsList>

        <TabsContent value="subject" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="subject-select">Select Subject</Label>
            <Select value={subjectId || ""} onValueChange={handleSubjectChange}>
              <SelectTrigger id="subject-select">
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="exam" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="exam-select">Select Exam</Label>
            <Select value={examId || ""} onValueChange={handleExamChange}>
              <SelectTrigger id="exam-select">
                <SelectValue placeholder="Choose an exam" />
              </SelectTrigger>
              <SelectContent>
                {EXAMS.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleApplyFilter} className="flex-1" disabled={activeTab === "subject" ? !subjectId : !examId}>
          Apply Filter
        </Button>
        <Button variant="outline" onClick={handleResetFilters} className="flex items-center gap-2" disabled={!selectedSubject && !selectedExam}>
          <Eraser className="w-4 h-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
