import React from "react";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  answered: number;
  total: number;
  percentage: number;
}

export default function ProgressIndicator({ answered, total, percentage }: ProgressIndicatorProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <div className="text-muted-foreground">Progress</div>
        <div className="font-medium">
          {answered}/{total} questions answered
        </div>
      </div>

      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
      </div>

      <div className="flex justify-end">
        <div className="text-xs text-muted-foreground">{percentage.toFixed(0)}% complete</div>
      </div>
    </div>
  );
}
