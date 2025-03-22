"use client";

import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { QuestionCard } from "./QuestionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, startAfter, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

// Type for a question
interface Question {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  subject: {
    id: string;
    name: string;
  };
  chapter?: {
    id: string;
    name: string;
  };
  tags: string[];
  createdAt: Date;
  viewCount: number;
  answerCount: number;
}

// Type for a page of questions
interface QuestionsPage {
  questions: Question[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined;
}

// Sort options
type SortOption = "recent" | "popular" | "unanswered";

async function fetchQuestions(pageParam: QueryDocumentSnapshot<DocumentData> | null, sortBy: SortOption = "recent", filterSubject: string | null = null): Promise<QuestionsPage> {
  try {
    const pageSize = 10;
    let questionsQuery;

    // Base query
    if (sortBy === "recent") {
      questionsQuery = query(collection(db, "questions"), orderBy("createdAt", "desc"), limit(pageSize));
    } else if (sortBy === "popular") {
      questionsQuery = query(collection(db, "questions"), orderBy("viewCount", "desc"), limit(pageSize));
    } else if (sortBy === "unanswered") {
      questionsQuery = query(collection(db, "questions"), orderBy("answerCount", "asc"), orderBy("createdAt", "desc"), limit(pageSize));
    }

    // If we have a pageParam (for pagination), start after that document
    if (pageParam) {
      questionsQuery = query(questionsQuery!, startAfter(pageParam), limit(pageSize));
    }

    const querySnapshot = await getDocs(questionsQuery!);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    // Convert Firestore documents to our Question type
    const questions = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Question;
    });

    // Apply subject filter in memory (not ideal, but simpler than complex queries)
    const filteredQuestions = filterSubject ? questions.filter((q) => q.subject.id === filterSubject) : questions;

    return {
      questions: filteredQuestions,
      lastVisible,
    };
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

export function QuestionsList() {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterSubject, setFilterSubject] = useState<string | null>(null);
  const { ref, inView } = useInView();

  // Use React Query for data fetching with infinite scrolling
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery<QuestionsPage, Error>({
    queryKey: ["questions", sortBy, filterSubject],
    queryFn: ({ pageParam }) => fetchQuestions(pageParam as QueryDocumentSnapshot<DocumentData> | null, sortBy, filterSubject),
    initialPageParam: null as QueryDocumentSnapshot<DocumentData> | null,
    getNextPageParam: (lastPage) => lastPage.lastVisible || undefined,
    enabled: true,
  });

  // Load more questions when the last item comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Flatten all pages of questions into a single array
  const questions = data?.pages.flatMap((page) => page.questions) || [];

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  // Handle filter change
  const handleSubjectFilterChange = (value: string) => {
    setFilterSubject(value === "all" ? null : value);
  };

  // Skeleton loader for questions
  const QuestionSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>

          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
        </div>

        <Select defaultValue={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Viewed</SelectItem>
            <SelectItem value="unanswered">Unanswered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <QuestionSkeleton />
            </div>
          ))
        ) : isError ? (
          // Error state
          <div className="text-center py-10 border rounded-lg">
            <p className="text-muted-foreground mb-4">Error loading questions. Please try again.</p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        ) : questions.length === 0 ? (
          // Empty state
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No questions found. Be the first to ask a question!</p>
          </div>
        ) : (
          // Questions
          <>
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}

            {/* Load more trigger element */}
            <div ref={ref} className="h-10 flex justify-center">
              {isFetchingNextPage && <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
