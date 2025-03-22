"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for subjects, chapters, and topics
// In a real implementation, this would come from an API
const mockSubjects = [
  { id: 1, name: "Physics" },
  { id: 2, name: "Chemistry" },
  { id: 3, name: "Mathematics" },
  { id: 4, name: "Biology" },
];

const mockChapters = {
  1: [
    // Physics chapters
    { id: 101, name: "Mechanics" },
    { id: 102, name: "Thermodynamics" },
    { id: 103, name: "Electromagnetism" },
    { id: 104, name: "Modern Physics" },
  ],
  2: [
    // Chemistry chapters
    { id: 201, name: "Organic Chemistry" },
    { id: 202, name: "Inorganic Chemistry" },
    { id: 203, name: "Physical Chemistry" },
  ],
  3: [
    // Mathematics chapters
    { id: 301, name: "Algebra" },
    { id: 302, name: "Calculus" },
    { id: 303, name: "Geometry" },
    { id: 304, name: "Statistics" },
  ],
  4: [
    // Biology chapters
    { id: 401, name: "Cell Biology" },
    { id: 402, name: "Genetics" },
    { id: 403, name: "Human Physiology" },
    { id: 404, name: "Ecology" },
  ],
};

const mockTopics = {
  101: [
    // Mechanics topics
    { id: 1001, name: "Newton's Laws" },
    { id: 1002, name: "Kinematics" },
    { id: 1003, name: "Dynamics" },
  ],
  102: [
    // Thermodynamics topics
    { id: 1021, name: "Laws of Thermodynamics" },
    { id: 1022, name: "Heat Transfer" },
  ],
  // Add more topics for other chapters as needed
  201: [
    // Organic Chemistry topics
    { id: 2001, name: "Hydrocarbons" },
    { id: 2002, name: "Alcohols and Ethers" },
  ],
  // And so on for other chapters
};

interface FilterSystemProps {
  onFiltersApplied: (filters: { subject: string; chapter: string; topic: string }) => void;
}

export default function FilterSystem({ onFiltersApplied }: FilterSystemProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const [availableChapters, setAvailableChapters] = useState<any[]>([]);
  const [availableTopics, setAvailableTopics] = useState<any[]>([]);

  // Update available chapters when subject changes
  useEffect(() => {
    if (selectedSubject) {
      const subjectId = parseInt(selectedSubject);
      setAvailableChapters(mockChapters[subjectId as keyof typeof mockChapters] || []);
      // Reset chapter and topic when subject changes
      setSelectedChapter("");
      setSelectedTopic("");
      setAvailableTopics([]);
    } else {
      setAvailableChapters([]);
    }
  }, [selectedSubject]);

  // Update available topics when chapter changes
  useEffect(() => {
    if (selectedChapter) {
      const chapterId = parseInt(selectedChapter);
      setAvailableTopics(mockTopics[chapterId as keyof typeof mockTopics] || []);
      // Reset topic when chapter changes
      setSelectedTopic("");
    } else {
      setAvailableTopics([]);
    }
  }, [selectedChapter]);

  const handleApplyFilters = () => {
    // Get the names instead of IDs for better readability
    const subjectName = mockSubjects.find((s) => s.id.toString() === selectedSubject)?.name || "";

    let chapterName = "";
    if (selectedSubject && selectedChapter) {
      const chapters = mockChapters[parseInt(selectedSubject) as keyof typeof mockChapters] || [];
      chapterName = chapters.find((c) => c.id.toString() === selectedChapter)?.name || "";
    }

    let topicName = "";
    if (selectedChapter && selectedTopic) {
      const topics = mockTopics[parseInt(selectedChapter) as keyof typeof mockTopics] || [];
      topicName = topics.find((t) => t.id.toString() === selectedTopic)?.name || "";
    }

    onFiltersApplied({
      subject: subjectName,
      chapter: chapterName,
      topic: topicName,
    });
  };

  const handleResetFilters = () => {
    setSelectedSubject("");
    setSelectedChapter("");
    setSelectedTopic("");
    setAvailableChapters([]);
    setAvailableTopics([]);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Subject Dropdown */}
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium">
            Subject
          </label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger id="subject">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {mockSubjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chapter Dropdown */}
        <div className="space-y-2">
          <label htmlFor="chapter" className="text-sm font-medium">
            Chapter
          </label>
          <Select value={selectedChapter} onValueChange={setSelectedChapter} disabled={!selectedSubject}>
            <SelectTrigger id="chapter">
              <SelectValue placeholder={selectedSubject ? "Select Chapter" : "Select Subject First"} />
            </SelectTrigger>
            <SelectContent>
              {availableChapters.map((chapter) => (
                <SelectItem key={chapter.id} value={chapter.id.toString()}>
                  {chapter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Topic Dropdown */}
        <div className="space-y-2">
          <label htmlFor="topic" className="text-sm font-medium">
            Topic
          </label>
          <Select value={selectedTopic} onValueChange={setSelectedTopic} disabled={!selectedChapter}>
            <SelectTrigger id="topic">
              <SelectValue placeholder={selectedChapter ? "Select Topic" : "Select Chapter First"} />
            </SelectTrigger>
            <SelectContent>
              {availableTopics.map((topic) => (
                <SelectItem key={topic.id} value={topic.id.toString()}>
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={handleResetFilters}>
          Reset Filters
        </Button>
        <Button onClick={handleApplyFilters} disabled={!selectedSubject}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
