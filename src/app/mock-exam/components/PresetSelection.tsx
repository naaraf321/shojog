"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, Clock, FileText } from "lucide-react";

// Mock data for institutions and their exams
const institutions = [
  { id: "buet", name: "BUET" },
  { id: "du", name: "Dhaka University" },
  { id: "medical", name: "Medical College" },
  { id: "ssc", name: "SSC" },
  { id: "hsc", name: "HSC" },
];

const presetExams = {
  buet: [
    {
      id: "buet-2022",
      name: "BUET Admission 2022",
      questionCount: 120,
      duration: 180,
      year: 2022,
      difficulty: "Hard",
    },
    {
      id: "buet-2021",
      name: "BUET Admission 2021",
      questionCount: 110,
      duration: 180,
      year: 2021,
      difficulty: "Hard",
    },
  ],
  du: [
    {
      id: "du-ka-2022",
      name: "DU KA Unit 2022",
      questionCount: 100,
      duration: 120,
      year: 2022,
      difficulty: "Medium",
    },
    {
      id: "du-kha-2022",
      name: "DU KHA Unit 2022",
      questionCount: 100,
      duration: 120,
      year: 2022,
      difficulty: "Medium",
    },
    {
      id: "du-ga-2022",
      name: "DU GA Unit 2022",
      questionCount: 100,
      duration: 120,
      year: 2022,
      difficulty: "Medium",
    },
  ],
  medical: [
    {
      id: "medical-2022",
      name: "Medical Admission 2022",
      questionCount: 200,
      duration: 240,
      year: 2022,
      difficulty: "Hard",
    },
    {
      id: "medical-2021",
      name: "Medical Admission 2021",
      questionCount: 200,
      duration: 240,
      year: 2021,
      difficulty: "Hard",
    },
  ],
  ssc: [
    {
      id: "ssc-science-2022",
      name: "SSC Science 2022",
      questionCount: 100,
      duration: 180,
      year: 2022,
      difficulty: "Easy",
    },
    {
      id: "ssc-business-2022",
      name: "SSC Business 2022",
      questionCount: 100,
      duration: 180,
      year: 2022,
      difficulty: "Easy",
    },
  ],
  hsc: [
    {
      id: "hsc-science-2022",
      name: "HSC Science 2022",
      questionCount: 120,
      duration: 180,
      year: 2022,
      difficulty: "Medium",
    },
    {
      id: "hsc-business-2022",
      name: "HSC Business 2022",
      questionCount: 120,
      duration: 180,
      year: 2022,
      difficulty: "Medium",
    },
  ],
};

type DifficultyBadgeProps = {
  difficulty: string;
};

const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  const color = difficulty === "Easy" ? "bg-green-500/10 text-green-500" : difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500";

  return <Badge className={color}>{difficulty}</Badge>;
};

export default function PresetSelection() {
  const [selectedInstitution, setSelectedInstitution] = useState("buet");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {institutions.map((institution) => (
          <Button key={institution.id} variant={selectedInstitution === institution.id ? "default" : "outline"} onClick={() => setSelectedInstitution(institution.id)} className="transition-all">
            {institution.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presetExams[selectedInstitution as keyof typeof presetExams].map((exam) => (
          <motion.div key={exam.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="h-full overflow-hidden border-border/40 hover:border-border transition-all">
              <CardHeader>
                <CardTitle>{exam.name}</CardTitle>
                <CardDescription>Institution preset exam</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{institutions.find((i) => i.id === selectedInstitution)?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{exam.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{exam.questionCount} Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{exam.duration} Minutes</span>
                </div>
                <DifficultyBadge difficulty={exam.difficulty} />
              </CardContent>
              <CardFooter>
                <Link href={`/mock-exam/${exam.id}`} className="w-full">
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
