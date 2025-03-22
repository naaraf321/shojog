import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type DifficultyFilteringProps = {
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
};

export default function DifficultyFiltering({ selectedDifficulty, onDifficultyChange }: DifficultyFilteringProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Difficulty Level</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedDifficulty} onValueChange={onDifficultyChange} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="font-normal cursor-pointer">
                All Levels
              </Label>
            </div>
            <Badge variant="outline" className="ml-auto">
              All
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="easy" id="easy" />
              <Label htmlFor="easy" className="font-normal cursor-pointer">
                Easy
              </Label>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 ml-auto">
              Easy
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="font-normal cursor-pointer">
                Medium
              </Label>
            </div>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 ml-auto">
              Medium
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard" className="font-normal cursor-pointer">
                Hard
              </Label>
            </div>
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 ml-auto">
              Hard
            </Badge>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
