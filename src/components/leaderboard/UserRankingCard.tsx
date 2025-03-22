"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LeaderboardUser } from "./GlobalLeaderboard";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface UserRankingCardProps {
  user: LeaderboardUser;
  isCurrentUser: boolean;
}

export function UserRankingCard({ user, isCurrentUser }: UserRankingCardProps) {
  // Calculate position change
  const positionChange = user.previousPosition ? user.previousPosition - user.position : 0;

  // Determine position color based on ranking
  let positionColor = "bg-muted text-foreground";
  if (user.position === 1) positionColor = "bg-yellow-500 text-yellow-50";
  if (user.position === 2) positionColor = "bg-slate-400 text-slate-50";
  if (user.position === 3) positionColor = "bg-amber-700 text-amber-50";

  // Animation variants for the card
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={item} layout className={cn("flex items-center p-3 rounded-md transition-colors", isCurrentUser ? "bg-primary/10 border border-primary/20" : "bg-accent/40 hover:bg-accent/60")}>
      {/* Position indicator */}
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center mr-3", positionColor)}>{user.position}</div>

      {/* User avatar */}
      <Avatar className="h-9 w-9 mr-3">
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback>
          {user.name.charAt(0)}
          {user.name.split(" ")[1]?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      {/* User info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("font-medium truncate", isCurrentUser && "text-primary")}>
            {user.name}
            {isCurrentUser && <span className="text-xs ml-1">(You)</span>}
          </span>

          {/* Display badges if available */}
          {user.badges && user.badges.length > 0 && (
            <Badge variant="outline" className="text-xs px-1 py-0 h-4 whitespace-nowrap">
              {user.badges[0]}
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground truncate">{user.institution}</div>
      </div>

      {/* Points and position change */}
      <div className="text-right">
        <div className="font-semibold">
          <span className={cn("font-mono", user.position === 1 ? "text-yellow-500" : user.position === 2 ? "text-slate-400" : user.position === 3 ? "text-amber-700" : "")}>{user.points.toLocaleString()}</span> <span className="text-xs text-muted-foreground">pts</span>
        </div>

        {/* Position change indicator */}
        {positionChange !== 0 && (
          <div className="flex items-center justify-end mt-1">
            {positionChange > 0 ? (
              <div className="flex items-center text-xs text-green-500">
                <ArrowUp className="w-3 h-3 mr-1" />
                <span>{positionChange}</span>
              </div>
            ) : positionChange < 0 ? (
              <div className="flex items-center text-xs text-red-500">
                <ArrowDown className="w-3 h-3 mr-1" />
                <span>{Math.abs(positionChange)}</span>
              </div>
            ) : (
              <div className="flex items-center text-xs text-muted-foreground">
                <Minus className="w-3 h-3 mr-1" />
                <span>0</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
