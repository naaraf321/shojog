import React from "react";
import { motion } from "framer-motion";

interface Option {
  id: string;
  text: string;
}

interface AnswerSelectionProps {
  options: Option[];
  selectedOption: string;
  onSelect: (optionId: string) => void;
}

export default function AnswerSelection({ options, selectedOption, onSelect }: AnswerSelectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-md font-medium mb-3">Select an answer:</h3>

      <div className="space-y-2">
        {options.map((option) => (
          <motion.div key={option.id} className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedOption === option.id ? "border-primary bg-primary/5 ring-2 ring-primary/10" : "hover:border-primary/50 hover:bg-primary/5"}`} onClick={() => onSelect(option.id)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <div className="flex items-start gap-3">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full border text-sm font-medium mt-0.5 ${selectedOption === option.id ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 text-muted-foreground"}`}>{option.id.toUpperCase()}</div>

              <div className="flex-1">
                <p className={`${selectedOption === option.id ? "text-foreground font-medium" : "text-muted-foreground"}`}>{option.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
