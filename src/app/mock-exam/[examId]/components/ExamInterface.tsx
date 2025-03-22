"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionDisplay from "./QuestionDisplay";
import AnswerSelection from "./AnswerSelection";
import QuestionNavigation from "./QuestionNavigation";
import ExamTimer from "./ExamTimer";
import ProgressIndicator from "./ProgressIndicator";
import ExamSubmissionDialog from "./ExamSubmissionDialog";
import ExamSubmissionLoading from "./ExamSubmissionLoading";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock exam data - In real app, this would come from an API
const mockExamData = {
  id: "mock-1",
  title: "Physics Mock Exam",
  duration: 60, // in minutes
  questions: [
    {
      id: 1,
      text: "Which of the following is a vector quantity?",
      options: [
        { id: "a", text: "Mass" },
        { id: "b", text: "Velocity" },
        { id: "c", text: "Temperature" },
        { id: "d", text: "Energy" },
      ],
      correctAnswer: "b",
    },
    {
      id: 2,
      text: "What is the SI unit of electric current?",
      options: [
        { id: "a", text: "Volt" },
        { id: "b", text: "Watt" },
        { id: "c", text: "Ampere" },
        { id: "d", text: "Coulomb" },
      ],
      correctAnswer: "c",
    },
    {
      id: 3,
      text: "Which law states that the pressure of a gas is inversely proportional to its volume at constant temperature?",
      options: [
        { id: "a", text: "Boyle's Law" },
        { id: "b", text: "Charles's Law" },
        { id: "c", text: "Gay-Lussac's Law" },
        { id: "d", text: "Avogadro's Law" },
      ],
      correctAnswer: "a",
    },
    {
      id: 4,
      text: "Which phenomenon is responsible for the blue color of the sky?",
      options: [
        { id: "a", text: "Dispersion" },
        { id: "b", text: "Diffraction" },
        { id: "c", text: "Rayleigh Scattering" },
        { id: "d", text: "Refraction" },
      ],
      correctAnswer: "c",
    },
    {
      id: 5,
      text: "What is the equivalent resistance of two 4Ω resistors connected in parallel?",
      options: [
        { id: "a", text: "8Ω" },
        { id: "b", text: "4Ω" },
        { id: "c", text: "2Ω" },
        { id: "d", text: "1Ω" },
      ],
      correctAnswer: "c",
    },
  ],
};

interface ExamInterfaceProps {
  examId: string;
}

export default function ExamInterface({ examId }: ExamInterfaceProps) {
  // In a real app, fetch exam data based on examId
  const examData = mockExamData;
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(examData.duration * 60); // in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  const currentQuestion = examData.questions[currentQuestionIndex];

  // Handle answer selection
  const handleSelectAnswer = (questionId: number, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Go to specific question
  const handleGoToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setIsMobileNavOpen(false);
  };

  // Toggle mark for review
  const handleToggleReview = (questionId: number) => {
    setMarkedForReview((prev) => (prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]));
  };

  // Open submission dialog
  const openSubmitDialog = () => {
    setIsSubmitDialogOpen(true);
  };

  // Close submission dialog
  const closeSubmitDialog = () => {
    setIsSubmitDialogOpen(false);
  };

  // Handle exam submission
  const handleSubmitExam = () => {
    setIsSubmitDialogOpen(false);
    setIsSubmitting(true);

    // Save exam progress to localStorage for recovery
    try {
      localStorage.setItem(`exam_${examId}_answers`, JSON.stringify(answers));
      localStorage.setItem(`exam_${examId}_markedForReview`, JSON.stringify(markedForReview));
    } catch (error) {
      console.error("Error saving exam progress:", error);
    }

    // In a real app, submit answers to API
    // This is a mock implementation
    setTimeout(() => {
      setExamSubmitted(true);
      setIsSubmitting(false);

      // Show success toast
      toast({
        title: "Exam Submitted Successfully",
        description: "Your exam has been submitted. Redirecting to results...",
        variant: "default",
      });

      // Redirect to results page after a short delay
      setTimeout(() => {
        router.push(`/mock-exam/${examId}/results`);
      }, 1500);
    }, 2500);
  };

  // Get question status
  const getQuestionStatus = (questionId: number, index: number) => {
    if (markedForReview.includes(questionId)) {
      return "review";
    }
    if (answers[questionId]) {
      return "answered";
    }
    return "unanswered";
  };

  // Calculate progress percentage
  const progressPercentage = (Object.keys(answers).length / examData.questions.length) * 100;

  // Auto-submit when time expires
  useEffect(() => {
    if (timeLeft <= 0 && !examSubmitted && !isSubmitting) {
      openSubmitDialog();
    }
  }, [timeLeft, examSubmitted, isSubmitting]);

  // Load saved progress on component mount
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem(`exam_${examId}_answers`);
      const savedMarkedForReview = localStorage.getItem(`exam_${examId}_markedForReview`);

      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }

      if (savedMarkedForReview) {
        setMarkedForReview(JSON.parse(savedMarkedForReview));
      }
    } catch (error) {
      console.error("Error loading saved progress:", error);
    }
  }, [examId]);

  // Save progress periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (!examSubmitted && !isSubmitting) {
        try {
          localStorage.setItem(`exam_${examId}_answers`, JSON.stringify(answers));
          localStorage.setItem(`exam_${examId}_markedForReview`, JSON.stringify(markedForReview));
        } catch (error) {
          console.error("Error auto-saving exam progress:", error);
        }
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [answers, markedForReview, examId, examSubmitted, isSubmitting]);

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[80vh] gap-4">
      {/* Mobile navigation toggle */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <Button variant="outline" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
          {isMobileNavOpen ? "Hide Questions" : "Show All Questions"}
        </Button>
        <ExamTimer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
      </div>

      {/* Question navigation sidebar */}
      <div className={`${isMobileNavOpen ? "block" : "hidden"} lg:block lg:w-1/4 h-full`}>
        <QuestionNavigation questions={examData.questions} currentIndex={currentQuestionIndex} onSelect={handleGoToQuestion} statuses={examData.questions.map((q, i) => getQuestionStatus(q.id, i))} markedForReview={markedForReview} />
      </div>

      {/* Main exam content */}
      <div className="flex-1">
        <div className="hidden lg:flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{examData.title}</h1>
          <ExamTimer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
        </div>

        <div className="mb-4">
          <ProgressIndicator answered={Object.keys(answers).length} total={examData.questions.length} percentage={progressPercentage} />
        </div>

        {/* Question and answers */}
        <div className="bg-card border rounded-lg p-6 mb-4">
          <QuestionDisplay question={currentQuestion} questionNumber={currentQuestionIndex + 1} totalQuestions={examData.questions.length} />

          <div className="mt-6">
            <AnswerSelection options={currentQuestion.options} selectedOption={answers[currentQuestion.id] || ""} onSelect={(optionId) => handleSelectAnswer(currentQuestion.id, optionId)} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handlePrevQuestion()} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>

            <Button variant="outline" onClick={() => handleNextQuestion()} disabled={currentQuestionIndex === examData.questions.length - 1}>
              Next
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleToggleReview(currentQuestion.id)} className={`${markedForReview.includes(currentQuestion.id) ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-500" : ""}`}>
              {markedForReview.includes(currentQuestion.id) ? "Marked for Review" : "Mark for Review"}
            </Button>

            <Button onClick={openSubmitDialog} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? "Submitting..." : "Submit Exam"}
            </Button>
          </div>
        </div>

        {/* Stats for mobile view */}
        <div className="mt-4 lg:hidden">
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>
                Answered: {Object.keys(answers).length}/{examData.questions.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span>Marked: {markedForReview.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Unanswered: {examData.questions.length - Object.keys(answers).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exam submission dialog */}
      <ExamSubmissionDialog isOpen={isSubmitDialogOpen} onClose={closeSubmitDialog} onConfirm={handleSubmitExam} isSubmitting={isSubmitting} answeredCount={Object.keys(answers).length} totalQuestions={examData.questions.length} reviewCount={markedForReview.length} />

      {/* Loading overlay when submitting */}
      {isSubmitting && <ExamSubmissionLoading />}
    </div>
  );
}
