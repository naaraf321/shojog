"use client";

import React from "react";
import { MotionDiv } from "@/components/ui/framer-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Achievement, UserAchievement } from "./types";
import { Badge } from "./Badge";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { Sparkles } from "lucide-react";

interface AchievementCardProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  className?: string;
}

export function AchievementCard({ achievement, userAchievement, className }: AchievementCardProps) {
  const { name, description, level, pointsReward, requiredProgress } = achievement;

  const isUnlocked = userAchievement?.isUnlocked || false;
  const progress = userAchievement?.progress || 0;
  const progressPercentage = Math.min(100, Math.round((progress / requiredProgress) * 100));

  return (
    <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className={cn("overflow-hidden transition-all", isUnlocked ? "border-primary/30 bg-primary/5" : "", className)}>
        <CardContent className="p-0">
          <div className="p-4 flex items-start gap-3">
            <Badge
              badge={{
                id: achievement.id,
                name: achievement.name,
                description: achievement.description,
                iconName: achievement.iconName,
                level: achievement.level,
              }}
              size="lg"
              showTooltip={false}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{name}</h3>
                {isUnlocked && (
                  <span className="inline-flex items-center text-yellow-500">
                    <Sparkles className="w-3 h-3 mr-1" />
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{description}</p>

              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    Progress: {progress}/{requiredProgress}
                  </span>
                  <span className="font-medium text-primary">+{pointsReward} pts</span>
                </div>
                <Progress value={progressPercentage} className="h-1.5" />
              </div>

              {isUnlocked && userAchievement?.unlockedAt && <div className="mt-2 text-xs text-muted-foreground">Unlocked {formatDistanceToNow(userAchievement.unlockedAt, { addSuffix: true })}</div>}
            </div>
          </div>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
