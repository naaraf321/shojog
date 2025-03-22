"use client";

import React from "react";
import { motion } from "framer-motion";

// Question Analysis Graph component with Framer Motion animations
export function QuestionAnalysisCard() {
  // Sample subject performance data
  const subjectData = [
    { subject: "Physics", correct: 75, total: 100 },
    { subject: "Chemistry", correct: 60, total: 100 },
    { subject: "Biology", correct: 85, total: 100 },
    { subject: "Math", correct: 70, total: 100 },
  ];

  // Animation variants for the bars
  const barVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: (i: number) => ({
      width: "100%",
      opacity: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="h-full bg-gray-100 dark:bg-zinc-800/50 rounded-lg p-4 overflow-hidden">
      <div className="flex flex-col gap-3">
        {subjectData.map((item, index) => {
          const percentage = Math.round((item.correct / item.total) * 100);
          let barColor = "bg-red-500";

          if (percentage >= 80) {
            barColor = "bg-green-500";
          } else if (percentage >= 60) {
            barColor = "bg-yellow-500";
          }

          return (
            <motion.div
              key={item.subject}
              custom={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: (i) => ({
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: i * 0.1,
                    duration: 0.4,
                  },
                }),
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">{item.subject}</span>
                <span className="text-xs text-gray-600 dark:text-zinc-400">{percentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <motion.div className={`h-full ${barColor}`} custom={index} variants={barVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ width: `${percentage}%` }} />
              </div>
            </motion.div>
          );
        })}

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} viewport={{ once: true }} className="flex justify-center mt-3">
          <button className="text-xs text-gray-600 hover:text-green-600 dark:text-zinc-400 dark:hover:text-green-400 transition-colors">View detailed performance →</button>
        </motion.div>
      </div>
    </div>
  );
}
