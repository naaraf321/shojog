import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ThumbsUp, ThumbsDown, Clock, RotateCcw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Interface for questions with spaced repetition metadata
interface SpacedRepetitionQuestion {
  id: number;
  text: string;
  answer: string;
  explanation: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  // Spaced repetition data
  nextReviewDate: Date;
  interval: number; // days until next review
  easeFactor: number; // multiplier for interval
  repetitions: number; // number of successful reviews
}

interface SpacedRepetitionProps {
  collectionId: string;
  collectionName: string;
  onClose: () => void;
}

export function SpacedRepetition({ collectionId, collectionName, onClose }: SpacedRepetitionProps) {
  // Mock data - in a real app, this would be fetched from the backend
  const [questions, setQuestions] = useState<SpacedRepetitionQuestion[]>([
    {
      id: 1,
      text: "What is Newton's first law of motion?",
      answer: "An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an external force.",
      explanation: "This law is also known as the law of inertia. It describes the tendency of objects to resist changes in their state of motion.",
      subject: "Physics",
      chapter: "Mechanics",
      topic: "Newton's Laws",
      difficulty: "medium",
      nextReviewDate: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
    },
    {
      id: 2,
      text: "Calculate the acceleration of an object with mass 10kg when a force of 50N is applied.",
      answer: "5 m/s²",
      explanation: "Using Newton's second law, F = ma. So a = F/m = 50N/10kg = 5 m/s².",
      subject: "Physics",
      chapter: "Mechanics",
      topic: "Force and Acceleration",
      difficulty: "hard",
      nextReviewDate: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
    },
    {
      id: 3,
      text: "What is the chemical formula for glucose?",
      answer: "C₆H₁₂O₆",
      explanation: "Glucose is a simple sugar (monosaccharide) with 6 carbon atoms, 12 hydrogen atoms, and 6 oxygen atoms.",
      subject: "Chemistry",
      chapter: "Organic Chemistry",
      topic: "Carbohydrates",
      difficulty: "easy",
      nextReviewDate: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);

  // Filter questions that are due for review
  const dueQuestions = questions.filter((q) => q.nextReviewDate <= new Date());

  // Calculate session progress
  useEffect(() => {
    if (dueQuestions.length > 0) {
      setSessionProgress(Math.round((currentQuestionIndex / dueQuestions.length) * 100));
    }
  }, [currentQuestionIndex, dueQuestions.length]);

  // Check if session is completed
  useEffect(() => {
    if (dueQuestions.length > 0 && currentQuestionIndex >= dueQuestions.length) {
      setIsSessionCompleted(true);
      toast({
        title: "Session completed!",
        description: `You've reviewed all due questions in this collection.`,
      });
    }
  }, [currentQuestionIndex, dueQuestions.length]);

  // Get current question
  const currentQuestion = dueQuestions[currentQuestionIndex];

  // Handle difficulty rating (spaced repetition algorithm based on SuperMemo SM-2)
  const handleDifficultyRating = (rating: 1 | 2 | 3 | 4) => {
    if (!currentQuestion) return;

    // Clone the questions array
    const updatedQuestions = [...questions];
    const questionIndex = updatedQuestions.findIndex((q) => q.id === currentQuestion.id);

    if (questionIndex === -1) return;

    const question = updatedQuestions[questionIndex];

    // Update spaced repetition parameters based on SM-2 algorithm
    let newEaseFactor = question.easeFactor;
    let newInterval = question.interval;
    let newRepetitions = question.repetitions;

    if (rating < 3) {
      // If rating is < 3, reset repetitions
      newRepetitions = 0;
      newInterval = 1;
    } else {
      // If rating is >= 3, update parameters
      newRepetitions += 1;

      if (newRepetitions === 1) {
        newInterval = 1;
      } else if (newRepetitions === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(newInterval * newEaseFactor);
      }

      // Update ease factor
      newEaseFactor = Math.max(1.3, newEaseFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)));
    }

    // Calculate next review date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + newInterval);

    // Update question
    updatedQuestions[questionIndex] = {
      ...question,
      easeFactor: newEaseFactor,
      interval: newInterval,
      repetitions: newRepetitions,
      nextReviewDate: nextDate,
    };

    // Update questions state
    setQuestions(updatedQuestions);

    // Move to next question
    setIsAnswerRevealed(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  // Reset session
  const resetSession = () => {
    setCurrentQuestionIndex(0);
    setIsAnswerRevealed(false);
    setSessionProgress(0);
    setIsSessionCompleted(false);
  };

  if (dueQuestions.length === 0) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>No Questions Due</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">There are no questions due for review in this collection. All questions are scheduled for future dates based on your previous performance.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose}>Back to Collections</Button>
        </CardFooter>
      </Card>
    );
  }

  if (isSessionCompleted) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Session Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">You&apos;ve completed your spaced repetition session for &quot;{collectionName}&quot;. Your progress has been saved, and questions have been rescheduled based on your performance.</p>
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium">Session Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-lg p-4 border border-border">
                <h4 className="text-sm font-medium text-muted-foreground">Questions Reviewed</h4>
                <p className="text-2xl font-bold">{dueQuestions.length}</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <h4 className="text-sm font-medium text-muted-foreground">Next Review</h4>
                <p className="text-2xl font-bold">{new Date(Math.min(...questions.map((q) => q.nextReviewDate.getTime()))).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetSession}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restart Session
          </Button>
          <Button onClick={onClose}>Back to Collections</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Spaced Repetition: {collectionName}</h2>
        <Button variant="outline" onClick={onClose}>
          Exit Session
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>
            {currentQuestionIndex + 1} of {dueQuestions.length} questions
          </span>
          <span>{sessionProgress}% complete</span>
        </div>
        <Progress value={sessionProgress} className="h-2" />
      </div>

      {currentQuestion && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Badge variant="outline" className="bg-primary/10">
                  {currentQuestion.subject}
                </Badge>
                <Badge variant="outline" className="bg-primary/10">
                  {currentQuestion.topic}
                </Badge>
              </div>
              <Badge className={currentQuestion.difficulty === "easy" ? "bg-green-500/20 text-green-700 hover:bg-green-500/20" : currentQuestion.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/20" : "bg-red-500/20 text-red-700 hover:bg-red-500/20"}>{currentQuestion.difficulty}</Badge>
            </div>
            <CardTitle className="text-xl mt-2">{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnswerRevealed ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Answer:</h3>
                  <div className="p-3 bg-muted rounded-md">{currentQuestion.answer}</div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Explanation:</h3>
                  <div className="p-3 bg-muted rounded-md">{currentQuestion.explanation}</div>
                </div>
                <div className="pt-4">
                  <h3 className="font-medium mb-3">How well did you know this?</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="flex-1 border-red-500/50 hover:bg-red-500/10" onClick={() => handleDifficultyRating(1)}>
                      <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
                      Didn&apos;t know
                    </Button>
                    <Button variant="outline" className="flex-1 border-orange-500/50 hover:bg-orange-500/10" onClick={() => handleDifficultyRating(2)}>
                      <ThumbsDown className="h-4 w-4 mr-2 text-orange-500" />
                      Hard to recall
                    </Button>
                    <Button variant="outline" className="flex-1 border-yellow-500/50 hover:bg-yellow-500/10" onClick={() => handleDifficultyRating(3)}>
                      <ThumbsUp className="h-4 w-4 mr-2 text-yellow-500" />
                      Had to think
                    </Button>
                    <Button variant="outline" className="flex-1 border-green-500/50 hover:bg-green-500/10" onClick={() => handleDifficultyRating(4)}>
                      <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
                      Knew it well
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6">
                <p className="text-muted-foreground mb-6">Try to answer this question before revealing the answer.</p>
                <Button onClick={() => setIsAnswerRevealed(true)}>
                  Reveal Answer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/50 px-6 py-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              {currentQuestion.repetitions === 0 ? "First time reviewing this question" : `Next review in ${currentQuestion.interval} days`}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
