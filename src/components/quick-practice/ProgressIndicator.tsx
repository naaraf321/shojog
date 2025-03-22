"use client";

import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Award, Clock, Flame, Zap } from "lucide-react";

interface ProgressIndicatorProps {
  answeredCount: number;
  totalCount: number;
  correctCount: number;
  streak: number;
  timeSpent: number;
  points: number;
}

export default function ProgressIndicator({ answeredCount, totalCount, correctCount, streak, timeSpent, points }: ProgressIndicatorProps) {
  // Calculate progress percentage
  const progressPercentage = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  // Calculate accuracy
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // Format time spent
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span>
              {answeredCount}/{totalCount} questions
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Accuracy */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
              <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Accuracy</p>
              <p className="font-medium">{accuracy}%</p>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-2">
              <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Streak</p>
              <p className="font-medium">{streak}</p>
            </div>
            {streak >= 3 && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full">
                +5
              </motion.div>
            )}
          </div>

          {/* Time spent */}
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-2">
              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-medium">{formatTime(timeSpent)}</p>
            </div>
          </div>

          {/* Points */}
          <div className="flex items-center gap-2">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-2">
              <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Points</p>
              <p className="font-medium">{points}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
