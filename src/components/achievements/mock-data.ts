import { Achievement, Badge, UserAchievement } from "./types";

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "streak-7",
    name: "Weekly Wonder",
    description: "Log in for 7 consecutive days",
    category: "streak",
    level: "bronze",
    iconName: "calendar",
    pointsReward: 100,
    requiredProgress: 7,
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    description: "Log in for 30 consecutive days",
    category: "streak",
    level: "silver",
    iconName: "calendar",
    pointsReward: 500,
    requiredProgress: 30,
  },
  {
    id: "exam-first",
    name: "First Exam",
    description: "Complete your first mock exam",
    category: "exam",
    level: "bronze",
    iconName: "trophy",
    pointsReward: 150,
    requiredProgress: 1,
  },
  {
    id: "exam-perfect",
    name: "Perfect Score",
    description: "Get 100% score on a mock exam",
    category: "exam",
    level: "gold",
    iconName: "award",
    pointsReward: 1000,
    requiredProgress: 1,
  },
  {
    id: "learning-25",
    name: "Quick Learner",
    description: "Complete 25 quick practice sessions",
    category: "learning",
    level: "bronze",
    iconName: "zap",
    pointsReward: 250,
    requiredProgress: 25,
  },
  {
    id: "learning-100",
    name: "Knowledge Seeker",
    description: "Complete 100 quick practice sessions",
    category: "learning",
    level: "silver",
    iconName: "brain",
    pointsReward: 750,
    requiredProgress: 100,
  },
  {
    id: "learning-500",
    name: "Master Scholar",
    description: "Complete 500 quick practice sessions",
    category: "learning",
    level: "gold",
    iconName: "book",
    pointsReward: 2000,
    requiredProgress: 500,
  },
  {
    id: "social-first",
    name: "Question Asker",
    description: "Ask your first question in the doubts forum",
    category: "social",
    level: "bronze",
    iconName: "users",
    pointsReward: 100,
    requiredProgress: 1,
  },
  {
    id: "social-helper",
    name: "Helpful Hand",
    description: "Answer 10 questions in the doubts forum",
    category: "social",
    level: "silver",
    iconName: "users",
    pointsReward: 500,
    requiredProgress: 10,
  },
  {
    id: "special-top-rank",
    name: "Top of the Class",
    description: "Reach #1 in the weekly leaderboard",
    category: "special",
    level: "platinum",
    iconName: "crown",
    pointsReward: 2500,
    requiredProgress: 1,
  },
];

export const MOCK_USER_ACHIEVEMENTS: UserAchievement[] = [
  {
    achievementId: "streak-7",
    progress: 7,
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  },
  {
    achievementId: "streak-30",
    progress: 12,
    isUnlocked: false,
  },
  {
    achievementId: "exam-first",
    progress: 1,
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
  {
    achievementId: "exam-perfect",
    progress: 0,
    isUnlocked: false,
  },
  {
    achievementId: "learning-25",
    progress: 25,
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    achievementId: "learning-100",
    progress: 43,
    isUnlocked: false,
  },
  {
    achievementId: "social-first",
    progress: 1,
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
];

// Function to get badges from unlocked achievements
export function getBadgesFromAchievements(achievements: Achievement[], userAchievements: UserAchievement[]): Badge[] {
  const unlockedAchievements = userAchievements.filter((ua) => ua.isUnlocked);

  return unlockedAchievements
    .map((ua) => {
      const achievement = achievements.find((a) => a.id === ua.achievementId);
      if (!achievement) return null;

      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        iconName: achievement.iconName,
        level: achievement.level,
      };
    })
    .filter(Boolean) as Badge[];
}
