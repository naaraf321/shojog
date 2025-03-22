"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Save, Share2, TrendingUp, Clock, Award, Flame, Zap, Trophy } from "lucide-react";

interface SessionSummaryProps {
  correctCount: number;
  totalCount: number;
  bestStreak: number;
  points: number;
  timeSpent: number;
  averageTime: string;
  bonusPoints: {
    streak: number;
    speed: number;
  };
  onRestart: () => void;
  onSaveFavorites: () => void;
  onShareResults: () => void;
  onFinish: () => void;
}

export default function SessionSummary({ correctCount, totalCount, bestStreak, points, timeSpent, averageTime, bonusPoints, onRestart, onSaveFavorites, onShareResults, onFinish }: SessionSummaryProps) {
  const accuracy = Math.round((correctCount / totalCount) * 100);
  const basePoints = correctCount * 10; // Assuming 10 points per correct answer

  // Calculate grade based on accuracy
  const getGrade = (accuracy: number) => {
    if (accuracy >= 95) return { letter: "A+", color: "text-green-500" };
    if (accuracy >= 90) return { letter: "A", color: "text-green-500" };
    if (accuracy >= 85) return { letter: "A-", color: "text-green-500" };
    if (accuracy >= 80) return { letter: "B+", color: "text-green-400" };
    if (accuracy >= 75) return { letter: "B", color: "text-green-400" };
    if (accuracy >= 70) return { letter: "B-", color: "text-green-400" };
    if (accuracy >= 65) return { letter: "C+", color: "text-yellow-500" };
    if (accuracy >= 60) return { letter: "C", color: "text-yellow-500" };
    if (accuracy >= 55) return { letter: "C-", color: "text-yellow-500" };
    if (accuracy >= 50) return { letter: "D+", color: "text-orange-500" };
    if (accuracy >= 45) return { letter: "D", color: "text-orange-500" };
    if (accuracy >= 40) return { letter: "D-", color: "text-orange-500" };
    return { letter: "F", color: "text-red-500" };
  };

  const grade = getGrade(accuracy);

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Practice Completed!</h2>
        <p className="text-muted-foreground">Here&apos;s how you performed in this session</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Grade card */}
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <Trophy className="h-24 w-24" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Overall Grade</p>
            <h3 className={`text-5xl font-bold ${grade.color}`}>{grade.letter}</h3>
            <p className="text-sm">{accuracy}% accuracy</p>
          </div>
        </Card>

        {/* Performance */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Performance</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Correct Answers</span>
                <span className="font-medium text-green-500">
                  {correctCount}/{totalCount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Questions Completed</span>
                <span className="font-medium">{totalCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Best Streak</span>
                <span className="font-medium text-orange-500">{bestStreak}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Points breakdown */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Points Earned</span>
              </div>
              <span className="text-xl font-bold">{points}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base Points</span>
                <span className="font-medium">{basePoints}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Streak Bonus</span>
                <span className="font-medium text-orange-500">+{bonusPoints.streak}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Speed Bonus</span>
                <span className="font-medium text-blue-500">+{bonusPoints.speed}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time stats */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Time Statistics</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Time</span>
                <span className="font-medium">{formatTime(timeSpent)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Average Time per Question</span>
                <span className="font-medium">{averageTime}s</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Improvement tips */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Improvement Tips</span>
            </div>

            <div className="space-y-2 text-sm">
              {accuracy < 70 && <p>Focus on understanding the core concepts before trying to memorize formulas.</p>}
              {bestStreak < 3 && <p>Try to build your streak by carefully reading each question before answering.</p>}
              {averageTime && parseFloat(averageTime) > 15 && <p>Work on improving your speed by practicing similar questions regularly.</p>}
              {accuracy >= 90 && <p>Great job! Try more challenging questions to continue improving.</p>}
            </div>
          </div>
        </Card>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <Button variant="outline" onClick={onRestart} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Practice Again
        </Button>

        <Button variant="outline" onClick={onSaveFavorites} className="gap-2">
          <Save className="h-4 w-4" />
          Save Favorites
        </Button>

        <Button variant="outline" onClick={onShareResults} className="gap-2">
          <Share2 className="h-4 w-4" />
          Share Results
        </Button>

        <Button onClick={onFinish} className="gap-2">
          Finish
        </Button>
      </div>
    </motion.div>
  );
}
