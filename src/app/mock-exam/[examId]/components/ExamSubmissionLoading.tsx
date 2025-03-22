import React from "react";
import { Loader2 } from "lucide-react";

export default function ExamSubmissionLoading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border rounded-lg p-8 max-w-md mx-auto flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl font-bold">Submitting Your Exam</h2>
        <p className="text-muted-foreground">Please wait while we process your answers. This may take a moment.</p>
      </div>
    </div>
  );
}
