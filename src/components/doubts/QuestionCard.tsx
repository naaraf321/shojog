"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, ChevronRight } from "lucide-react";
import Link from "next/link";

interface QuestionCardProps {
  question: {
    id: string;
    title: string;
    content: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    subject: {
      id: string;
      name: string;
    };
    chapter?: {
      id: string;
      name: string;
    };
    tags: string[];
    createdAt: Date;
    viewCount: number;
    answerCount: number;
  };
}

export function QuestionCard({ question }: QuestionCardProps) {
  // Format the timestamp
  const timeAgo = formatDistanceToNow(new Date(question.createdAt), { addSuffix: true });

  // Truncate content if too long
  const truncatedContent = question.content.length > 150 ? `${question.content.substring(0, 150).replace(/<[^>]*>/g, "")}...` : question.content.replace(/<[^>]*>/g, "");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Link href={`/doubts/${question.id}`} className="block">
        <Card className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold line-clamp-2">{question.title}</h3>
              <div className="flex items-center space-x-3 text-muted-foreground text-sm">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{question.viewCount}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{question.answerCount}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{truncatedContent}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="font-normal">
                {question.subject.name}
              </Badge>

              {question.chapter && (
                <Badge variant="outline" className="font-normal">
                  {question.chapter.name}
                </Badge>
              )}

              {question.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="font-normal">
                  {tag}
                </Badge>
              ))}

              {question.tags.length > 3 && (
                <Badge variant="outline" className="font-normal">
                  +{question.tags.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-0 border-t flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={question.author.avatar} alt={question.author.name} />
                <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">{question.author.name}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{timeAgo}</span>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
