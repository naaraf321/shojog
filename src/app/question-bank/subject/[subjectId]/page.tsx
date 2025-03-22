import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ChapterTopicFiltering from "@/components/question-bank/ChapterTopicFiltering";
import DifficultyFiltering from "@/components/question-bank/DifficultyFiltering";
import QuestionCard from "@/components/question-bank/QuestionCard";

// Mock question data
const MOCK_QUESTION = {
  id: 1,
  text: "A body of mass 5 kg is moving with a velocity of 10 m/s. What is its kinetic energy?",
  options: [
    { id: "a", text: "250 J", isCorrect: true },
    { id: "b", text: "50 J", isCorrect: false },
    { id: "c", text: "500 J", isCorrect: false },
    { id: "d", text: "25 J", isCorrect: false },
  ],
  difficulty: "medium" as const,
  explanation: "The kinetic energy of a body is given by the formula KE = (1/2) × m × v², where m is the mass and v is the velocity. For a mass of 5 kg moving at 10 m/s, the kinetic energy is (1/2) × 5 × 10² = (1/2) × 5 × 100 = 250 J.",
  subject: "Physics",
  chapter: "Mechanics",
  topic: "Work and Energy",
  source: "NEET 2019",
};

// Get static mock subject name based on ID
const getSubjectName = (id: string) => {
  const subjects: { [key: string]: string } = {
    "1": "Physics",
    "2": "Chemistry",
    "3": "Biology",
    "4": "Mathematics",
    "5": "English",
    "6": "Computer Science",
  };

  return subjects[id] || "Unknown Subject";
};

export default function SubjectDetailPage({ params }: { params: { subjectId: string } }) {
  const subjectId = params.subjectId;
  const subjectName = getSubjectName(subjectId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/question-bank/subject">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{subjectName}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with filtering options */}
        <div className="md:col-span-1 space-y-6">
          <DifficultyFiltering selectedDifficulty="all" onDifficultyChange={() => {}} />
        </div>

        {/* Main content area */}
        <div className="md:col-span-3">
          <ChapterTopicFiltering subjectId={parseInt(subjectId)} subjectName={subjectName} />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Sample Question</h2>
            <QuestionCard question={MOCK_QUESTION} />
          </div>
        </div>
      </div>
    </div>
  );
}
