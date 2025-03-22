"use client";

import React from "react";
import FilterSystem from "./FilterSystem";
import QuestionInterface from "./QuestionInterface";
import FavoriteQuestions from "./FavoriteQuestions";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

// Define interfaces for our data
interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export default function QuickPracticeContainer() {
  // Will contain questions and the practice interface once filters are applied
  const [questionsLoaded, setQuestionsLoaded] = React.useState(false);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [viewingFavorites, setViewingFavorites] = React.useState(false);

  const handleFiltersApplied = (filters: { subject: string; chapter: string; topic: string }) => {
    console.log("Filters applied:", filters);
    // TODO: Fetch questions based on filters
    // For now, let's simulate loading questions
    // In a real implementation, this would fetch from an API
    setTimeout(() => {
      setQuestions([
        {
          id: 1,
          text: "What is the formula for kinetic energy?",
          options: ["E = mc²", "KE = ½mv²", "F = ma", "P = mv"],
          correctAnswer: 1,
          explanation: "Kinetic energy (KE) is the energy possessed by a body due to its motion. The formula is KE = ½mv², where m is mass and v is velocity.",
        },
        {
          id: 2,
          text: "Which of Newton's laws states that for every action, there is an equal and opposite reaction?",
          options: ["First Law", "Second Law", "Third Law", "Fourth Law"],
          correctAnswer: 2,
          explanation: "Newton's Third Law of Motion states that for every action, there is an equal and opposite reaction.",
        },
        {
          id: 3,
          text: "Which of the following is a vector quantity?",
          options: ["Mass", "Time", "Temperature", "Velocity"],
          correctAnswer: 3,
          explanation: "Velocity is a vector quantity because it has both magnitude (speed) and direction.",
        },
        {
          id: 4,
          text: "What is the SI unit of electric current?",
          options: ["Volt", "Watt", "Ampere", "Ohm"],
          correctAnswer: 2,
          explanation: "The SI unit of electric current is the ampere (A), named after André-Marie Ampère.",
        },
        {
          id: 5,
          text: "Which of the following is NOT a state of matter?",
          options: ["Solid", "Liquid", "Gas", "Energy"],
          correctAnswer: 3,
          explanation: "Energy is not a state of matter. The common states of matter are solid, liquid, gas, and plasma (the fourth state).",
        },
      ]);
      setQuestionsLoaded(true);
    }, 1000);
  };

  const handlePracticeComplete = () => {
    // Reset for new practice session
    setQuestionsLoaded(false);
    setQuestions([]);
  };

  const toggleFavoriteView = () => {
    setViewingFavorites(!viewingFavorites);
  };

  const renderContent = () => {
    if (viewingFavorites) {
      return <FavoriteQuestions questions={questions} onBack={() => setViewingFavorites(false)} />;
    }

    if (!questionsLoaded) {
      return (
        <div className="bg-card rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Select Filters</h2>
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={toggleFavoriteView}>
              <Bookmark className="h-4 w-4" />
              <span>View Favorites</span>
            </Button>
          </div>
          <FilterSystem onFiltersApplied={handleFiltersApplied} />
        </div>
      );
    }

    return (
      <div className="bg-card rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Practice Questions</h2>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={toggleFavoriteView}>
            <Bookmark className="h-4 w-4" />
            <span>View Favorites</span>
          </Button>
        </div>
        <QuestionInterface questions={questions} onComplete={handlePracticeComplete} />
      </div>
    );
  };

  return <div className="space-y-6">{renderContent()}</div>;
}
