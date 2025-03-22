"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { UserRankingCard } from "./UserRankingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import API_ENDPOINTS from "@/lib/api";

// Type for the leaderboard user
export type LeaderboardUser = {
  id: string;
  name: string;
  institution: string;
  points: number;
  avatarUrl?: string;
  badges?: string[];
  position: number;
  previousPosition?: number;
};

// Props for the GlobalLeaderboard component
interface GlobalLeaderboardProps {
  timeFrame: "daily" | "weekly" | "monthly" | "all-time";
  subject: string | null;
  exam: string | null;
}

export function GlobalLeaderboard({ timeFrame, subject, exam }: GlobalLeaderboardProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);

  // Temporary mock data for development
  const mockUsers: LeaderboardUser[] = Array.from({ length: 50 }, (_, i) => ({
    id: `user${i + 1}`,
    name: `User ${i + 1}`,
    institution: `Institution ${Math.floor(i / 10) + 1}`,
    points: 10000 - i * 100 + Math.floor(Math.random() * 50),
    position: i + 1,
    previousPosition: i + 1 + (Math.random() > 0.7 ? Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1) : 0),
    badges: i < 3 ? ["Top Performer", "Rising Star"] : i < 10 ? ["Active Learner"] : [],
  }));

  const fetchLeaderboardData = useCallback(
    async (pageToFetch: number) => {
      setIsLoading(true);

      try {
        // In a real app, you would use these params to call the actual API
        let endpoint = API_ENDPOINTS.LEADERBOARD.GLOBAL;

        if (subject) {
          endpoint = API_ENDPOINTS.LEADERBOARD.BY_SUBJECT(subject);
        } else if (exam) {
          endpoint = API_ENDPOINTS.LEADERBOARD.BY_EXAM(exam);
        }

        // For now, use mock data since we don't have an actual backend
        setTimeout(() => {
          // Simulate pagination
          const startIndex = (pageToFetch - 1) * 10;
          const endIndex = startIndex + 10;
          const newUsers = mockUsers.slice(startIndex, endIndex);

          // If this is the first page, replace data completely
          if (pageToFetch === 1) {
            setUsers(newUsers);
          } else {
            // Otherwise append to existing data
            setUsers((prev) => [...prev, ...newUsers]);
          }

          // Check if there are more items to load
          setHasMore(endIndex < mockUsers.length);

          // Find the current user in the leaderboard
          const currentUser = mockUsers.find((u) => u.id === user?.uid);
          if (currentUser) {
            setCurrentUserRank(currentUser);
          }

          setIsLoading(false);
        }, 1000); // Simulate network latency
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setIsLoading(false);
      }
    },
    [mockUsers, subject, exam, user?.uid]
  );

  useEffect(() => {
    // Reset pagination when filters change
    setPage(1);
    setHasMore(true);
    fetchLeaderboardData(1);
  }, [timeFrame, subject, exam, fetchLeaderboardData]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLeaderboardData(nextPage);
  };

  // Animations for user rankings
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Display current user's rank if not in top positions */}
      {currentUserRank && currentUserRank.position > 10 && (
        <Card className="p-4 border-2 border-primary/20 bg-primary/5">
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Your Current Rank</h3>
          <UserRankingCard user={currentUserRank} isCurrentUser={true} />
        </Card>
      )}

      {/* Leaderboard Listing */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-card/80 border-b border-border">
          <h2 className="text-xl font-semibold">{timeFrame === "daily" ? "Daily" : timeFrame === "weekly" ? "Weekly" : timeFrame === "monthly" ? "Monthly" : "All-Time"} Rankings</h2>
        </div>

        {isLoading && page === 1 ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center p-3 bg-accent/30 animate-pulse rounded-md">
                <div className="w-8 h-8 bg-muted rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </div>
                <div className="w-16 h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <motion.div className="p-4 space-y-3" variants={container} initial="hidden" animate="show">
              <AnimatePresence mode="popLayout">
                {users.map((userItem) => (
                  <UserRankingCard key={userItem.id} user={userItem} isCurrentUser={userItem.id === user?.uid} />
                ))}
              </AnimatePresence>

              {isLoading && page > 1 && (
                <div className="flex justify-center p-4">
                  <Skeleton className="h-10 w-32" />
                </div>
              )}

              {!isLoading && hasMore && (
                <div className="flex justify-center py-4">
                  <Button variant="outline" onClick={loadMore} className="flex items-center gap-2">
                    Load More <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {!hasMore && users.length > 0 && <div className="text-center text-sm text-muted-foreground py-4">End of leaderboard</div>}
            </motion.div>
          </>
        )}
      </Card>
    </div>
  );
}
