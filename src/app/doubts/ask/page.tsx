"use client";

import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { AskQuestionForm } from "@/components/doubts/AskQuestionForm";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AskQuestionPage() {
  const { user, loading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      redirect("/auth/signin");
    }
  }, [user, loading]);

  // Show loading state
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
        <h1 className="text-3xl font-bold mt-4">Ask a Question</h1>
        <p className="text-muted-foreground mt-1">Get help from the community by asking a clear, detailed question</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AskQuestionForm />
      </div>
    </AuthenticatedLayout>
  );
}
