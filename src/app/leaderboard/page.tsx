"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlobalLeaderboard } from "@/components/leaderboard/GlobalLeaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeaderboardFilters } from "@/components/leaderboard/LeaderboardFilters";
import { AchievementsSection } from "@/components/achievements/AchievementsSection";
import { cn } from "@/lib/utils";

type TimeFrame = "daily" | "weekly" | "monthly" | "all-time";

export default function LeaderboardPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const toggleAchievements = () => setShowAchievements(!showAchievements);

  const handleFilterChange = (subject: string | null, exam: string | null) => {
    setSelectedSubject(subject);
    setSelectedExam(exam);
  };

  const handleResetFilters = () => {
    setSelectedSubject(null);
    setSelectedExam(null);
  };

  const getFilterDescription = () => {
    if (selectedSubject) return `Subject: ${selectedSubject}`;
    if (selectedExam) return `Exam: ${selectedExam}`;
    return "No filters applied";
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={toggleAchievements} className={cn("flex items-center gap-2", showAchievements && "bg-primary/10 border-primary/20")}>
            <Trophy className="w-4 h-4" />
            {showAchievements ? "Hide Achievements" : "View Achievements"}
          </Button>
          <Button variant="outline" onClick={toggleFilter} className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {isFilterOpen && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <LeaderboardFilters onFilterChange={handleFilterChange} onReset={handleResetFilters} selectedSubject={selectedSubject} selectedExam={selectedExam} />
          </CardContent>
        </Card>
      )}

      {(selectedSubject || selectedExam) && (
        <div className="mb-4 p-2 bg-muted rounded-md text-sm">
          <span className="font-medium">Active Filter:</span> {getFilterDescription()}
        </div>
      )}

      {showAchievements ? (
        <AchievementsSection />
      ) : (
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="all-time">All-time</TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <GlobalLeaderboard timeFrame="daily" subject={selectedSubject} exam={selectedExam} />
          </TabsContent>

          <TabsContent value="weekly">
            <GlobalLeaderboard timeFrame="weekly" subject={selectedSubject} exam={selectedExam} />
          </TabsContent>

          <TabsContent value="monthly">
            <GlobalLeaderboard timeFrame="monthly" subject={selectedSubject} exam={selectedExam} />
          </TabsContent>

          <TabsContent value="all-time">
            <GlobalLeaderboard timeFrame="all-time" subject={selectedSubject} exam={selectedExam} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
