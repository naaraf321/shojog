import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Printer, Settings, Eye, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

interface PrintFriendlyViewProps {
  questions: any[]; // Replace with your actual Question type
  isOpen: boolean;
  onClose: () => void;
}

export default function PrintFriendlyView({ questions, isOpen, onClose }: PrintFriendlyViewProps) {
  const printFrameRef = useRef<HTMLIFrameElement>(null);
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [printSettings, setPrintSettings] = useState({
    showAnswers: true,
    showExplanations: true,
    showDifficulty: true,
    pageTitle: "ShudhuMCQ Question Bank",
    pageSize: "a4",
    fontSize: "medium",
    lineSpacing: "1.5",
    questionsPerPage: 0, // 0 means no limit
  });

  // Handle settings change
  const updateSetting = (key: string, value: any) => {
    setPrintSettings({
      ...printSettings,
      [key]: value,
    });
  };

  // Generate print-friendly HTML
  const generatePrintHTML = () => {
    const { showAnswers, showExplanations, showDifficulty, pageTitle, fontSize, lineSpacing } = printSettings;

    // Initialize the HTML string with basic styles
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${pageTitle}</title>
        <style>
          @media print {
            @page {
              size: ${printSettings.pageSize};
              margin: 1.5cm;
            }
          }
          body {
            font-family: Arial, sans-serif;
            font-size: ${fontSize === "small" ? "14px" : fontSize === "large" ? "18px" : "16px"};
            line-height: ${lineSpacing};
            color: #333;
          }
          .question-container {
            margin-bottom: 1.5rem;
            page-break-inside: avoid;
            border-bottom: 1px solid #eee;
            padding-bottom: 1rem;
          }
          .question {
            font-weight: bold;
            margin-bottom: 0.5rem;
          }
          .options {
            margin-left: 1.5rem;
            margin-bottom: 0.5rem;
          }
          .option {
            margin-bottom: 0.3rem;
          }
          .correct {
            color: #22c55e;
            font-weight: bold;
          }
          .explanation {
            margin-top: 0.5rem;
            padding: 0.5rem;
            background-color: #f9f9f9;
            border-left: 3px solid #ddd;
            font-style: italic;
          }
          .difficulty {
            font-size: 0.8rem;
            color: #666;
            margin-top: 0.3rem;
          }
          .page-title {
            text-align: center;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            font-weight: bold;
          }
          .page-footer {
            text-align: center;
            font-size: 0.8rem;
            margin-top: 2rem;
            color: #666;
          }
          @media print {
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="page-title">${pageTitle}</div>
    `;

    // Add each question to the HTML
    questions.forEach((question, index) => {
      // In a real implementation, this would use the actual question properties
      // This is a mockup assuming a structure
      htmlContent += `
        <div class="question-container">
          <div class="question">${index + 1}. ${question.text || `Mock Question ${index + 1}`}</div>
          <div class="options">
      `;

      // Add mock options (in a real app, these would come from the question object)
      const mockOptions = ["Option A", "Option B", "Option C", "Option D"];
      const correctIndex = Math.floor(Math.random() * 4); // Mock correct answer

      mockOptions.forEach((option, optIndex) => {
        const isCorrect = optIndex === correctIndex;
        const optionClass = showAnswers && isCorrect ? "option correct" : "option";
        htmlContent += `<div class="${optionClass}">${String.fromCharCode(65 + optIndex)}. ${option}</div>`;
      });

      htmlContent += `</div>`;

      // Add explanation if enabled
      if (showExplanations) {
        htmlContent += `
          <div class="explanation">
            <strong>Explanation:</strong> ${question.explanation || "Sample explanation for this question."}
          </div>
        `;
      }

      // Add difficulty if enabled
      if (showDifficulty) {
        const difficultyLevel = question.difficulty || ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)];
        htmlContent += `<div class="difficulty">Difficulty: ${difficultyLevel}</div>`;
      }

      htmlContent += `</div>`;
    });

    // Close the HTML
    htmlContent += `
        <div class="page-footer">
          Generated from ShudhuMCQ - ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `;

    return htmlContent;
  };

  // Handle print action
  const handlePrint = () => {
    if (printFrameRef.current) {
      // Write content to iframe
      const frameDoc = printFrameRef.current.contentDocument;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(generatePrintHTML());
        frameDoc.close();

        // Delay printing slightly to ensure content is loaded
        setTimeout(() => {
          try {
            printFrameRef.current?.contentWindow?.print();
            toast.success("Print dialog opened!");
          } catch (error) {
            toast.error("Failed to open print dialog");
            console.error(error);
          }
        }, 500);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Print-Friendly View</DialogTitle>
          <DialogDescription>Customize and print {questions.length} questions.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 overflow-auto mt-4 border rounded-md p-4">
            <iframe ref={printFrameRef} className="w-full h-full border-0" srcDoc={generatePrintHTML()} title="Print Preview" />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 overflow-y-auto mt-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-3">Document Settings</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <label className="text-sm">Page Title</label>
                  <Input value={printSettings.pageTitle} onChange={(e) => updateSetting("pageTitle", e.target.value)} placeholder="Enter page title" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm">Page Size</label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={printSettings.pageSize} onChange={(e) => updateSetting("pageSize", e.target.value)}>
                      <option value="a4">A4</option>
                      <option value="letter">Letter</option>
                      <option value="legal">Legal</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm">Font Size</label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={printSettings.fontSize} onChange={(e) => updateSetting("fontSize", e.target.value)}>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm">Line Spacing</label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={printSettings.lineSpacing} onChange={(e) => updateSetting("lineSpacing", e.target.value)}>
                    <option value="1">Single</option>
                    <option value="1.5">1.5 Lines</option>
                    <option value="2">Double</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-medium mb-3">Content Settings</h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="showAnswers" checked={printSettings.showAnswers} onCheckedChange={(checked) => updateSetting("showAnswers", checked)} />
                  <label htmlFor="showAnswers" className="text-sm">
                    Show Correct Answers
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="showExplanations" checked={printSettings.showExplanations} onCheckedChange={(checked) => updateSetting("showExplanations", checked)} />
                  <label htmlFor="showExplanations" className="text-sm">
                    Include Explanations
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="showDifficulty" checked={printSettings.showDifficulty} onCheckedChange={(checked) => updateSetting("showDifficulty", checked)} />
                  <label htmlFor="showDifficulty" className="text-sm">
                    Show Difficulty Level
                  </label>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setActiveTab(activeTab === "preview" ? "settings" : "preview")} className="flex items-center gap-1">
            <ArrowLeftRight className="h-4 w-4" />
            {activeTab === "preview" ? "Settings" : "Preview"}
          </Button>

          <Button onClick={handlePrint} className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
