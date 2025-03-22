"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, FileText } from "lucide-react";

// Mock data for subject categories and subjects
const subjectCategories = [
  { id: "science", name: "Science" },
  { id: "humanities", name: "Humanities" },
  { id: "commerce", name: "Commerce" },
  { id: "languages", name: "Languages" },
];

const subjects = {
  science: [
    { id: "physics", name: "Physics", questionCount: 50, duration: 60, difficulty: "Medium" },
    { id: "chemistry", name: "Chemistry", questionCount: 45, duration: 55, difficulty: "Hard" },
    { id: "biology", name: "Biology", questionCount: 40, duration: 50, difficulty: "Easy" },
    { id: "mathematics", name: "Mathematics", questionCount: 30, duration: 90, difficulty: "Hard" },
  ],
  humanities: [
    { id: "history", name: "History", questionCount: 35, duration: 45, difficulty: "Medium" },
    { id: "geography", name: "Geography", questionCount: 30, duration: 40, difficulty: "Easy" },
    { id: "civics", name: "Civics", questionCount: 25, duration: 35, difficulty: "Medium" },
  ],
  commerce: [
    { id: "economics", name: "Economics", questionCount: 40, duration: 50, difficulty: "Medium" },
    { id: "accounts", name: "Accounts", questionCount: 35, duration: 60, difficulty: "Hard" },
    { id: "business", name: "Business Studies", questionCount: 30, duration: 45, difficulty: "Medium" },
  ],
  languages: [
    { id: "english", name: "English", questionCount: 45, duration: 60, difficulty: "Medium" },
    { id: "bengali", name: "Bengali", questionCount: 40, duration: 55, difficulty: "Easy" },
  ],
};

type DifficultyBadgeProps = {
  difficulty: string;
};

const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  const color = difficulty === "Easy" ? "bg-green-500/10 text-green-500" : difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500";

  return <Badge className={color}>{difficulty}</Badge>;
};

export default function SubjectSelection() {
  const [selectedCategory, setSelectedCategory] = useState("science");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {subjectCategories.map((category) => (
          <Button key={category.id} variant={selectedCategory === category.id ? "default" : "outline"} onClick={() => setSelectedCategory(category.id)} className="transition-all">
            {category.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {subjects[selectedCategory as keyof typeof subjects].map((subject) => (
          <motion.div key={subject.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="h-full overflow-hidden border-border/40 hover:border-border transition-all">
              <CardHeader>
                <CardTitle>{subject.name}</CardTitle>
                <CardDescription>Subject-based exam</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{subject.questionCount} Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{subject.duration} Minutes</span>
                </div>
                <DifficultyBadge difficulty={subject.difficulty} />
              </CardContent>
              <CardFooter>
                <Link href={`/mock-exam/${subject.id}`} className="w-full">
                  <Button className="w-full group">
                    Start Exam
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
