import React, { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExamTimerProps {
  timeLeft: number; // in seconds
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

export default function ExamTimer({ timeLeft, setTimeLeft }: ExamTimerProps) {
  const [isWarning, setIsWarning] = useState(false);

  // Format time from seconds to HH:MM:SS
  const formatTime = (seconds: number): string => {
    if (seconds < 0) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs].map((v) => v.toString().padStart(2, "0")).join(":");
  };

  // Set timer to count down each second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setTimeLeft]);

  // Set warning when less than 5 minutes remain
  useEffect(() => {
    setIsWarning(timeLeft <= 300 && timeLeft > 0);
  }, [timeLeft]);

  // Calculate percentage of time left for visual indicator
  const timePercentage = (timeLeft / (60 * 60)) * 100; // Assuming 60 min exam

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isWarning ? "bg-red-500/10" : "bg-card border"}`}>
        <Clock className={`w-4 h-4 ${isWarning ? "text-red-500" : ""}`} />

        <div className="text-sm font-medium">
          <AnimatePresence mode="wait">
            <motion.span key={timeLeft} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }} className={isWarning ? "text-red-500" : ""}>
              {formatTime(timeLeft)}
            </motion.span>
          </AnimatePresence>
        </div>

        {isWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 0.8,
            }}
          >
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </motion.div>
        )}
      </div>

      {/* Progress bar under the timer */}
      <div className="w-full h-1 mt-1 bg-muted rounded-full overflow-hidden">
        <motion.div className={`h-full ${isWarning ? "bg-red-500" : "bg-primary"}`} style={{ width: `${Math.max(timePercentage, 0)}%` }} animate={{ width: `${Math.max(timePercentage, 0)}%` }} transition={{ duration: 0.5 }} />
      </div>
    </div>
  );
}
