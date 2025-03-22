import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, HelpCircle, BarChart3, PieChart, TrendingUp, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Mock data for the stats, in a real app this would come from an API
const mockStats = {
  overall: {
    totalAttempts: 278,
    correctAnswers: 189,
    wrongAnswers: 73,
    skipped: 16,
    avgTimePerQuestion: 37, // seconds
    accuracy: 72.14, // percentage
  },
  byDifficulty: {
    easy: { attempted: 93, correct: 79, accuracy: 84.95 },
    medium: { attempted: 112, correct: 78, accuracy: 69.64 },
    hard: { attempted: 73, correct: 32, accuracy: 43.84 },
  },
  byTopic: [
    { topic: "Kinematics", attempted: 43, correct: 31, accuracy: 72.09 },
    { topic: "Dynamics", attempted: 38, correct: 29, accuracy: 76.32 },
    { topic: "Thermodynamics", attempted: 52, correct: 35, accuracy: 67.31 },
    { topic: "Electromagnetism", attempted: 67, correct: 42, accuracy: 62.69 },
    { topic: "Optics", attempted: 48, correct: 34, accuracy: 70.83 },
    { topic: "Modern Physics", attempted: 30, correct: 18, accuracy: 60.0 },
  ],
  trends: {
    accuracy: [68, 65, 71, 73, 70, 72, 75, 78, 76, 72],
    avgTime: [45, 43, 40, 38, 39, 36, 35, 34, 37, 37],
    lastUpdated: "2023-11-15T12:30:00Z",
  },
};

interface QuestionPerformanceStatsProps {
  questionId?: string; // Optional question ID for individual question stats
  subjectId?: string; // Optional subject ID for subject level stats
  isLoading?: boolean;
  isOpen: boolean; // Added for dialog control
  onClose: () => void; // Added for dialog control
}

export default function QuestionPerformanceStats({ questionId, subjectId, isLoading = false, isOpen, onClose }: QuestionPerformanceStatsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("all-time");
  const [stats, setStats] = useState(mockStats);

  // Simulate loading stats from API
  useEffect(() => {
    if (isLoading) return;

    // In a real app, we would fetch the stats here based on questionId/subjectId and timeframe
    // Example:
    // const fetchStats = async () => {
    //   const response = await fetch(`/api/stats/questions?questionId=${questionId}&timeframe=${timeframe}`);
    //   const data = await response.json();
    //   setStats(data);
    // };
    // fetchStats();

    // For this demo, we'll just update the lastUpdated field to simulate fresh data
    setStats({
      ...mockStats,
      trends: {
        ...mockStats.trends,
        lastUpdated: new Date().toISOString(),
      },
    });
  }, [questionId, subjectId, timeframe, isLoading]);

  // Helper function to calculate color based on accuracy
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 75) return "text-green-500";
    if (accuracy >= 60) return "text-amber-500";
    return "text-red-500";
  };

  // Helper to format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  // Helper to render mini stats card
  const MiniStatCard = ({ icon: Icon, label, value, subValue, color }: any) => (
    <div className="bg-card/50 rounded-lg p-4 border border-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <h4 className={`text-2xl font-bold mt-1 ${color || ""}`}>{value}</h4>
          {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
        </div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );

  // Render stats content
  const renderStatsContent = () => {
    // Render loading skeleton
    if (isLoading) {
      return (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-2/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle>Performance Statistics</CardTitle>
              <CardDescription>{questionId ? "Statistics for this question" : subjectId ? "Performance across this subject" : "Your overall question performance"}</CardDescription>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30-days">Last 30 Days</SelectItem>
                  <SelectItem value="90-days">Last 90 Days</SelectItem>
                  <SelectItem value="6-months">Last 6 Months</SelectItem>
                  <SelectItem value="1-year">Last Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="breakdown" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Breakdown
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Accuracy Donut Chart (this would be a real chart in production) */}
              <div className="relative h-48 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                    {/* This is a simple representation - would use a real chart library */}
                    <div
                      className="absolute inset-0 rounded-full border-8 border-green-500"
                      style={{
                        clipPath: `polygon(50% 50%, 100% 50%, 100% 0, 50% 0)`,
                        transform: `rotate(${stats.overall.accuracy * 3.6}deg)`,
                      }}
                    ></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.overall.accuracy.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MiniStatCard icon={Check} label="Correct Answers" value={formatNumber(stats.overall.correctAnswers)} subValue={`${((stats.overall.correctAnswers / stats.overall.totalAttempts) * 100).toFixed(1)}% of total`} color="text-green-500" />
                <MiniStatCard icon={X} label="Wrong Answers" value={formatNumber(stats.overall.wrongAnswers)} subValue={`${((stats.overall.wrongAnswers / stats.overall.totalAttempts) * 100).toFixed(1)}% of total`} color="text-red-500" />
                <MiniStatCard icon={HelpCircle} label="Skipped Questions" value={formatNumber(stats.overall.skipped)} subValue={`${((stats.overall.skipped / stats.overall.totalAttempts) * 100).toFixed(1)}% of total`} color="text-amber-500" />
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Average Time per Question</h4>
                    <p className="text-2xl font-bold mt-1">{stats.overall.avgTimePerQuestion} seconds</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Total Questions Attempted</h4>
                    <p className="text-2xl font-bold mt-1">{formatNumber(stats.overall.totalAttempts)}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-6">
              {/* Difficulty Breakdown */}
              <div>
                <h3 className="text-sm font-medium mb-3">Performance by Difficulty</h3>
                <div className="space-y-3">
                  {Object.entries(stats.byDifficulty).map(([level, data]) => (
                    <div key={level} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm capitalize">{level}</span>
                        <span className={`text-sm font-medium ${getAccuracyColor(data.accuracy)}`}>
                          {data.accuracy.toFixed(1)}% ({data.correct}/{data.attempted})
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${data.accuracy >= 75 ? "bg-green-500" : data.accuracy >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${data.accuracy}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topic Breakdown */}
              <div>
                <h3 className="text-sm font-medium mb-3">Performance by Topic</h3>
                <div className="space-y-3">
                  {stats.byTopic.map((topic) => (
                    <div key={topic.topic} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{topic.topic}</span>
                        <span className={`text-sm font-medium ${getAccuracyColor(topic.accuracy)}`}>
                          {topic.accuracy.toFixed(1)}% ({topic.correct}/{topic.attempted})
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${topic.accuracy >= 75 ? "bg-green-500" : topic.accuracy >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${topic.accuracy}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              {/* Accuracy Trend */}
              <div>
                <h3 className="text-sm font-medium mb-3">Accuracy Trend</h3>
                <div className="h-40 w-full relative">
                  {/* This would be a real chart in production */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-border"></div>
                  <div className="absolute top-0 bottom-0 left-0 w-px bg-border"></div>
                  <div className="relative h-full flex items-end">
                    {stats.trends.accuracy.map((value, i) => (
                      <div key={i} className="flex-1 mx-0.5 flex flex-col items-center justify-end">
                        <div className={`w-full ${getAccuracyColor(value)}`} style={{ height: `${value}%` }}></div>
                        <span className="text-xs text-muted-foreground mt-1">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Average Time Trend */}
              <div>
                <h3 className="text-sm font-medium mb-3">Average Time Trend (seconds)</h3>
                <div className="h-40 w-full relative">
                  {/* This would be a real chart in production */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-border"></div>
                  <div className="absolute top-0 bottom-0 left-0 w-px bg-border"></div>
                  <div className="relative h-full flex items-end">
                    {stats.trends.avgTime.map((value, i) => (
                      <div key={i} className="flex-1 mx-0.5 flex flex-col items-center justify-end">
                        <div className="w-full bg-blue-500" style={{ height: `${(value / 50) * 100}%` }}></div>
                        <span className="text-xs text-muted-foreground mt-1">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4">Last updated: {new Date(stats.trends.lastUpdated).toLocaleString()}</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Question Performance Statistics</DialogTitle>
          <DialogDescription>Analyze performance data for {questionId ? "this question" : subjectId ? "this subject" : "all questions"}</DialogDescription>
        </DialogHeader>
        {renderStatsContent()}
      </DialogContent>
    </Dialog>
  );
}
