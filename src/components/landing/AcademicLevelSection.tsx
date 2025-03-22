"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight, School, GraduationCap, Building, FileText } from "lucide-react";
import { LucideIcon } from "lucide-react";

// Academic level types
type AcademicLevel = "school" | "highSchool" | "college" | "admission";

// Define interface for academic level data
interface AcademicLevelData {
  title: string;
  description: string;
  features: string[];
  color: string;
  buttonColor: string;
  icon: LucideIcon;
}

// Content data for each academic level
const academicLevelData: Record<AcademicLevel, AcademicLevelData> = {
  school: {
    title: "School",
    description: "Perfect for students in classes 6-10 preparing for school exams and competitions.",
    features: ["Subject-based MCQs", "School curriculum aligned", "Age-appropriate content"],
    color: "from-blue-500/20 to-indigo-500/20",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    icon: School,
  },
  highSchool: {
    title: "High School",
    description: "Designed for students in classes 11-12 focusing on board exams and fundamentals.",
    features: ["Board exam preparation", "Chapter-wise questions", "Performance tracking"],
    color: "from-emerald-500/20 to-green-500/20",
    buttonColor: "bg-emerald-600 hover:bg-emerald-700",
    icon: GraduationCap,
  },
  college: {
    title: "College",
    description: "Comprehensive question bank for university students across various disciplines.",
    features: ["Subject specializations", "University exam patterns", "Advanced concepts"],
    color: "from-violet-500/20 to-purple-500/20",
    buttonColor: "bg-violet-600 hover:bg-violet-700",
    icon: Building,
  },
  admission: {
    title: "Admission",
    description: "Targeted practice for competitive entrance exams for universities and institutions.",
    features: ["Entrance exam patterns", "Time-based mock tests", "Previous year questions"],
    color: "from-amber-500/20 to-orange-500/20",
    buttonColor: "bg-amber-600 hover:bg-amber-700",
    icon: FileText,
  },
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export function AcademicLevelSection() {
  // State for selected academic level
  const [selectedLevel, setSelectedLevel] = useState<AcademicLevel>("school");

  // Get icon component for current level
  const IconComponent = academicLevelData[selectedLevel].icon;

  return (
    <section className="w-full py-20 bg-gradient-to-b from-background to-black/5 dark:from-background dark:to-white/5">
      <div className="container px-4 mx-auto">
        <motion.div className="flex flex-col items-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">Choose Your Academic Level</h2>
          <p className="text-muted-foreground text-center max-w-2xl">Specialized question banks and mock tests tailored to your educational stage</p>
        </motion.div>

        {/* Level selection tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 relative">
          {(Object.keys(academicLevelData) as AcademicLevel[]).map((level, index) => (
            <motion.button key={level} onClick={() => setSelectedLevel(level)} className={cn("px-6 py-3 rounded-full font-medium relative overflow-hidden", "transition-colors duration-300 ease-in-out", "shadow-sm", selectedLevel === level ? "text-primary-foreground" : "bg-card hover:bg-card/80 dark:bg-card/80 dark:hover:bg-card/60")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {selectedLevel === level && <motion.div className="absolute inset-0 bg-primary" layoutId="selectedTab" initial={{ borderRadius: 9999 }} animate={{ borderRadius: 9999 }} transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
              <span className="relative z-10">{academicLevelData[level].title}</span>
            </motion.button>
          ))}
        </div>

        {/* Content cards */}
        <AnimatePresence mode="wait">
          <motion.div key={selectedLevel} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className={cn("max-w-5xl mx-auto bg-card border rounded-xl p-8 shadow-xl", "relative overflow-hidden")}>
            {/* Background gradient */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20", academicLevelData[selectedLevel].color)}></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row gap-8">
              <div className="flex items-center justify-center md:w-1/3">
                <div className="w-32 h-32 flex items-center justify-center bg-primary/10 rounded-full shadow-inner border border-primary/20">
                  <IconComponent size={64} className="text-primary" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-3">{academicLevelData[selectedLevel].title}</h3>
                <p className="text-muted-foreground mb-6">{academicLevelData[selectedLevel].description}</p>
                <div className="space-y-3">
                  {academicLevelData[selectedLevel].features.map((feature, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm md:text-base">{feature}</span>
                    </motion.div>
                  ))}
                </div>
                <motion.button className={cn("mt-8 px-6 py-2.5 text-white rounded-lg font-medium transition flex items-center gap-2", academicLevelData[selectedLevel].buttonColor)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  Explore {academicLevelData[selectedLevel].title}
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Feature badges */}
        <motion.div className="flex flex-wrap justify-center gap-4 mt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          {["5000+ Questions", "Interactive UI", "Personalized Learning", "Expert-Crafted Content"].map((badge, index) => (
            <div key={index} className="px-4 py-2 bg-card/80 border rounded-full text-sm font-medium">
              {badge}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
