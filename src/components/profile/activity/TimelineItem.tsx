"use client";

import { Book, FileText, ClipboardCheck, BookOpen, Clock, Award, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  title: string;
  date: string;
  score?: number;
  type: "quiz" | "exam" | "practice" | "review";
  subject?: string;
  timeSpent?: number;
}

interface TimelineItemProps {
  activity: ActivityItem;
}

export function TimelineItem({ activity }: TimelineItemProps) {
  // Format the date as "X time ago"
  const formattedDate = formatDistanceToNow(new Date(activity.date), { addSuffix: true });

  // Determine icon based on activity type
  const getIcon = () => {
    switch (activity.type) {
      case "quiz":
        return <ClipboardCheck className="h-5 w-5" />;
      case "exam":
        return <FileText className="h-5 w-5" />;
      case "practice":
        return <Book className="h-5 w-5" />;
      case "review":
        return <BookOpen className="h-5 w-5" />;
      default:
        return <ClipboardCheck className="h-5 w-5" />;
    }
  };

  // Determine color based on activity type
  const getTypeColor = () => {
    switch (activity.type) {
      case "quiz":
        return "bg-blue-100 text-blue-600";
      case "exam":
        return "bg-purple-100 text-purple-600";
      case "practice":
        return "bg-green-100 text-green-600";
      case "review":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Format activity type for display
  const getTypeLabel = () => {
    return activity.type.charAt(0).toUpperCase() + activity.type.slice(1);
  };

  // Get score color based on score value
  const getScoreColor = () => {
    if (!activity.score) return "text-gray-600";

    if (activity.score >= 80) return "text-emerald-600";
    if (activity.score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
      {/* Icon Circle */}
      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0", getTypeColor())}>{getIcon()}</div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-base truncate">{activity.title}</h4>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
          {/* Date */}
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formattedDate}
          </span>

          {/* Subject if available */}
          {activity.subject && (
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              {activity.subject}
            </span>
          )}

          {/* Time spent if available */}
          {activity.timeSpent && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {activity.timeSpent} min
            </span>
          )}
        </div>
      </div>

      {/* Right Side: Type Badge and Score */}
      <div className="flex flex-col items-end gap-2">
        <span className={cn("text-xs px-2 py-1 rounded-full", getTypeColor())}>{getTypeLabel()}</span>

        {activity.score !== undefined && (
          <div className={cn("font-medium flex items-center gap-1", getScoreColor())}>
            <Award className="h-4 w-4" />
            {activity.score}%
          </div>
        )}
      </div>
    </div>
  );
}
