import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookMarked, Filter, Bookmark } from "lucide-react";
import Link from "next/link";

// Mock subjects data
const SUBJECTS = [
  { id: 1, name: "Physics", chapters: 12, questions: 450 },
  { id: 2, name: "Chemistry", chapters: 14, questions: 520 },
  { id: 3, name: "Biology", chapters: 15, questions: 610 },
  { id: 4, name: "Mathematics", chapters: 18, questions: 720 },
  { id: 5, name: "English", chapters: 8, questions: 350 },
  { id: 6, name: "Computer Science", chapters: 10, questions: 400 },
];

// Mock difficulty levels
const DIFFICULTY_LEVELS = ["All", "Easy", "Medium", "Hard"];

export default function SubjectSelectionInterface() {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");

  // Filter subjects based on search query
  const filteredSubjects = SUBJECTS.filter((subject) => subject.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search subjects..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Difficulty" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTY_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs for All/Bookmarked */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full md:w-60">
          <TabsTrigger value="all" className="flex-1">
            All Subjects
          </TabsTrigger>
          <TabsTrigger value="bookmarked" className="flex-1">
            Bookmarked
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {/* Subject Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject) => <SubjectCard key={subject.id} subject={subject} isBookmarked={false} onToggleBookmark={() => {}} />)
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No subjects found. Try a different search term.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bookmarked" className="mt-6">
          <div className="text-center py-10">
            <BookMarked className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your bookmarked subjects will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Subject Card Component
type SubjectCardProps = {
  subject: {
    id: number;
    name: string;
    chapters: number;
    questions: number;
  };
  isBookmarked: boolean;
  onToggleBookmark: () => void;
};

function SubjectCard({ subject, isBookmarked, onToggleBookmark }: SubjectCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{subject.name}</CardTitle>
            <CardDescription>
              {subject.chapters} Chapters | {subject.questions} Questions
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggleBookmark} className="text-muted-foreground hover:text-primary">
            <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Easy</Badge>
          <Badge variant="outline">Medium</Badge>
          <Badge variant="outline">Hard</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/question-bank/subject/${subject.id}`}>Explore</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
