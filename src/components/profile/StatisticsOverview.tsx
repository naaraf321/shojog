"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MotionDiv } from "@/components/ui/framer-wrapper";
import { Award, BookOpen, CheckCircle, Target } from "lucide-react";

interface StatisticsData {
  totalPoints: number;
  examsTaken: number;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  streakDays: number;
  rank: number;
  rankPercentile: number;
}

interface StatisticsOverviewProps {
  statistics: StatisticsData;
}

export function StatisticsOverview({ statistics }: StatisticsOverviewProps) {
  // Calculate stats for progress bars
  const pointsPercentage = Math.min((statistics.totalPoints / 10000) * 100, 100);
  const accuracyPercentage = statistics.accuracy;
  const rankPercentile = statistics.rankPercentile;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Points Card */}
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-muted-foreground">Total Points</h3>
                <Award className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold">{statistics.totalPoints.toLocaleString()}</div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${pointsPercentage}%` }} />
              </div>
              <div className="text-xs text-muted-foreground">{Math.round(pointsPercentage)}% to next level</div>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Accuracy Card */}
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-muted-foreground">Accuracy</h3>
                <Target className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold">{statistics.accuracy}%</div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${accuracyPercentage}%` }} />
              </div>
              <div className="text-xs text-muted-foreground">
                {statistics.correctAnswers} correct out of {statistics.questionsAnswered}
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Rank Card */}
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-muted-foreground">Rank</h3>
                <Award className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold">#{statistics.rank}</div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${rankPercentile}%` }} />
              </div>
              <div className="text-xs text-muted-foreground">Top {statistics.rankPercentile}% of all users</div>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Study Streak Card */}
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-muted-foreground">Study Streak</h3>
                <BookOpen className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{statistics.streakDays} days</div>

              {/* Mini calendar representation */}
              <div className="flex gap-1 mt-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className={`h-6 w-6 rounded-sm flex items-center justify-center text-xs ${i < statistics.streakDays % 7 ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground"}`}>
                    {i < statistics.streakDays % 7 && <CheckCircle className="h-3 w-3" />}
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">Keep it up! {7 - (statistics.streakDays % 7)} days until next reward</div>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>
    </div>
  );
}
