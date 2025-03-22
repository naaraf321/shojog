"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "./QuestionCard";
import ProgressIndicator from "./ProgressIndicator";
import SessionSummary from "./SessionSummary";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuestionInterfaceProps {
  questions: Question[];
  onComplete: () => void;
}

// Point calculation constants
const CORRECT_ANSWER_POINTS = 10;
const STREAK_BONUS_THRESHOLD = 3;
const STREAK_BONUS_POINTS = 5;
const SPEED_BONUS_THRESHOLD = 10; // seconds
const SPEED_BONUS_POINTS = 3;

export default function QuestionInterface({ questions, onComplete }: QuestionInterfaceProps) {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [answerTimes, setAnswerTimes] = useState<number[]>([]);
  const [points, setPoints] = useState(0);
  const [bonusPoints, setBonusPoints] = useState<{ streak: number; speed: number }>({ streak: 0, speed: 0 });
  const [favoriteQuestions, setFavoriteQuestions] = useState<number[]>([]);

  // Initialize or reset timer when component mounts or when starting a new session
  useEffect(() => {
    const startTime = Date.now();
    setSessionStartTime(startTime);
    setQuestionStartTime(startTime);

    // Set up interval to update time spent
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Load saved favorites from localStorage
    const savedFavorites = localStorage.getItem("favoriteQuestions");
    if (savedFavorites) {
      try {
        setFavoriteQuestions(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    }

    return () => clearInterval(timer);
  }, []);

  // Calculate progress
  const progress = questions.length > 0 ? (answeredQuestions.length / questions.length) * 100 : 0;

  // Handle going to the next question
  const handleNextQuestion = () => {
    // Record this question as answered
    if (!answeredQuestions.includes(currentQuestionIndex)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestionIndex]);
    }

    // If we're at the last question, show summary
    if (currentQuestionIndex === questions.length - 1) {
      setShowSummary(true);
      triggerConfetti();
      return;
    }

    // Otherwise go to next question
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setQuestionStartTime(Date.now()); // Reset the question start time for the next question
  };

  // Track correct answers and calculate points
  const handleAnswerSubmitted = (isCorrect: boolean) => {
    const answerTime = Math.floor((Date.now() - questionStartTime) / 1000); // Time taken to answer in seconds
    setAnswerTimes([...answerTimes, answerTime]);

    let questionPoints = 0;
    let newStreak = streak;
    let streakBonus = 0;
    let speedBonus = 0;

    if (isCorrect) {
      // Base points for correct answer
      questionPoints += CORRECT_ANSWER_POINTS;

      // Update streak
      newStreak = streak + 1;
      setStreak(newStreak);

      // Update best streak if current streak is better
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }

      // Add streak bonus if applicable
      if (newStreak >= STREAK_BONUS_THRESHOLD) {
        streakBonus = STREAK_BONUS_POINTS;
        questionPoints += streakBonus;
      }

      // Add speed bonus if applicable
      if (answerTime <= SPEED_BONUS_THRESHOLD) {
        speedBonus = SPEED_BONUS_POINTS;
        questionPoints += speedBonus;
      }

      // Add to correct answers
      setCorrectAnswers([...correctAnswers, currentQuestionIndex]);
    } else {
      setStreak(0); // Reset streak on wrong answer
    }

    // Update points and bonus tracking
    setPoints(points + questionPoints);
    setBonusPoints({
      streak: bonusPoints.streak + streakBonus,
      speed: bonusPoints.speed + speedBonus,
    });
  };

  // Handle restarting practice
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnsweredQuestions([]);
    setCorrectAnswers([]);
    setStreak(0);
    setBestStreak(0);
    setShowSummary(false);
    setTimeSpent(0);
    setSessionStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setAnswerTimes([]);
    setPoints(0);
    setBonusPoints({ streak: 0, speed: 0 });
  };

  // Handle toggling favorite status for a question
  const handleToggleFavorite = (questionId: number) => {
    const updatedFavorites = favoriteQuestions.includes(questionId) ? favoriteQuestions.filter((id) => id !== questionId) : [...favoriteQuestions, questionId];

    setFavoriteQuestions(updatedFavorites);

    // Save to localStorage
    localStorage.setItem("favoriteQuestions", JSON.stringify(updatedFavorites));

    // Show toast notification
    toast({
      title: favoriteQuestions.includes(questionId) ? "Removed from favorites" : "Added to favorites",
      description: favoriteQuestions.includes(questionId) ? "Question has been removed from your favorites" : "Question has been added to your favorites",
      duration: 2000,
    });
  };

  // Handle saving favorite questions
  const handleSaveFavorites = () => {
    // Get IDs of correctly answered questions
    const correctQuestionIds = correctAnswers.map((index) => questions[index].id);

    // Add all correct questions to favorites if they're not already there
    const newFavorites = Array.from(new Set([...favoriteQuestions, ...correctQuestionIds]));
    setFavoriteQuestions(newFavorites);

    // Save to localStorage
    localStorage.setItem("favoriteQuestions", JSON.stringify(newFavorites));

    toast({
      title: "Saved to favorites",
      description: `${correctQuestionIds.length} questions have been added to your favorites`,
      duration: 3000,
    });
  };

  // Handle sharing results
  const handleShareResults = () => {
    const accuracy = answeredQuestions.length > 0 ? Math.round((correctAnswers.length / answeredQuestions.length) * 100) : 0;

    const shareText = `I scored ${points} points with ${accuracy}% accuracy in ShudhuMCQ Quick Practice! My best streak: ${bestStreak}. 🔥`;

    // In a real implementation, this would use the Web Share API or generate a shareable link
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Share your results with friends!",
        duration: 3000,
      });
    });
  };

  // Trigger confetti when practice is completed with decent results
  const triggerConfetti = () => {
    const accuracy = answeredQuestions.length > 0 ? (correctAnswers.length / answeredQuestions.length) * 100 : 0;

    // Only trigger confetti for good performance
    if (accuracy >= 70 || bestStreak >= 5) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  // Calculate average time per question
  const averageTimePerQuestion = answerTimes.length > 0 ? (answerTimes.reduce((sum, time) => sum + time, 0) / answerTimes.length).toFixed(1) : "0";

  // Check if current question is a favorite
  const isCurrentQuestionFavorite = () => {
    if (!questions.length || currentQuestionIndex >= questions.length) return false;
    return favoriteQuestions.includes(questions[currentQuestionIndex].id);
  };

  return (
    <div className="space-y-6">
      {!showSummary ? (
        <>
          <ProgressIndicator answeredCount={answeredQuestions.length} totalCount={questions.length} correctCount={correctAnswers.length} streak={streak} timeSpent={timeSpent} points={points} />

          <AnimatePresence mode="wait">
            <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {questions.length > 0 && currentQuestionIndex < questions.length && <QuestionCard question={questions[currentQuestionIndex]} onNext={handleNextQuestion} onAnswerSubmitted={handleAnswerSubmitted} onToggleFavorite={handleToggleFavorite} isFavorite={isCurrentQuestionFavorite()} />}
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <SessionSummary correctCount={correctAnswers.length} totalCount={questions.length} bestStreak={bestStreak} points={points} timeSpent={timeSpent} averageTime={averageTimePerQuestion} bonusPoints={bonusPoints} onRestart={handleRestart} onSaveFavorites={handleSaveFavorites} onShareResults={handleShareResults} onFinish={onComplete} />
      )}
    </div>
  );
}
