"use client";

import React from "react";
import { Achievement } from "./types";
import { MotionDiv } from "@/components/ui/framer-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "./Badge";
import { PartyPopper } from "lucide-react";

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  className?: string;
}

export function AchievementNotification({ achievement, onClose, className }: AchievementNotificationProps) {
  const { name, description, pointsReward } = achievement;

  // Close the notification after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <MotionDiv style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 50, maxWidth: "24rem" }} initial={{ opacity: 0, y: 50, x: 20 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ type: "spring", damping: 20 }}>
      <Card className="border-2 border-primary/30 bg-background shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Badge
                badge={{
                  id: achievement.id,
                  name: achievement.name,
                  description: achievement.description,
                  iconName: achievement.iconName,
                  level: achievement.level,
                }}
                size="lg"
                showTooltip={false}
              />
              <span className="absolute -top-1 -right-1 text-yellow-500">
                <PartyPopper className="w-5 h-5" />
              </span>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-primary">Achievement Unlocked!</h3>
                  <p className="font-medium">{name}</p>
                </div>
                <button className="text-muted-foreground hover:text-foreground" onClick={onClose}>
                  ✕
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-1">{description}</p>

              <div className="mt-2 text-sm font-medium text-primary">+{pointsReward} points earned</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
