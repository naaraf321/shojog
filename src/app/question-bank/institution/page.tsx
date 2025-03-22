import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function InstitutionQuestionBankPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/question-bank">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Institution-based Question Bank</h1>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <p className="text-muted-foreground mb-4">This section is coming soon. It will allow you to browse questions organized by institutions, exam types, and years.</p>
        <Button asChild>
          <Link href="/question-bank/subject">Browse by Subject Instead</Link>
        </Button>
      </div>
    </div>
  );
}
