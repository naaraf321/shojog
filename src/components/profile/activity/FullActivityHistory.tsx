"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Clock, ArrowDownUp } from "lucide-react";
import { MotionDiv } from "@/components/ui/framer-wrapper";
import { TimelineItem } from "./TimelineItem";

interface ActivityItem {
  id: string;
  title: string;
  date: string;
  score?: number;
  type: "quiz" | "exam" | "practice" | "review";
  subject?: string;
  timeSpent?: number;
}

interface FullActivityHistoryProps {
  activities: ActivityItem[];
}

export function FullActivityHistory({ activities }: FullActivityHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const filteredActivities = useMemo(() => {
    let result = [...activities];

    // Filter by type
    if (filter !== "all") {
      result = result.filter((activity) => activity.type === filter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((activity) => activity.title.toLowerCase().includes(query) || (activity.subject && activity.subject.toLowerCase().includes(query)));
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [activities, filter, searchQuery, sortOrder]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Activity History
          </span>
          <span className="text-sm font-normal text-muted-foreground">{filteredActivities.length} activities</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Filters Section */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search activities..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div className="flex gap-3">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="quiz">Quizzes</SelectItem>
                  <SelectItem value="exam">Exams</SelectItem>
                  <SelectItem value="practice">Practice</SelectItem>
                  <SelectItem value="review">Reviews</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")} title={sortOrder === "newest" ? "Newest first" : "Oldest first"}>
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity, index) => (
                <MotionDiv key={activity.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }}>
                  <TimelineItem activity={activity} />
                </MotionDiv>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No activities match your filters</div>
            )}
          </div>

          {/* Load More */}
          {filteredActivities.length > 10 && (
            <div className="flex justify-center mt-6">
              <Button variant="outline">Load more</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
