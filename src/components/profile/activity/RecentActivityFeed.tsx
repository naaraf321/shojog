"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, BookOpen, Calendar, Clock, Trophy } from "lucide-react";
import { MotionDiv } from "@/components/ui/framer-wrapper";

interface Activity {
  id: number;
  type: string;
  title: string;
  date: string;
  score?: string;
  questionsAnswered?: number;
  replies?: number;
}

interface RecentActivityFeedProps {
  activity: Activity[];
}

export function RecentActivityFeed({ activity }: RecentActivityFeedProps) {
  return (
    <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="col-span-1 md:col-span-2">
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activity.map((item) => (
              <div key={item.id} className="flex gap-4 items-start pb-4 border-b last:border-b-0 last:pb-0">
                <div className="rounded-full p-2 bg-primary/10">
                  {item.type === "exam" && <BookOpen className="h-4 w-4 text-primary" />}
                  {item.type === "practice" && <BarChart2 className="h-4 w-4 text-emerald-500" />}
                  {item.type === "doubt" && <Calendar className="h-4 w-4 text-blue-500" />}
                  {item.type === "achievement" && <Trophy className="h-4 w-4 text-yellow-500" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-muted-foreground flex justify-between mt-1">
                    <span>{item.date}</span>
                    {item.score && <span className="text-primary">{item.score}</span>}
                    {item.questionsAnswered && <span>{item.questionsAnswered} questions</span>}
                    {item.replies && <span>{item.replies} replies</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
