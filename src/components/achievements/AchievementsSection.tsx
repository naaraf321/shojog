"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AchievementCard } from "./AchievementCard";
import { Achievement, UserAchievement, AchievementCategory } from "./types";
import { MOCK_ACHIEVEMENTS, MOCK_USER_ACHIEVEMENTS } from "./mock-data";
import { MotionDiv } from "@/components/ui/framer-wrapper";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";
import { Button } from "@/components/ui/button";
import { AchievementNotification } from "./AchievementNotification";

interface AchievementsSectionProps {
  className?: string;
}

export function AchievementsSection({ className }: AchievementsSectionProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | "all">("all");
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  // For demo only - simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setAchievements(MOCK_ACHIEVEMENTS);
      setUserAchievements(MOCK_USER_ACHIEVEMENTS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // For demo only - show a notification after a short delay
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        const achievement = MOCK_ACHIEVEMENTS.find((a) => a.id === "social-first");
        if (achievement) {
          setUnlockedAchievement(achievement);
          setShowNotification(true);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Get filtered achievements based on category
  const filteredAchievements = achievements.filter((achievement) => {
    // Filter by category
    const categoryMatch = activeCategory === "all" || achievement.category === activeCategory;

    // Filter by unlocked status if needed
    if (showUnlockedOnly) {
      const userAchievement = userAchievements.find((ua) => ua.achievementId === achievement.id);
      return categoryMatch && userAchievement?.isUnlocked;
    }

    return categoryMatch;
  });

  // Count unlocked achievements
  const unlockedCount = userAchievements.filter((ua) => ua.isUnlocked).length;

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Achievements</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {unlockedCount} of {achievements.length} unlocked
              </span>
              <Button variant="outline" size="sm" onClick={() => setShowUnlockedOnly(!showUnlockedOnly)} className={cn("text-xs", showUnlockedOnly && "bg-primary/10 border-primary/20")}>
                {showUnlockedOnly ? "Show All" : "Show Unlocked Only"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeCategory} onValueChange={(value) => setActiveCategory(value as AchievementCategory | "all")} className="w-full">
            <div className="overflow-x-auto pb-2">
              <TabsList className="min-w-max">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="streak">Streaks</TabsTrigger>
                <TabsTrigger value="learning">Learning</TabsTrigger>
                <TabsTrigger value="exam">Exams</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="special">Special</TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-4">
              <TabsContent value="all" className="m-0">
                <AchievementsList achievements={filteredAchievements} userAchievements={userAchievements} loading={loading} />
              </TabsContent>

              {["streak", "learning", "exam", "social", "special"].map((category) => (
                <TabsContent key={category} value={category} className="m-0">
                  <AchievementsList achievements={filteredAchievements} userAchievements={userAchievements} loading={loading} />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Badge Showcase */}
      <BadgeShowcase achievements={achievements} userAchievements={userAchievements} loading={loading} />

      {/* Achievement notification */}
      {showNotification && unlockedAchievement && <AchievementNotification achievement={unlockedAchievement} onClose={() => setShowNotification(false)} />}
    </div>
  );
}

// Component to display a list of achievements
function AchievementsList({ achievements, userAchievements, loading }: { achievements: Achievement[]; userAchievements: UserAchievement[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-24 animate-pulse bg-accent/20" />
        ))}
      </div>
    );
  }

  if (achievements.length === 0) {
    return <div className="py-6 text-center text-muted-foreground">No achievements found in this category.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {achievements.map((achievement) => {
        const userAchievement = userAchievements.find((ua) => ua.achievementId === achievement.id);

        return <AchievementCard key={achievement.id} achievement={achievement} userAchievement={userAchievement} />;
      })}
    </div>
  );
}

// Component to display a showcase of unlocked badges
function BadgeShowcase({ achievements, userAchievements, loading }: { achievements: Achievement[]; userAchievements: UserAchievement[]; loading: boolean }) {
  // Get unlocked achievements
  const unlockedUserAchievements = userAchievements.filter((ua) => ua.isUnlocked);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Badge Showcase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-accent/20 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (unlockedUserAchievements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Badge Showcase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center text-muted-foreground">No badges unlocked yet. Complete achievements to earn badges!</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Badge Showcase</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 flex-wrap">
          {unlockedUserAchievements.map((ua) => {
            const achievement = achievements.find((a) => a.id === ua.achievementId);
            if (!achievement) return null;

            return (
              <MotionDiv key={ua.achievementId} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
                <Badge
                  badge={{
                    id: achievement.id,
                    name: achievement.name,
                    description: achievement.description,
                    iconName: achievement.iconName,
                    level: achievement.level,
                  }}
                  size="lg"
                  showTooltip={true}
                />
              </MotionDiv>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
