import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Trophy, BarChart3, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Exam Results | ShudhuMCQ",
  description: "View your exam results and performance analysis",
};

// Mock exam result data - In a real app, this would come from an API
const mockExamResult = {
  id: "mock-1",
  title: "Physics Mock Exam",
  score: 75,
  timeSpent: "42 minutes",
  totalQuestions: 5,
  correctAnswers: 3,
  wrongAnswers: 1,
  skippedAnswers: 1,
  points: 120,
  questionsData: [
    {
      id: 1,
      text: "Which of the following is a vector quantity?",
      correctAnswer: "b",
      userAnswer: "b",
      isCorrect: true,
      explanation: "Velocity is a vector quantity as it has both magnitude and direction.",
    },
    {
      id: 2,
      text: "What is the SI unit of electric current?",
      correctAnswer: "c",
      userAnswer: "c",
      isCorrect: true,
      explanation: "The SI unit of electric current is the Ampere (A).",
    },
    {
      id: 3,
      text: "Which law states that the pressure of a gas is inversely proportional to its volume at constant temperature?",
      correctAnswer: "a",
      userAnswer: "b",
      isCorrect: false,
      explanation: "Boyle's Law states that pressure and volume are inversely proportional at constant temperature.",
    },
    {
      id: 4,
      text: "Which phenomenon is responsible for the blue color of the sky?",
      correctAnswer: "c",
      userAnswer: "c",
      isCorrect: true,
      explanation: "Rayleigh scattering causes the blue color of the sky by scattering shorter wavelengths (blue) more than longer wavelengths.",
    },
    {
      id: 5,
      text: "What is the equivalent resistance of two 4Ω resistors connected in parallel?",
      correctAnswer: "c",
      userAnswer: null,
      isCorrect: false,
      explanation: "For resistors in parallel, the equivalent resistance is (R1×R2)/(R1+R2). For two 4Ω resistors, this gives 2Ω.",
    },
  ],
};

export default function ExamResultsPage({ params }: { params: { examId: string } }) {
  const { examId } = params;

  // In a real app, fetch the results data using the examId
  const resultData = mockExamResult;

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

      <div className="grid gap-6">
        {/* Results Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{resultData.title} Results</CardTitle>
            <CardDescription>Completed on {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Score Card */}
              <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-6 flex-1">
                <div className="text-6xl font-bold text-primary mb-2">{resultData.score}%</div>
                <div className="text-sm text-muted-foreground">Your Score</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="flex flex-col items-center p-4 bg-card border rounded-lg">
                  <div className="mb-2">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold">{resultData.points}</div>
                  <div className="text-xs text-muted-foreground">Points Earned</div>
                </div>

                <div className="flex flex-col items-center p-4 bg-card border rounded-lg">
                  <div className="mb-2">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold">{resultData.timeSpent}</div>
                  <div className="text-xs text-muted-foreground">Time Spent</div>
                </div>

                <div className="flex flex-col items-center p-4 bg-card border rounded-lg">
                  <div className="mb-2 text-green-500 font-bold text-xl">
                    {resultData.correctAnswers}/{resultData.totalQuestions}
                  </div>
                  <div className="text-xs text-muted-foreground">Correct Answers</div>
                </div>

                <div className="flex flex-col items-center p-4 bg-card border rounded-lg">
                  <div className="mb-2 text-red-500 font-bold text-xl">
                    {resultData.wrongAnswers}/{resultData.totalQuestions}
                  </div>
                  <div className="text-xs text-muted-foreground">Wrong Answers</div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" size="sm" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              View Detailed Analysis
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Results
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share your results with friends</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>

        {/* Question Analysis */}
        <div>
          <h2 className="text-xl font-bold mb-4">Question Analysis</h2>

          <div className="space-y-4">
            {resultData.questionsData.map((question, index) => (
              <Card key={question.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium">Question {index + 1}</CardTitle>
                    <div className={`px-2 py-1 rounded text-xs ${question.isCorrect ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>{question.isCorrect ? "Correct" : question.userAnswer === null ? "Skipped" : "Incorrect"}</div>
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <p className="mb-4">{question.text}</p>

                  <div className="space-y-2 mb-4">
                    <div className="text-sm">
                      <span className="font-semibold">Your Answer:</span> {question.userAnswer ? `Option ${question.userAnswer.toUpperCase()}` : "Not answered"}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Correct Answer:</span> Option {question.correctAnswer.toUpperCase()}
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-md text-sm">
                    <div className="font-semibold mb-1">Explanation:</div>
                    <p>{question.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations for Improvement</CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="rounded-full h-5 w-5 bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs mt-0.5">1</div>
                <p>Review the concept of gas laws, especially Boyle&apos;s Law and Charles&apos;s Law.</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full h-5 w-5 bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs mt-0.5">2</div>
                <p>Practice more questions on resistors in parallel and series combinations.</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full h-5 w-5 bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs mt-0.5">3</div>
                <p>Consider reviewing the practice questions on vector quantities in our question bank.</p>
              </li>
            </ul>
          </CardContent>

          <CardFooter className="border-t pt-4">
            <div className="w-full flex flex-col sm:flex-row gap-2 justify-between">
              <Button className="w-full sm:w-auto">Review Similar Questions</Button>
              <Button variant="outline" className="w-full sm:w-auto">
                Take Another Exam
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
