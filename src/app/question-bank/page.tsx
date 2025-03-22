import React from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function QuestionBankPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Question Bank</h1>
        <div className="mt-4 md:mt-0">
          <Tabs defaultValue="subject" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="subject" asChild>
                <Link href="/question-bank/subject">By Subject</Link>
              </TabsTrigger>
              <TabsTrigger value="institution" asChild>
                <Link href="/question-bank/institution">By Institution</Link>
              </TabsTrigger>
              <TabsTrigger value="collections" asChild>
                <Link href="/question-bank/collections">My Collections</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">Subject-based Organization</h2>
          <p className="text-muted-foreground mb-4">Browse questions organized by subjects, chapters, and topics. Filter by difficulty level and search for specific concepts.</p>
          <Button asChild className="w-full mt-4">
            <Link href="/question-bank/subject">Browse by Subject</Link>
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">Institution-based Organization</h2>
          <p className="text-muted-foreground mb-4">Access questions from specific institutions, organized by exam types and years. Search within institutional questions.</p>
          <Button asChild className="w-full mt-4">
            <Link href="/question-bank/institution">Browse by Institution</Link>
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">Custom Collections</h2>
          <p className="text-muted-foreground mb-4">Create and manage your personalized collections of questions for focused study. Group questions by topic or your own criteria.</p>
          <Button asChild className="w-full mt-4">
            <Link href="/question-bank/collections">View My Collections</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
