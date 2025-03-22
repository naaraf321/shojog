"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge as BadgeType, AchievementLevel } from "./types";
import { Trophy, Award, Star, Medal, Zap, Brain, BookOpen, Users, Calendar, Crown, LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BadgeProps {
  badge: BadgeType;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  trophy: Trophy,
  award: Award,
  star: Star,
  medal: Medal,
  zap: Zap,
  brain: Brain,
  book: BookOpen,
  users: Users,
  calendar: Calendar,
  crown: Crown,
};

const levelColors: Record<AchievementLevel, { bg: string; text: string; border: string }> = {
  bronze: {
    bg: "bg-amber-900/20",
    text: "text-amber-700",
    border: "border-amber-700/30",
  },
  silver: {
    bg: "bg-slate-400/20",
    text: "text-slate-400",
    border: "border-slate-400/30",
  },
  gold: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-500",
    border: "border-yellow-500/30",
  },
  platinum: {
    bg: "bg-emerald-400/20",
    text: "text-emerald-400",
    border: "border-emerald-400/30",
  },
};

export function Badge({ badge, size = "md", showTooltip = true, className }: BadgeProps) {
  const { name, description, iconName, level } = badge;

  const Icon = iconMap[iconName] || Award;
  const { bg, text, border } = levelColors[level];

  const sizesMap = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const BadgeElement = (
    <div className={cn("rounded-full flex items-center justify-center border-2", bg, border, sizesMap[size], className)}>
      <Icon className={cn(text, "w-3/5 h-3/5")} />
    </div>
  );

  if (!showTooltip) return BadgeElement;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{BadgeElement}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          <div className="space-y-1">
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
            <p className={cn("text-xs capitalize", text)}>{level} Level</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
