"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { QuestionDetail } from "@/components/doubts/QuestionDetail";
import { AnswerSection } from "@/components/doubts/AnswerSection";
import { RelatedQuestions } from "@/components/doubts/RelatedQuestions";

export default function QuestionDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const questionId = params.questionId as string;
  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch question data
  useEffect(() => {
    async function fetchQuestionData() {
      if (!questionId) return;

      try {
        setIsLoading(true);
        const questionRef = doc(db, "questions", questionId);
        const questionSnap = await getDoc(questionRef);

        if (questionSnap.exists()) {
          // Update view count
          await updateDoc(questionRef, {
            viewCount: increment(1),
          });

          // Set question data
          setQuestion({
            id: questionSnap.id,
            ...questionSnap.data(),
          });
        } else {
          setError("Question not found");
          console.error("No such question exists!");
        }
      } catch (err) {
        console.error("Error fetching question:", err);
        setError("Failed to load question. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    if (!loading) {
      fetchQuestionData();
    }
  }, [questionId, loading]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      redirect("/auth/signin");
    }
  }, [user, loading]);

  // Show loading state for initial auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="mb-6">
        <Link href="/doubts">
          <Button variant="ghost" className="gap-1 p-0">
            <ChevronLeft className="h-4 w-4" />
            Back to Questions
          </Button>
        </Link>

        {isLoading ? (
          <div className="animate-pulse mt-4">
            <div className="h-8 w-3/4 bg-muted rounded"></div>
            <div className="h-4 w-1/2 bg-muted rounded mt-2"></div>
          </div>
        ) : error ? (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold text-red-500">{error}</h2>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/doubts")}>
              Return to Questions
            </Button>
          </div>
        ) : question ? (
          <div className="space-y-8">
            {/* Question Detail Component */}
            <QuestionDetail question={question} />

            {/* Answer Section Component */}
            <AnswerSection questionId={questionId} />

            {/* Related Questions Component */}
            <RelatedQuestions currentQuestionId={questionId} subjectId={question.subject?.id} />
          </div>
        ) : null}
      </div>
    </AuthenticatedLayout>
  );
}
