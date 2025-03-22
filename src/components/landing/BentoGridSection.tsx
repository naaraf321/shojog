"use client";

import React from "react";
import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { Database, LineChart, Trophy, Zap } from "lucide-react";
import { QuickPracticeCard } from "./cards/QuickPracticeCard";
import { QuestionBankCard } from "./cards/QuestionBankCard";
import { QuestionAnalysisCard } from "./cards/QuestionAnalysisCard";
import { LiveExamLeaderboardCard } from "./cards/LiveExamLeaderboardCard";

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export function BentoGridSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-zinc-100 mb-4">Everything You Need to Excel</h2>
          <p className="text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">Our comprehensive tools and features are designed to enhance your learning experience and maximize your exam preparation efficiency.</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full max-w-7xl">
          <BentoGrid>
            {/* Question Bank Card */}
            <BentoGridItem title="Extensive Question Bank" description="Access thousands of curated MCQs organized by subjects, topics, and institutions." icon={<Database className="w-5 h-5 text-blue-500" />} colSpan={2} rowSpan={2} header={<QuestionBankCard />} />

            {/* Question Analysis Graph card */}
            <BentoGridItem title="Question Analysis Graph" description="Visualize your performance across subjects and identify improvement areas." icon={<LineChart className="w-5 h-5 text-green-500" />} header={<QuestionAnalysisCard />} />

            {/* Live Exam Leaderboard card */}
            <BentoGridItem title="Live Exam Leaderboard" description="Compete with peers and track your ranking in real-time during exams." icon={<Trophy className="w-5 h-5 text-yellow-500" />} header={<LiveExamLeaderboardCard />} />

            {/* Quick Practice card */}
            <BentoGridItem title="Quick Practice Sessions" description="Short, focused practice sessions tailored to your needs and schedule." icon={<Zap className="w-5 h-5 text-purple-500" />} colSpan={2} header={<QuickPracticeCard />} />
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}
