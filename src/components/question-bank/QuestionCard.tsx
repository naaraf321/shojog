import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Check, ChevronDown, ChevronUp, Eye, EyeOff, Download, Printer, BarChart2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import QuestionExport from "./QuestionExport";
import PrintFriendlyView from "./PrintFriendlyView";
import QuestionPerformanceStats from "./QuestionPerformanceStats";

type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: number;
  text: string;
  options: Option[];
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
  subject: string;
  chapter: string;
  topic: string;
  source?: string;
};

type QuestionCardProps = {
  question: Question;
};

export default function QuestionCard({ question }: QuestionCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleOptionSelect = (optionId: string) => {
    if (!showAnswer) {
      setSelectedOption(optionId);
    }
  };

  // Get badge color based on difficulty
  const getBadgeClass = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-50 text-green-600 border-green-200";
      case "medium":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "hard":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="relative pb-2">
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="outline" className={getBadgeClass(question.difficulty)}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </Badge>
            <Badge variant="outline">{question.subject}</Badge>
            <Badge variant="outline">{question.chapter}</Badge>
            <Badge variant="outline">{question.topic}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleBookmark} className={`text-muted-foreground hover:text-primary ${isBookmarked ? "text-primary" : ""}`}>
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-primary" : ""}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowExportDialog(true)} className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  <span>Export</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPrintDialog(true)} className="cursor-pointer">
                  <Printer className="mr-2 h-4 w-4" />
                  <span>Print</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowStatsDialog(true)} className="cursor-pointer">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  <span>Statistics</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {question.source && <div className="text-xs text-muted-foreground mt-2">Source: {question.source}</div>}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-lg font-medium">{question.text}</div>

        <div className="space-y-2 pt-2">
          {question.options.map((option) => (
            <div key={option.id} onClick={() => handleOptionSelect(option.id)} className={`p-3 border rounded-md cursor-pointer transition-all ${selectedOption === option.id ? "border-primary" : "border-border hover:border-primary/50"} ${showAnswer && option.isCorrect ? "bg-green-50 border-green-500" : showAnswer && selectedOption === option.id && !option.isCorrect ? "bg-red-50 border-red-500" : ""}`}>
              <div className="flex justify-between items-center">
                <div>{option.text}</div>
                {showAnswer && option.isCorrect && <Check className="h-5 w-5 text-green-600" />}
              </div>
            </div>
          ))}
        </div>

        {showAnswer && (
          <div className="pt-2">
            <Button variant="outline" onClick={() => setShowExplanation(!showExplanation)} className="w-full flex justify-between">
              <span>Explanation</span>
              {showExplanation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {showExplanation && <div className="mt-3 p-3 bg-muted rounded-md text-sm">{question.explanation}</div>}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant={showAnswer ? "ghost" : "default"} onClick={() => setShowAnswer(!showAnswer)} className="flex items-center gap-2">
          {showAnswer ? (
            <>
              <EyeOff className="h-4 w-4" /> Hide Answer
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" /> Show Answer
            </>
          )}
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowStatsDialog(true)} className="hidden md:flex items-center gap-1">
            <BarChart2 className="h-4 w-4" />
            <span>Stats</span>
          </Button>
          <Button variant="outline">Next Question</Button>
        </div>
      </CardFooter>

      {/* Dialogs for export, print, and statistics */}
      {showExportDialog && <QuestionExport questions={[question]} isOpen={showExportDialog} onClose={() => setShowExportDialog(false)} />}

      {showPrintDialog && <PrintFriendlyView questions={[question]} isOpen={showPrintDialog} onClose={() => setShowPrintDialog(false)} />}

      {showStatsDialog && <QuestionPerformanceStats questionId={question.id.toString()} isOpen={showStatsDialog} onClose={() => setShowStatsDialog(false)} />}
    </Card>
  );
}
