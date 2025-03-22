import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface Question {
  id: number;
  text: string;
}

type QuestionStatus = "answered" | "unanswered" | "review";

interface QuestionNavigationProps {
  questions: Question[];
  currentIndex: number;
  onSelect: (index: number) => void;
  statuses: QuestionStatus[];
  markedForReview: number[];
}

export default function QuestionNavigation({ questions, currentIndex, onSelect, statuses, markedForReview }: QuestionNavigationProps) {
  return (
    <div className="bg-card border rounded-lg p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Questions</h2>
        <div className="text-xs text-muted-foreground">{questions.length} questions</div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2 text-xs">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span>Unanswered</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-yellow-500" />
            <span>Review</span>
          </div>
        </div>
      </div>

      <div className="space-y-1 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
        {questions.map((question, index) => {
          const status = statuses[index];
          const isCurrentQuestion = index === currentIndex;

          return (
            <motion.div key={question.id} className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${isCurrentQuestion ? "bg-primary/20 border border-primary/30" : status === "answered" ? "bg-green-500/10 hover:bg-green-500/20" : status === "review" ? "bg-yellow-500/10 hover:bg-yellow-500/20" : "bg-card hover:bg-accent"}`} onClick={() => onSelect(index)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
              <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${isCurrentQuestion ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{index + 1}</div>

                <div className="text-sm truncate max-w-[180px]">{question.text.length > 25 ? `${question.text.substring(0, 25)}...` : question.text}</div>
              </div>

              <div>
                {status === "answered" && <CheckCircle className="w-4 h-4 text-green-500" />}
                {status === "unanswered" && <AlertCircle className="w-4 h-4 text-red-500" />}
                {status === "review" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t">
        <div className="flex justify-between text-sm">
          <div>Total: {questions.length}</div>
          <div className="flex gap-3">
            <div className="text-green-500">{statuses.filter((s) => s === "answered").length}</div>
            <div className="text-yellow-500">{markedForReview.length}</div>
            <div className="text-red-500">{statuses.filter((s) => s === "unanswered").length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
