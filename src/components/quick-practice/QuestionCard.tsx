"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, BookmarkPlus, Bookmark } from "lucide-react";

interface QuestionCardProps {
  question: {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  };
  onNext: () => void;
  onAnswerSubmitted?: (isCorrect: boolean) => void;
  onToggleFavorite?: (questionId: number) => void;
  isFavorite?: boolean;
}

export default function QuestionCard({ question, onNext, onAnswerSubmitted, onToggleFavorite, isFavorite = false }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleOptionSelect = (value: string) => {
    if (!isAnswered) {
      setSelectedOption(value);
    }
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      const selectedIndex = parseInt(selectedOption);
      const correct = selectedIndex === question.correctAnswer;
      setIsCorrect(correct);
      setIsAnswered(true);

      // Notify parent component about the answer result
      if (onAnswerSubmitted) {
        onAnswerSubmitted(correct);
      }
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    onNext();
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(question.id);
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between">
        <h3 className="text-lg font-medium">{question.text}</h3>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={handleToggleFavorite} className="text-primary/70 hover:text-primary focus:outline-none" aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
          {isFavorite ? <Bookmark className="h-5 w-5 fill-primary text-primary" /> : <BookmarkPlus className="h-5 w-5" />}
        </motion.button>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <RadioGroup value={selectedOption || ""} onValueChange={handleOptionSelect}>
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <div key={index} className={`flex items-start space-x-3 p-3 rounded-md border ${isAnswered && index === question.correctAnswer ? "border-green-500 bg-green-50 dark:bg-green-900/20" : isAnswered && parseInt(selectedOption!) === index && index !== question.correctAnswer ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-input"}`}>
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={isAnswered} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={`option-${index}`} className={`text-base font-medium ${isAnswered && index === question.correctAnswer ? "text-green-600 dark:text-green-400" : isAnswered && parseInt(selectedOption!) === index && index !== question.correctAnswer ? "text-red-600 dark:text-red-400" : ""}`}>
                    {option}
                  </Label>
                </div>
                {isAnswered && index === question.correctAnswer && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />}
                {isAnswered && parseInt(selectedOption!) === index && index !== question.correctAnswer && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </RadioGroup>

        {isAnswered && question.explanation && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 p-4 rounded-md bg-muted">
            <h4 className="font-medium mb-2">Explanation:</h4>
            <p>{question.explanation}</p>
          </motion.div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center">
          {isAnswered && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={`flex items-center ${isCorrect ? "text-green-500" : "text-red-500"}`}>
              {isCorrect ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
              <span className="font-medium">{isCorrect ? "Correct!" : "Incorrect!"}</span>
            </motion.div>
          )}
        </div>
        {!isAnswered ? (
          <Button onClick={handleSubmit} disabled={selectedOption === null}>
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext}>Next Question</Button>
        )}
      </CardFooter>
    </Card>
  );
}
