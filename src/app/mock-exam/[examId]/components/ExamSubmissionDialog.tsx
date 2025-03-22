import React from "react";
import { AlertTriangle, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExamSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  answeredCount: number;
  totalQuestions: number;
  reviewCount: number;
}

export default function ExamSubmissionDialog({ isOpen, onClose, onConfirm, isSubmitting, answeredCount, totalQuestions, reviewCount }: ExamSubmissionDialogProps) {
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Exam</DialogTitle>
          <DialogDescription>Are you sure you want to submit your exam? This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>
                <strong>Answered:</strong> {answeredCount} of {totalQuestions} questions
              </span>
            </div>

            {unansweredCount > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span>
                  <strong>Unanswered:</strong> {unansweredCount} of {totalQuestions} questions
                </span>
              </div>
            )}

            {reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span>
                  <strong>Marked for review:</strong> {reviewCount} questions
                </span>
              </div>
            )}
          </div>

          {unansweredCount > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-md p-3 text-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <span>You have {unansweredCount} unanswered questions. You will not receive points for questions you haven&apos;t answered.</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              "Confirm Submission"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
