"use client";

import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { QuestionsList } from "@/components/doubts/QuestionsList";

export default function DoubtsPage() {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Doubt Forum</h1>
        <Link href="/doubts/ask">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Ask a Question
          </Button>
        </Link>
      </div>

      {/* Questions list component */}
      <QuestionsList />
    </AuthenticatedLayout>
  );
}
