"use client";

import React from "react";
import { motion } from "framer-motion";

// Question Bank Card component with Framer Motion animations
export function QuestionBankCard() {
  // Sample question data
  const questions = [
    { id: 1, text: "Which organelle is known as the powerhouse of the cell?", subject: "Biology" },
    { id: 2, text: "What is the formula for calculating acceleration?", subject: "Physics" },
    { id: 3, text: "What is the value of π (pi) to two decimal places?", subject: "Mathematics" },
  ];

  // Animation variants for the questions
  const questionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };

  // Animation variants for the progress bar
  const progressVariants = {
    hidden: { width: "0%" },
    visible: (i: number) => ({
      width: "100%",
      transition: {
        delay: 0.5 + i * 0.2,
        duration: 0.8,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="h-full bg-gray-100 dark:bg-zinc-800/50 rounded-lg p-4 overflow-hidden">
      <div className="flex flex-col gap-3">
        {questions.map((question, index) => (
          <motion.div key={question.id} custom={index} variants={questionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 transition-all">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300">{question.subject}</span>
              <span className="text-xs text-gray-500 dark:text-zinc-500">Q{index + 1}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-zinc-300">{question.text}</p>

            <div className="w-full h-1 mt-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600" custom={index} variants={progressVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
            </div>
          </motion.div>
        ))}

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.5 }} viewport={{ once: true }} className="flex justify-center mt-2">
          <button className="text-xs text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">View 10,000+ more questions →</button>
        </motion.div>
      </div>
    </div>
  );
}
