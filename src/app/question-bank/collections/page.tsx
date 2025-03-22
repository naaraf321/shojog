import React from "react";
import { CustomCollections } from "@/components/question-bank/CustomCollections";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Collections | ShudhuMCQ",
  description: "Create and manage your personalized collections of questions for focused study.",
};

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Custom Collections</h1>
      <CustomCollections />
    </div>
  );
}
