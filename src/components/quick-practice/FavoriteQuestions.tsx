"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkMinus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface FavoriteQuestionsProps {
  questions: Question[];
  onBack: () => void;
}

export default function FavoriteQuestions({ questions, onBack }: FavoriteQuestionsProps) {
  const { toast } = useToast();
  const [favoriteQuestions, setFavoriteQuestions] = useState<number[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  // Load saved favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteQuestions");
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        setFavoriteQuestions(favorites);

        // Filter questions based on saved favorites
        const filtered = questions.filter((q) => favorites.includes(q.id));
        setFilteredQuestions(filtered);
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    }
  }, [questions]);

  // Remove a question from favorites
  const handleRemoveFavorite = (questionId: number) => {
    const updatedFavorites = favoriteQuestions.filter((id) => id !== questionId);
    setFavoriteQuestions(updatedFavorites);
    setFilteredQuestions(filteredQuestions.filter((q) => q.id !== questionId));

    // Save to localStorage
    localStorage.setItem("favoriteQuestions", JSON.stringify(updatedFavorites));

    toast({
      title: "Removed from favorites",
      description: "Question has been removed from your favorites",
      duration: 2000,
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">Favorite Questions</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredQuestions.length} {filteredQuestions.length === 1 ? "question" : "questions"} saved
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <Card className="w-full p-8 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <Bookmark className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-lg font-medium">No favorite questions yet</h3>
            <p className="text-muted-foreground max-w-sm">You haven&apos;t saved any questions to your favorites yet. Click the bookmark icon on a question to save it.</p>
            <Button onClick={onBack} className="mt-4">
              Return to Practice
            </Button>
          </div>
        </Card>
      ) : (
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          {filteredQuestions.map((question) => (
            <motion.div key={question.id} variants={itemVariants}>
              <Card className="w-full overflow-hidden">
                <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between">
                  <h3 className="text-lg font-medium">{question.text}</h3>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleRemoveFavorite(question.id)} className="text-primary hover:text-destructive focus:outline-none" aria-label="Remove from favorites">
                    <BookmarkMinus className="h-5 w-5" />
                  </motion.button>
                </CardHeader>
                <CardContent className="pt-6 pb-4">
                  <div className="space-y-4">
                    {question.options.map((option, index) => (
                      <div key={index} className={`flex items-start space-x-3 p-3 rounded-md border ${index === question.correctAnswer ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-input"}`}>
                        <div className="flex-1">
                          <div className={`text-base font-medium ${index === question.correctAnswer ? "text-green-600 dark:text-green-400" : ""}`}>{option}</div>
                        </div>
                        {index === question.correctAnswer && <div className="h-5 w-5 text-green-500 flex-shrink-0">✓</div>}
                      </div>
                    ))}
                  </div>

                  {question.explanation && (
                    <div className="mt-6 p-4 rounded-md bg-muted">
                      <h4 className="font-medium mb-2">Explanation:</h4>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
