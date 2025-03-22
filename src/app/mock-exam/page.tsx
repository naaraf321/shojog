import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import SubjectSelection from "./components/SubjectSelection";
import PresetSelection from "./components/PresetSelection";

export const metadata: Metadata = {
  title: "Mock Exam | ShudhuMCQ",
  description: "Take subject-based or preset mock exams and enhance your preparation",
};

export default function MockExamPage() {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Mock Exams</h1>
      <p className="text-muted-foreground mb-8">Select a mock exam to test your knowledge and enhance your preparation. Choose from subject-based exams or presets based on institutions.</p>

      <Tabs defaultValue="subjects" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="subjects">Subject-based</TabsTrigger>
          <TabsTrigger value="presets">Institution Presets</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="mt-4">
          <SubjectSelection />
        </TabsContent>

        <TabsContent value="presets" className="mt-4">
          <PresetSelection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
