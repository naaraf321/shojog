import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Type for the leaderboard entry
type LeaderboardEntry = {
  id: string;
  name: string;
  institution: string;
  points: number;
  avatarUrl?: string;
};

// Sample data for development
const sampleData: LeaderboardEntry[] = [
  {
    id: "user1",
    name: "Rahat Ahmed",
    institution: "University of Dhaka",
    points: 1250,
    avatarUrl: "/avatars/user1.png",
  },
  {
    id: "user2",
    name: "Amina Khan",
    institution: "BUET",
    points: 1120,
    avatarUrl: "/avatars/user2.png",
  },
  {
    id: "user3",
    name: "Fahim Rahman",
    institution: "North South University",
    points: 980,
    avatarUrl: "/avatars/user3.png",
  },
];

interface WeeklyLeaderboardProps {
  entries?: LeaderboardEntry[];
  isLoading?: boolean;
}

export function WeeklyLeaderboard({ entries = sampleData, isLoading = false }: WeeklyLeaderboardProps) {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Leaderboard</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center p-3 bg-accent/30 animate-pulse rounded-md h-16">
              <div className="w-8 h-8 bg-muted rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </div>
              <div className="w-16 h-4 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Weekly Leaderboard</h2>
        <Badge variant="outline" className="hover:bg-primary/10 transition-colors cursor-pointer">
          View All
        </Badge>
      </div>
      <div className="space-y-4">
        {entries.map((entry, index) => {
          const position = index + 1;
          const isCurrentUser = entry.id === user?.uid;

          // Different colors for top 3 positions
          let positionColor = "bg-muted text-foreground";
          if (position === 1) positionColor = "bg-yellow-500 text-yellow-50";
          if (position === 2) positionColor = "bg-slate-400 text-slate-50";
          if (position === 3) positionColor = "bg-amber-700 text-amber-50";

          return (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }} className={cn("flex items-center p-3 rounded-md transition-colors", isCurrentUser ? "bg-primary/10 border border-primary/20" : "bg-accent/40 hover:bg-accent/60")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center mr-3", positionColor)}>{position}</div>
              <Avatar className="h-9 w-9 mr-3">
                <AvatarImage src={entry.avatarUrl} alt={entry.name} />
                <AvatarFallback>
                  {entry.name.charAt(0)}
                  {entry.name.split(" ")[1]?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className={cn("font-medium", isCurrentUser && "text-primary")}>
                  {entry.name} {isCurrentUser && <span className="text-xs ml-1">(You)</span>}
                </div>
                <div className="text-xs text-muted-foreground">{entry.institution}</div>
              </div>
              <div className="font-semibold">
                <span className={cn("font-mono", position === 1 ? "text-yellow-500" : position === 2 ? "text-slate-400" : position === 3 ? "text-amber-700" : "")}>{entry.points.toLocaleString()}</span> pts
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
