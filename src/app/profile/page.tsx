"use client";

import { useEffect, useState } from "react";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AchievementsSection } from "@/components/achievements/AchievementsSection";
import { motion } from "framer-motion";
import { MotionDiv } from "@/components/ui/framer-wrapper";
import { Settings, Calendar, BarChart2, Trophy, Clock, BookOpen, Edit } from "lucide-react";
import { getUserProfile } from "@/lib/userService";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatisticsOverview } from "@/components/profile/StatisticsOverview";
import { DetailedStatistics } from "@/components/profile/statistics/DetailedStatistics";
import { RecentActivityFeed } from "@/components/profile/activity/RecentActivityFeed";
import { FullActivityHistory } from "@/components/profile/activity/FullActivityHistory";
import Link from "next/link";

// Define activity type to match component requirements
type ActivityType = "exam" | "practice" | "quiz" | "review";

// Convert activity data to match component requirements
const convertActivityForComponent = (activities: any[]) => {
  return activities.map((activity, index) => ({
    ...activity,
    id: index + 1, // Convert string ID to number
    score: activity.score ? activity.score.toString() : undefined, // Convert number score to string
  }));
};

// Mock data for user profile
const mockProfileData = {
  profilePicture: "/assets/avatar-placeholder.png",
  coverPhoto: "/assets/cover-placeholder.jpg",
  statistics: {
    totalPoints: 7850,
    examsTaken: 24,
    questionsAnswered: 1287,
    correctAnswers: 1031,
    accuracy: 81,
    streakDays: 12,
    rank: 345,
    rankPercentile: 92,
  },
  recentActivities: [
    {
      id: "act1",
      title: "Physics Mock Exam #3",
      date: "2023-09-05T10:30:00",
      score: 92,
      type: "exam" as ActivityType,
      subject: "Physics",
      timeSpent: 75,
    },
    {
      id: "act2",
      title: "Organic Chemistry Practice",
      date: "2023-09-04T15:45:00",
      score: 78,
      type: "practice" as ActivityType,
      subject: "Chemistry",
      timeSpent: 45,
    },
    {
      id: "act3",
      title: "Calculus Quiz",
      date: "2023-09-03T09:15:00",
      score: 85,
      type: "quiz" as ActivityType,
      subject: "Mathematics",
      timeSpent: 30,
    },
    {
      id: "act4",
      title: "Biology Chapter 5 Review",
      date: "2023-09-02T14:20:00",
      type: "review" as ActivityType,
      subject: "Biology",
      timeSpent: 60,
    },
  ],
  allActivities: [
    // Include recent activities and add more
    {
      id: "act1",
      title: "Physics Mock Exam #3",
      date: "2023-09-05T10:30:00",
      score: 92,
      type: "exam" as ActivityType,
      subject: "Physics",
      timeSpent: 75,
    },
    {
      id: "act2",
      title: "Organic Chemistry Practice",
      date: "2023-09-04T15:45:00",
      score: 78,
      type: "practice" as ActivityType,
      subject: "Chemistry",
      timeSpent: 45,
    },
    {
      id: "act3",
      title: "Calculus Quiz",
      date: "2023-09-03T09:15:00",
      score: 85,
      type: "quiz" as ActivityType,
      subject: "Mathematics",
      timeSpent: 30,
    },
    {
      id: "act4",
      title: "Biology Chapter 5 Review",
      date: "2023-09-02T14:20:00",
      type: "review" as ActivityType,
      subject: "Biology",
      timeSpent: 60,
    },
    {
      id: "act5",
      title: "Chemistry Final Exam",
      date: "2023-08-30T11:00:00",
      score: 88,
      type: "exam" as ActivityType,
      subject: "Chemistry",
      timeSpent: 90,
    },
    {
      id: "act6",
      title: "Physics Problem Set",
      date: "2023-08-28T16:30:00",
      score: 76,
      type: "practice" as ActivityType,
      subject: "Physics",
      timeSpent: 50,
    },
    {
      id: "act7",
      title: "Literature Analysis Quiz",
      date: "2023-08-25T13:15:00",
      score: 92,
      type: "quiz" as ActivityType,
      subject: "English",
      timeSpent: 25,
    },
    {
      id: "act8",
      title: "Mathematics Chapter Review",
      date: "2023-08-23T10:45:00",
      type: "review" as ActivityType,
      subject: "Mathematics",
      timeSpent: 40,
    },
    {
      id: "act9",
      title: "Biology Practice Test",
      date: "2023-08-20T14:00:00",
      score: 81,
      type: "practice" as ActivityType,
      subject: "Biology",
      timeSpent: 55,
    },
    {
      id: "act10",
      title: "Chemistry Lab Quiz",
      date: "2023-08-18T09:30:00",
      score: 94,
      type: "quiz" as ActivityType,
      subject: "Chemistry",
      timeSpent: 20,
    },
  ],
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(mockProfileData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          // Comment out for now since we're using mock data
          // const data = await getUserProfile(user.uid);
          // setProfileData(data);

          // Use mock data instead
          setTimeout(() => {
            setProfileData(mockProfileData);
            setIsLoading(false);
          }, 800);
        } catch (error) {
          console.error("Error fetching profile data:", error);
          setIsLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  if (!user) {
    return <div className="p-10 text-center">Please log in to view your profile.</div>;
  }

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <p className="mt-4">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8 max-w-6xl">
      {/* Profile Header Section */}
      <ProfileHeader
        user={{
          id: user.uid,
          name: user.displayName || "User",
          email: user.email || "",
          profilePicture: profileData.profilePicture,
          coverPhoto: profileData.coverPhoto,
        }}
      />

      {/* Settings Button */}
      <div className="flex justify-end">
        <Button asChild variant="outline" className="flex items-center gap-2">
          <Link href="/profile/settings">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>

      {/* Statistics Overview Section */}
      <StatisticsOverview statistics={profileData.statistics} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <DetailedStatistics statistics={profileData.statistics} />
            </div>
            <div className="md:col-span-1">
              <RecentActivityFeed activity={convertActivityForComponent(profileData.recentActivities)} />
            </div>
          </div>
        </TabsContent>

        {/* Statistics Tab Content */}
        <TabsContent value="statistics">
          <DetailedStatistics statistics={profileData.statistics} />
        </TabsContent>

        {/* Activity Tab Content */}
        <TabsContent value="activity">
          <FullActivityHistory activities={profileData.allActivities} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
