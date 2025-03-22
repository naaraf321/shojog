"use client";

import React from "react";
import { motion } from "framer-motion";

// Live Exam Leaderboard component with Framer Motion animations
export function LiveExamLeaderboardCard() {
  // Sample leaderboard data
  const leaderboardData = [
    { id: 1, name: "Alex K.", avatar: "A", points: 850, isCurrentUser: false },
    { id: 2, name: "Mia T.", avatar: "M", points: 820, isCurrentUser: true },
    { id: 3, name: "Raj S.", avatar: "R", points: 780, isCurrentUser: false },
  ];

  return (
    <div className="h-full bg-gray-100 dark:bg-zinc-800/50 rounded-lg p-4 overflow-hidden">
      <div className="flex flex-col gap-2">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-xs text-center text-green-600 dark:text-green-400 font-medium py-1 px-2 bg-green-100 dark:bg-green-400/10 rounded-full mb-1">
          Live Now: Physics Final Exam
        </motion.div>

        {leaderboardData.map((user, index) => (
          <motion.div key={user.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: index * 0.15 }} viewport={{ once: true }} className={`flex items-center gap-3 p-2 rounded-lg ${user.isCurrentUser ? "bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20" : "bg-white dark:bg-zinc-800"}`}>
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-700 text-xs font-medium text-gray-700 dark:text-zinc-300">{index + 1}</div>

            <div className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400 dark:bg-zinc-400" : "bg-amber-700"}`}>{user.avatar}</div>
              <span className={`text-sm ${user.isCurrentUser ? "text-yellow-600 dark:text-yellow-400 font-medium" : "text-gray-700 dark:text-zinc-300"}`}>
                {user.name} {user.isCurrentUser && "(You)"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <motion.span initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }} viewport={{ once: true }} className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                {user.points}
              </motion.span>
              <span className="text-xs text-gray-500 dark:text-zinc-500">pts</span>
            </div>
          </motion.div>
        ))}

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} viewport={{ once: true }} className="flex justify-center mt-2">
          <button className="text-xs text-gray-600 hover:text-yellow-600 dark:text-zinc-400 dark:hover:text-yellow-400 transition-colors">View full leaderboard →</button>
        </motion.div>
      </div>
    </div>
  );
}
