import React from "react";

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
}

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionDisplay({ question, questionNumber, totalQuestions }: QuestionDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <div className="mt-2">
        <h2 className="text-xl font-semibold mb-2">{question.text}</h2>
      </div>
    </div>
  );
}
