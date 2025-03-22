export type AchievementCategory = "learning" | "exam" | "social" | "streak" | "special";

export type AchievementLevel = "bronze" | "silver" | "gold" | "platinum";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  level: AchievementLevel;
  iconName: string;
  pointsReward: number;
  requiredProgress: number;
  unlockedAt?: Date;
}

export interface UserAchievement {
  achievementId: string;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  level: AchievementLevel;
}
