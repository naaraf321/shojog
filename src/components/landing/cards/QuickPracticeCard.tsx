"use client";

import React from "react";
import { motion } from "framer-motion";

// Quick Practice Card component with Framer Motion animations
export function QuickPracticeCard() {
  // Sample practice session topics
  const topics = [
    { id: 1, name: "Cell Biology", questionCount: 20, duration: "10 min", difficulty: "Easy" },
    { id: 2, name: "Quantum Physics", questionCount: 15, duration: "15 min", difficulty: "Hard" },
    { id: 3, name: "Calculus", questionCount: 25, duration: "20 min", difficulty: "Medium" },
  ];

  // Animation variants for the practice sessions
  const sessionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  // Animation variants for the difficulty indicator
  const difficultyColorMap = {
    Easy: "bg-green-500",
    Medium: "bg-yellow-500",
    Hard: "bg-red-500",
  };

  return (
    <div className="h-full bg-gray-100 dark:bg-zinc-800/50 rounded-lg p-4 overflow-hidden">
      <div className="flex flex-col gap-3">
        {topics.map((topic, index) => (
          <motion.div key={topic.id} custom={index} variants={sessionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-purple-500 transition-all group">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{topic.name}</span>
              <div className="flex items-center gap-1">
                <span className={`h-2 w-2 rounded-full ${difficultyColorMap[topic.difficulty as keyof typeof difficultyColorMap]}`}></span>
                <span className="text-xs text-gray-500 dark:text-zinc-500">{topic.difficulty}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-2 text-xs text-gray-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <span>{topic.questionCount} questions</span>
                <span>•</span>
                <span>{topic.duration}</span>
              </div>
              <motion.button className="px-2 py-1 rounded bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-purple-600 hover:text-white transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Start
              </motion.button>
            </div>
          </motion.div>
        ))}

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} viewport={{ once: true }} className="flex justify-center mt-2">
          <button className="text-xs text-gray-600 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 transition-colors">Explore all practice sessions →</button>
        </motion.div>
      </div>
    </div>
  );
}
