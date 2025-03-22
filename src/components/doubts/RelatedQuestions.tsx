"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RelatedQuestionsProps {
  currentQuestionId: string;
  subjectId: string;
}

interface Question {
  id: string;
  title: string;
  createdAt: any;
  answerCount: number;
  viewCount: number;
}

export function RelatedQuestions({ currentQuestionId, subjectId }: RelatedQuestionsProps) {
  const [relatedQuestions, setRelatedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedQuestions() {
      if (!subjectId) return;

      try {
        setIsLoading(true);

        // Query for questions with the same subject, excluding current question
        const questionsQuery = query(
          collection(db, "questions"),
          where("subject.id", "==", subjectId),
          where("__name__", "!=", currentQuestionId),
          orderBy("__name__"), // Required for != query
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const querySnapshot = await getDocs(questionsQuery);

        const questions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          createdAt: doc.data().createdAt,
          answerCount: doc.data().answerCount || 0,
          viewCount: doc.data().viewCount || 0,
        }));

        setRelatedQuestions(questions);
      } catch (error) {
        console.error("Error fetching related questions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRelatedQuestions();
  }, [currentQuestionId, subjectId]);

  // Don't render the component if there are no related questions
  if (!isLoading && relatedQuestions.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Related Questions</h2>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          // Skeleton for loading state
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {relatedQuestions.map((question) => {
              const timeAgo = formatDistanceToNow(question.createdAt?.toDate ? question.createdAt.toDate() : new Date(question.createdAt), { addSuffix: true });

              return (
                <Link key={question.id} href={`/doubts/${question.id}`} className="block">
                  <div className="group flex justify-between items-start hover:bg-muted/50 p-2 rounded-md -mx-2 transition-colors">
                    <div>
                      <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">{question.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {timeAgo} • {question.answerCount} {question.answerCount === 1 ? "answer" : "answers"} • {question.viewCount} {question.viewCount === 1 ? "view" : "views"}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
