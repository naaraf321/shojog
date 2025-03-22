import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, FileText, FileImage, FileBadge } from "lucide-react";
import { toast } from "sonner";

// Export format options
const EXPORT_FORMATS = [
  { id: "pdf", label: "PDF", icon: FileText },
  { id: "docx", label: "Word (.docx)", icon: FileText },
  { id: "excel", label: "Excel (.xlsx)", icon: FileText },
  { id: "csv", label: "CSV", icon: FileText },
  { id: "json", label: "JSON", icon: FileBadge },
  { id: "png", label: "PNG Images", icon: FileImage },
];

// Export options type
type ExportOptions = {
  includeAnswers: boolean;
  includeExplanations: boolean;
  includeDifficulty: boolean;
  includeMetadata: boolean;
  format: string;
  questions: any[]; // This would be replaced with your actual Question type
};

interface QuestionExportProps {
  questions: any[]; // Replace with your actual Question type
  isOpen: boolean;
  onClose: () => void;
}

export default function QuestionExport({ questions, isOpen, onClose }: QuestionExportProps) {
  // Default export options
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeAnswers: true,
    includeExplanations: true,
    includeDifficulty: true,
    includeMetadata: false,
    format: "pdf",
    questions: questions,
  });

  // Handle export format change
  const handleFormatChange = (format: string) => {
    setExportOptions({ ...exportOptions, format });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (key: keyof ExportOptions) => {
    setExportOptions({
      ...exportOptions,
      [key]: !exportOptions[key as keyof ExportOptions],
    });
  };

  // Handle export action
  const handleExport = async () => {
    try {
      // Show loading toast
      toast.loading("Preparing your export...");

      // In a real implementation, we would call an API endpoint to generate the export
      // Example:
      // const response = await fetch('/api/question-bank/export', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(exportOptions),
      // });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success toast
      toast.dismiss();
      toast.success(`${questions.length} questions exported successfully!`);

      // Close dialog
      onClose();
    } catch (error) {
      toast.dismiss();
      toast.error("Export failed. Please try again.");
      console.error("Export error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Questions</DialogTitle>
          <DialogDescription>Export {questions.length} selected questions in your preferred format.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Export Format</label>
            <Select value={exportOptions.format} onValueChange={handleFormatChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {EXPORT_FORMATS.map((format) => (
                  <SelectItem key={format.id} value={format.id}>
                    <div className="flex items-center">
                      <format.icon className="mr-2 h-4 w-4" />
                      <span>{format.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="export-options">
              <AccordionTrigger className="text-sm font-medium">Export Options</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="includeAnswers" checked={exportOptions.includeAnswers} onCheckedChange={() => handleCheckboxChange("includeAnswers")} />
                    <label htmlFor="includeAnswers" className="text-sm">
                      Include Answers
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="includeExplanations" checked={exportOptions.includeExplanations} onCheckedChange={() => handleCheckboxChange("includeExplanations")} />
                    <label htmlFor="includeExplanations" className="text-sm">
                      Include Explanations
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="includeDifficulty" checked={exportOptions.includeDifficulty} onCheckedChange={() => handleCheckboxChange("includeDifficulty")} />
                    <label htmlFor="includeDifficulty" className="text-sm">
                      Include Difficulty Levels
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="includeMetadata" checked={exportOptions.includeMetadata} onCheckedChange={() => handleCheckboxChange("includeMetadata")} />
                    <label htmlFor="includeMetadata" className="text-sm">
                      Include Metadata (tags, source)
                    </label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
