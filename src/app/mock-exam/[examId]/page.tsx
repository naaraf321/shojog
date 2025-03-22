import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExamInterface from "./components/ExamInterface";

export const metadata: Metadata = {
  title: "Mock Exam | ShudhuMCQ",
  description: "Take mock exams and test your knowledge",
};

export default function ExamPage({ params }: { params: { examId: string } }) {
  // This is a placeholder - in real app, fetch exam details from API
  const { examId } = params;

  // In a real implementation, you would:
  // 1. Fetch exam details based on examId
  // 2. If exam not found, return notFound()
  // 3. Display actual exam details

  // Placeholder for now
  if (!examId) {
    return notFound();
  }

  return (
    <div className="container py-6">
      <div className="mb-8">
        <Link href="/mock-exam">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Mock Exams
          </Button>
        </Link>
      </div>

      {/* Exam Interface */}
      <ExamInterface examId={examId} />
    </div>
  );
}
