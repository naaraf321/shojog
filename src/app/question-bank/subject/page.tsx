import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SubjectSelectionInterface from "@/components/question-bank/SubjectSelectionInterface";
import ChapterTopicFiltering from "@/components/question-bank/ChapterTopicFiltering";

export default function SubjectQuestionBankPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/question-bank">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Subject-based Question Bank</h1>
      </div>

      <SubjectSelectionInterface />
    </div>
  );
}
