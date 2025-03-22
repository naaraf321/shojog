import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

// Mock chapters data
const MOCK_CHAPTERS = [
  { id: 1, name: "Mechanics", topics: 8, questions: 120 },
  { id: 2, name: "Thermodynamics", topics: 6, questions: 90 },
  { id: 3, name: "Optics", topics: 5, questions: 75 },
  { id: 4, name: "Electromagnetism", topics: 7, questions: 105 },
  { id: 5, name: "Modern Physics", topics: 4, questions: 60 },
];

// Mock topics data
const MOCK_TOPICS = {
  1: [
    { id: 101, name: "Kinematics", questions: 25 },
    { id: 102, name: "Newton's Laws", questions: 20 },
    { id: 103, name: "Work & Energy", questions: 18 },
    { id: 104, name: "Rotational Motion", questions: 17 },
    { id: 105, name: "Gravitation", questions: 15 },
    { id: 106, name: "Fluid Mechanics", questions: 10 },
    { id: 107, name: "Simple Harmonic Motion", questions: 8 },
    { id: 108, name: "Waves", questions: 7 },
  ],
  2: [
    { id: 201, name: "Temperature & Heat", questions: 18 },
    { id: 202, name: "First Law of Thermodynamics", questions: 15 },
    { id: 203, name: "Second Law of Thermodynamics", questions: 20 },
    { id: 204, name: "Heat Engines", questions: 12 },
    { id: 205, name: "Kinetic Theory of Gases", questions: 15 },
    { id: 206, name: "Heat Transfer", questions: 10 },
  ],
};

type ChapterTopicFilteringProps = {
  subjectId?: number;
  subjectName?: string;
};

export default function ChapterTopicFiltering({ subjectId = 1, subjectName = "Physics" }: ChapterTopicFilteringProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  // Get chapters for the selected subject
  const chapters = MOCK_CHAPTERS;

  // Get topics for the selected chapter
  const topics = selectedChapter ? MOCK_TOPICS[parseInt(selectedChapter) as keyof typeof MOCK_TOPICS] || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{subjectName}</span>
        <ChevronRight className="h-4 w-4" />
        <span>Select Chapter & Topic</span>
      </div>

      {/* Filter dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          value={selectedChapter}
          onValueChange={(value) => {
            setSelectedChapter(value);
            setSelectedTopic("");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a chapter" />
          </SelectTrigger>
          <SelectContent>
            {chapters.map((chapter) => (
              <SelectItem key={chapter.id} value={chapter.id.toString()}>
                {chapter.name} ({chapter.questions} questions)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTopic} onValueChange={setSelectedTopic} disabled={!selectedChapter}>
          <SelectTrigger>
            <SelectValue placeholder={selectedChapter ? "Select a topic" : "First select a chapter"} />
          </SelectTrigger>
          <SelectContent>
            {topics.map((topic: any) => (
              <SelectItem key={topic.id} value={topic.id.toString()}>
                {topic.name} ({topic.questions} questions)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display chapters if no chapter selected */}
      {!selectedChapter && (
        <div>
          <h3 className="text-lg font-medium mb-4">Available Chapters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} onClick={() => setSelectedChapter(chapter.id.toString())} />
            ))}
          </div>
        </div>
      )}

      {/* Display topics if chapter selected but no topic */}
      {selectedChapter && !selectedTopic && topics.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Topics in {chapters.find((c) => c.id.toString() === selectedChapter)?.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic: any) => (
              <TopicCard key={topic.id} topic={topic} onClick={() => setSelectedTopic(topic.id.toString())} />
            ))}
          </div>
        </div>
      )}

      {/* Call to action when both selected */}
      {selectedChapter && selectedTopic && (
        <div className="flex justify-center mt-8">
          <Button size="lg">View Questions</Button>
        </div>
      )}
    </div>
  );
}

type ChapterCardProps = {
  chapter: {
    id: number;
    name: string;
    topics: number;
    questions: number;
  };
  onClick: () => void;
};

function ChapterCard({ chapter, onClick }: ChapterCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-all" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{chapter.name}</CardTitle>
        <CardDescription>
          {chapter.topics} Topics | {chapter.questions} Questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="ghost" className="w-full justify-between">
          Explore <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

type TopicCardProps = {
  topic: {
    id: number;
    name: string;
    questions: number;
  };
  onClick: () => void;
};

function TopicCard({ topic, onClick }: TopicCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-all" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{topic.name}</CardTitle>
        <CardDescription>{topic.questions} Questions</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="ghost" className="w-full justify-between">
          View Questions <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
