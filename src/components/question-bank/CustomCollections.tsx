'use client'
import React, { useState } from "react";
import { Plus, Folder, MoreHorizontal, Check, X, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { SpacedRepetition } from "./SpacedRepetition";

interface Collection {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  lastUpdated: Date;
  tags: string[];
}

interface Question {
  id: number;
  text: string;
  subject: string;
  chapter: string;
  topic: string;
}

export function CustomCollections() {
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "1",
      name: "Important Physics Concepts",
      description: "Key questions for understanding mechanics",
      questionCount: 24,
      lastUpdated: new Date("2023-03-15"),
      tags: ["physics", "mechanics"],
    },
    {
      id: "2",
      name: "Chemistry Formulas",
      description: "Questions about important chemical formulas",
      questionCount: 18,
      lastUpdated: new Date("2023-03-10"),
      tags: ["chemistry", "formulas"],
    },
  ]);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openAddQuestionsDialog, setOpenAddQuestionsDialog] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showSpacedRepetition, setShowSpacedRepetition] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [newCollectionTags, setNewCollectionTags] = useState("");

  // Mock questions that could be added to collections
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([
    { id: 1, text: "What is Newton's first law of motion?", subject: "Physics", chapter: "Mechanics", topic: "Newton's Laws" },
    { id: 2, text: "Calculate the acceleration of an object with mass 10kg when a force of 50N is applied.", subject: "Physics", chapter: "Mechanics", topic: "Force and Acceleration" },
    { id: 3, text: "What is the chemical formula for glucose?", subject: "Chemistry", chapter: "Organic Chemistry", topic: "Carbohydrates" },
  ]);

  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      toast({
        title: "Collection name is required",
        variant: "destructive",
      });
      return;
    }

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: newCollectionName,
      description: newCollectionDescription,
      questionCount: 0,
      lastUpdated: new Date(),
      tags: newCollectionTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    setCollections([...collections, newCollection]);
    setNewCollectionName("");
    setNewCollectionDescription("");
    setNewCollectionTags("");
    setOpenCreateDialog(false);

    toast({
      title: "Collection created",
      description: `${newCollection.name} has been created successfully`,
    });
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(collections.filter((collection) => collection.id !== id));
    toast({
      title: "Collection deleted",
      description: "The collection has been removed",
    });
  };

  const handleAddQuestionsToCollection = () => {
    if (!selectedCollection) return;

    const updatedCollections = collections.map((collection) => {
      if (collection.id === selectedCollection.id) {
        return {
          ...collection,
          questionCount: collection.questionCount + selectedQuestions.length,
          lastUpdated: new Date(),
        };
      }
      return collection;
    });

    setCollections(updatedCollections);
    setSelectedQuestions([]);
    setOpenAddQuestionsDialog(false);

    toast({
      title: "Questions added",
      description: `${selectedQuestions.length} questions added to ${selectedCollection.name}`,
    });
  };

  const toggleQuestionSelection = (questionId: number) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  // Return to collections list view
  const handleCloseSpacedRepetition = () => {
    setShowSpacedRepetition(false);
    setSelectedCollection(null);
  };

  // Start spaced repetition session for a collection
  const handleStartSpacedRepetition = (collection: Collection) => {
    setSelectedCollection(collection);
    setShowSpacedRepetition(true);
  };

  // Show spaced repetition component if active
  if (showSpacedRepetition && selectedCollection) {
    return <SpacedRepetition collectionId={selectedCollection.id} collectionName={selectedCollection.name} onClose={handleCloseSpacedRepetition} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Collections</h2>
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
              <DialogDescription>Create a personalized collection of questions for focused study.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input id="name" value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} placeholder="e.g., Physics Formulas" />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (optional)
                </label>
                <Input id="description" value={newCollectionDescription} onChange={(e) => setNewCollectionDescription(e.target.value)} placeholder="Brief description of this collection" />
              </div>
              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags (comma separated)
                </label>
                <Input id="tags" value={newCollectionTags} onChange={(e) => setNewCollectionTags(e.target.value)} placeholder="e.g., physics, formulas, important" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCollection}>Create Collection</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id} className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{collection.name}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Dialog
                      open={openAddQuestionsDialog}
                      onOpenChange={(open) => {
                        setOpenAddQuestionsDialog(open);
                        if (open) setSelectedCollection(collection);
                      }}
                    >
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Add Questions</DropdownMenuItem>
                      </DialogTrigger>
                    </Dialog>
                    <DropdownMenuItem>Edit Collection</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteCollection(collection.id)}>
                      Delete Collection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
            </CardHeader>
            <CardContent className="py-3 flex-grow">
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span className="font-medium">{collection.questionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last updated:</span>
                  <span className="font-medium">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(collection.lastUpdated)}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {collection.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-primary/10">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-3 flex flex-col gap-2">
              <Button variant="default" className="w-full flex items-center gap-2" onClick={() => handleStartSpacedRepetition(collection)}>
                <Brain className="h-4 w-4" />
                Start Spaced Repetition
              </Button>
              <Button variant="outline" className="w-full" onClick={() => {}}>
                View Collection
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={openAddQuestionsDialog} onOpenChange={setOpenAddQuestionsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Questions to Collection</DialogTitle>
            <DialogDescription>Select questions to add to &quot;{selectedCollection?.name}&quot;</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <Input placeholder="Search questions..." />
            </div>
            <ScrollArea className="h-[250px] border rounded-md p-2">
              {availableQuestions.map((question) => (
                <div key={question.id} className="flex items-start space-x-3 p-2 border-b border-border last:border-0">
                  <Checkbox id={`question-${question.id}`} checked={selectedQuestions.includes(question.id)} onCheckedChange={() => toggleQuestionSelection(question.id)} />
                  <div>
                    <label htmlFor={`question-${question.id}`} className="text-sm font-medium cursor-pointer">
                      {question.text}
                    </label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {question.subject}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {question.chapter}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {question.topic}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          <DialogFooter className="flex items-center justify-between">
            <div className="text-sm">Selected: {selectedQuestions.length} questions</div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setOpenAddQuestionsDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddQuestionsToCollection} disabled={selectedQuestions.length === 0}>
                Add to Collection
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
