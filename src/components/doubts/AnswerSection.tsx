"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowUpCircle, ArrowDownCircle, MessageSquare, CheckCircle2, ChevronDown, ChevronUp, Send, Flag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, orderBy, getDocs, doc, getDoc, updateDoc, increment, serverTimestamp, deleteDoc, writeBatch } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import "react-quill/dist/quill.snow.css";
import { searchUsersByName } from "@/lib/userService";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full border rounded-md flex items-center justify-center">Loading editor...</div>,
});

const quillModules = {
  toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image", "code-block"], ["clean"]],
};

const quillFormats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "link", "image", "code-block"];

interface Comment {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: any;
  mentions?: {
    id: string;
    name: string;
  }[];
}

interface Answer {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: any;
  upvotes: number;
  downvotes: number;
  isBestAnswer: boolean;
  comments: Comment[];
  questionId?: string;
}

interface AnswerSectionProps {
  questionId: string;
}

// Report Dialog Component for Answers
interface ReportDialogProps {
  contentId: string;
  contentType: "answer" | "comment";
  contentTitle?: string;
}

// Report reasons
const reportReasons = [
  { id: "spam", label: "Spam" },
  { id: "inappropriate", label: "Inappropriate content" },
  { id: "harassment", label: "Harassment" },
  { id: "misinformation", label: "Misinformation" },
  { id: "off-topic", label: "Off-topic" },
  { id: "other", label: "Other" },
];

function ReportDialog({ contentId, contentType, contentTitle }: ReportDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle report submission
  const handleSubmitReport = async () => {
    if (!user) {
      toast.error("You must be signed in to report content");
      return;
    }

    if (!reason) {
      toast.error("Please select a reason for your report");
      return;
    }

    setIsSubmitting(true);

    try {
      // Add report to Firestore
      await addDoc(collection(db, "reports"), {
        contentType,
        contentId,
        contentTitle: contentTitle || null,
        reason,
        details: details.trim() || null,
        reportedBy: {
          id: user.uid,
          name: user.displayName || "Anonymous",
          email: user.email,
        },
        status: "pending", // pending, reviewed, rejected, actioned
        createdAt: serverTimestamp(),
      });

      toast.success("Report submitted successfully. Thank you for helping keep our community safe.");
      setOpen(false);
      setReason(null);
      setDetails("");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Flag className="h-4 w-4" />
          <span className="sr-only">Report</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report {contentType === "answer" ? "Answer" : "Comment"}</DialogTitle>
          <DialogDescription>Report this {contentType} for inappropriate content or other issues. Our moderators will review it.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={reason || ""} onValueChange={setReason}>
            {reportReasons.map((reportReason) => (
              <div key={reportReason.id} className="flex items-center space-x-2">
                <RadioGroupItem value={reportReason.id} id={`${contentType}-${contentId}-${reportReason.id}`} />
                <Label htmlFor={`${contentType}-${contentId}-${reportReason.id}`}>{reportReason.label}</Label>
              </div>
            ))}
          </RadioGroup>

          <div className="grid gap-2">
            <Label htmlFor={`${contentType}-${contentId}-details`}>Additional details (optional)</Label>
            <Textarea id={`${contentType}-${contentId}-details`} placeholder="Please provide any additional information that might help us understand the issue" value={details} onChange={(e) => setDetails(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmitReport} disabled={isSubmitting || !reason} className="flex gap-2">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AnswerSection({ questionId }: AnswerSectionProps) {
  const { user } = useAuth();
  const { createNotification } = useNotifications();
  const [answerContent, setAnswerContent] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [isQuillMounted, setIsQuillMounted] = useState(false);
  const [questionAuthorId, setQuestionAuthorId] = useState<string | null>(null);
  const [questionTitle, setQuestionTitle] = useState<string>("");
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionResults, setMentionResults] = useState<{ id: string; name: string; avatar?: string }[]>([]);
  const [mentionIndex, setMentionIndex] = useState(-1);
  const [activeMentionAnswerId, setActiveMentionAnswerId] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const commentRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  // Fix for React Quill in Next.js
  useEffect(() => {
    setIsQuillMounted(true);
  }, []);

  // Fetch question author for best answer functionality
  useEffect(() => {
    async function fetchQuestionAuthor() {
      try {
        const questionRef = doc(db, "questions", questionId);
        const questionSnap = await getDoc(questionRef);

        if (questionSnap.exists()) {
          const questionData = questionSnap.data();
          setQuestionAuthorId(questionData.authorId);
          setQuestionTitle(questionData.title || "");
        }
      } catch (error) {
        console.error("Error fetching question author:", error);
      }
    }

    fetchQuestionAuthor();
  }, [questionId]);

  // Fetch answers
  useEffect(() => {
    async function fetchAnswers() {
      try {
        setIsLoading(true);

        // Get answers for this question
        const answersQuery = query(collection(db, "answers"), where("questionId", "==", questionId), orderBy("isBestAnswer", "desc"), orderBy("upvotes", "desc"));

        const answersSnapshot = await getDocs(answersQuery);

        // Process each answer
        const answersData: Answer[] = [];

        for (const answerDoc of answersSnapshot.docs) {
          const answerData = answerDoc.data();

          // Get comments for this answer
          const commentsQuery = query(collection(db, "comments"), where("answerId", "==", answerDoc.id), orderBy("createdAt", "asc"));

          const commentsSnapshot = await getDocs(commentsQuery);

          const comments: Comment[] = commentsSnapshot.docs.map((commentDoc) => ({
            id: commentDoc.id,
            text: commentDoc.data().text,
            author: commentDoc.data().author,
            createdAt: commentDoc.data().createdAt,
          }));

          answersData.push({
            id: answerDoc.id,
            content: answerData.content,
            author: answerData.author,
            createdAt: answerData.createdAt,
            upvotes: answerData.upvotes || 0,
            downvotes: answerData.downvotes || 0,
            isBestAnswer: answerData.isBestAnswer || false,
            comments: comments,
            questionId,
          });
        }

        // Sort answers: best answer first, then by upvotes
        const sortedAnswers = answersData.sort((a, b) => {
          if (a.isBestAnswer && !b.isBestAnswer) return -1;
          if (!a.isBestAnswer && b.isBestAnswer) return 1;
          return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
        });

        setAnswers(sortedAnswers);
      } catch (err) {
        console.error("Error fetching answers:", err);
        setError("Failed to load answers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnswers();
  }, [questionId]);

  // Submit a new answer
  const handleSubmitAnswer = async () => {
    if (!user) {
      toast.error("You must be signed in to answer");
      return;
    }

    if (!answerContent.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const answerData = {
        questionId,
        content: answerContent,
        author: {
          id: user.uid,
          name: user.displayName || "Anonymous",
          avatar: user.photoURL || undefined,
        },
        createdAt: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
        isBestAnswer: false,
      };

      // Add answer to Firestore
      const answerRef = await addDoc(collection(db, "answers"), answerData);

      // Update question answer count
      const questionRef = doc(db, "questions", questionId);
      await updateDoc(questionRef, {
        answerCount: increment(1),
      });

      // Create notification for question author
      if (questionAuthorId && questionAuthorId !== user.uid) {
        try {
          await createNotification({
            userId: questionAuthorId,
            type: "answer",
            text: `You received a new answer on your question "${questionTitle.substring(0, 60)}${questionTitle.length > 60 ? "..." : ""}"`,
            relatedId: questionId,
            triggeredBy: {
              id: user.uid,
              name: user.displayName || "Anonymous",
              avatar: user.photoURL || undefined,
            },
          });
        } catch (notificationError) {
          console.error("Error creating notification:", notificationError);
          // Don't fail the entire operation if notification fails
        }
      }

      // Add to local state with type assertion
      const newAnswer: Answer = {
        id: answerRef.id,
        content: answerContent,
        author: {
          id: user.uid,
          name: user.displayName || "Anonymous",
          avatar: user.photoURL || undefined,
        },
        createdAt: new Date(),
        upvotes: 0,
        downvotes: 0,
        isBestAnswer: false,
        comments: [],
        questionId,
      };

      setAnswers([...answers, newAnswer]);

      // Clear input
      setAnswerContent("");

      toast.success("Your answer has been posted!");
    } catch (error) {
      console.error("Error posting answer:", error);
      toast.error("Failed to post your answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle comment section visibility
  const toggleComments = (answerId: string) => {
    setExpandedComments((prev) => (prev.includes(answerId) ? prev.filter((id) => id !== answerId) : [...prev, answerId]));
  };

  // Check for @mention in comment text
  const checkForMention = (text: string, answerId: string) => {
    const lastAtSymbolIndex = text.lastIndexOf("@");

    if (lastAtSymbolIndex !== -1) {
      // Check if there's a space between the @ and the cursor position
      const textAfterAt = text.substring(lastAtSymbolIndex + 1);
      const hasSpaceAfterQuery = /\s/.test(textAfterAt);

      if (!hasSpaceAfterQuery) {
        const query = textAfterAt;
        setMentionQuery(query);
        setActiveMentionAnswerId(answerId);
        return true;
      }
    }

    // Reset mention state if no @ is found or if it's completed
    if (mentionQuery !== null) {
      setMentionQuery(null);
      setMentionResults([]);
      setMentionIndex(-1);
      setActiveMentionAnswerId(null);
    }

    return false;
  };

  // Fetch users for mention
  useEffect(() => {
    const fetchUsers = async () => {
      if (mentionQuery !== null && mentionQuery.length >= 2) {
        const users = await searchUsersByName(mentionQuery);
        setMentionResults(users);
        // Reset the selected index when results change
        setMentionIndex(users.length > 0 ? 0 : -1);
      } else {
        setMentionResults([]);
        setMentionIndex(-1);
      }
    };

    fetchUsers();
  }, [mentionQuery]);

  // Handle keyboard navigation for mentions
  const handleMentionKeyDown = (e: React.KeyboardEvent, answerId: string) => {
    if (!mentionResults.length || activeMentionAnswerId !== answerId) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setMentionIndex((prev) => (prev + 1) % mentionResults.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setMentionIndex((prev) => (prev - 1 + mentionResults.length) % mentionResults.length);
        break;
      case "Enter":
      case "Tab":
        if (mentionIndex >= 0) {
          e.preventDefault();
          insertMention(answerId, mentionResults[mentionIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setMentionQuery(null);
        setMentionResults([]);
        setActiveMentionAnswerId(null);
        break;
    }
  };

  // Insert mention into comment text
  const insertMention = (answerId: string, user: { id: string; name: string }) => {
    const text = commentText[answerId] || "";
    const lastAtIndex = text.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const newText = text.substring(0, lastAtIndex) + `@${user.name} `;
      setCommentText((prev) => ({ ...prev, [answerId]: newText }));

      // Reset mention state
      setMentionQuery(null);
      setMentionResults([]);
      setMentionIndex(-1);
      setActiveMentionAnswerId(null);

      // Focus the textarea and set cursor position after the inserted mention
      setTimeout(() => {
        if (commentRefs.current[answerId]) {
          const textarea = commentRefs.current[answerId];
          textarea?.focus();
          const position = newText.length;
          textarea?.setSelectionRange(position, position);
        }
      }, 0);
    }
  };

  // Parse mentions from comment text
  const parseMentions = (text: string): { text: string; mentions: { id: string; name: string }[] } => {
    const mentionRegex = /@([a-zA-Z0-9_\s]+)/g;
    const mentions: { id: string; name: string }[] = [];
    let match;

    // Find all mentions
    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionName = match[1].trim();
      mentions.push({
        id: "", // We'll need to look up the ID
        name: mentionName,
      });
    }

    return { text, mentions };
  };

  // Handle comment submission with mentions
  const handleSubmitComment = async (answerId: string) => {
    if (!user) {
      toast.error("You must be signed in to comment");
      return;
    }

    const text = commentText[answerId];
    if (!text || !text.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      // Parse mentions from the comment
      const { text: commentText, mentions } = parseMentions(text.trim());

      // Look up user IDs for mentioned names
      const enrichedMentions = await Promise.all(
        mentions.map(async (mention) => {
          const users = await searchUsersByName(mention.name, 1);
          return users.length > 0 ? { id: users[0].id, name: mention.name } : { id: "", name: mention.name };
        })
      );

      // Filter out mentions with no ID (user not found)
      const validMentions = enrichedMentions.filter((m) => m.id !== "");

      const commentData = {
        answerId,
        text: text.trim(),
        author: {
          id: user.uid,
          name: user.displayName || "Anonymous",
          avatar: user.photoURL || undefined,
        },
        createdAt: serverTimestamp(),
        mentions: validMentions.length > 0 ? validMentions : null,
      };

      // Add comment to Firestore
      const commentRef = await addDoc(collection(db, "comments"), commentData);

      // Find the answer to get the author for notification
      const answer = answers.find((a) => a.id === answerId);

      // Create notification for answer author
      if (answer && answer.author.id !== user.uid) {
        try {
          await createNotification({
            userId: answer.author.id,
            type: "comment",
            text: `Someone commented on your answer to "${questionTitle.substring(0, 60)}${questionTitle.length > 60 ? "..." : ""}"`,
            relatedId: questionId,
            triggeredBy: {
              id: user.uid,
              name: user.displayName || "Anonymous",
              avatar: user.photoURL || undefined,
            },
          });
        } catch (notificationError) {
          console.error("Error creating notification:", notificationError);
          // Don't fail the entire operation if notification fails
        }
      }

      // Send notifications to mentioned users
      for (const mention of validMentions) {
        if (mention.id && mention.id !== user.uid) {
          try {
            await createNotification({
              userId: mention.id,
              type: "mention",
              text: `${user.displayName || "Anonymous"} mentioned you in a comment on "${questionTitle.substring(0, 60)}${questionTitle.length > 60 ? "..." : ""}"`,
              relatedId: questionId,
              triggeredBy: {
                id: user.uid,
                name: user.displayName || "Anonymous",
                avatar: user.photoURL || undefined,
              },
            });
          } catch (notificationError) {
            console.error("Error creating mention notification:", notificationError);
            // Continue with other mentions even if one fails
          }
        }
      }

      // Add to local state
      const newComment: Comment = {
        id: commentRef.id,
        text: text.trim(),
        author: {
          id: user.uid,
          name: user.displayName || "Anonymous",
          avatar: user.photoURL || undefined,
        },
        createdAt: new Date(),
        mentions: validMentions.length > 0 ? validMentions : undefined,
      };

      setAnswers((prevAnswers) =>
        prevAnswers.map((answer) => {
          if (answer.id === answerId) {
            return {
              ...answer,
              comments: [...answer.comments, newComment],
            };
          }
          return answer;
        })
      );

      // Clear input
      setCommentText((prev) => ({ ...prev, [answerId]: "" }));

      toast.success("Your comment has been posted!");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post your comment. Please try again.");
    }
  };

  // Handle upvote on answer
  const handleUpvoteAnswer = async (answerId: string) => {
    if (!user) {
      toast.error("You must be signed in to vote");
      return;
    }

    try {
      // Get current user votes
      const votesQuery = query(collection(db, "answerVotes"), where("answerId", "==", answerId), where("userId", "==", user.uid));

      const votesSnapshot = await getDocs(votesQuery);

      if (votesSnapshot.empty) {
        // No vote yet, add upvote
        await addDoc(collection(db, "answerVotes"), {
          answerId,
          userId: user.uid,
          vote: "upvote",
          createdAt: serverTimestamp(),
        });

        // Update answer upvotes
        const answerRef = doc(db, "answers", answerId);
        await updateDoc(answerRef, {
          upvotes: increment(1),
        });

        // Update local state
        setAnswers((prev) =>
          prev.map((answer) => {
            if (answer.id === answerId) {
              return {
                ...answer,
                upvotes: answer.upvotes + 1,
              };
            }
            return answer;
          })
        );
      } else {
        const voteDoc = votesSnapshot.docs[0];
        const voteData = voteDoc.data();

        if (voteData.vote === "upvote") {
          // Already upvoted, remove vote
          await deleteDoc(doc(db, "answerVotes", voteDoc.id));

          // Update answer upvotes
          const answerRef = doc(db, "answers", answerId);
          await updateDoc(answerRef, {
            upvotes: increment(-1),
          });

          // Update local state
          setAnswers((prev) =>
            prev.map((answer) => {
              if (answer.id === answerId) {
                return {
                  ...answer,
                  upvotes: answer.upvotes - 1,
                };
              }
              return answer;
            })
          );
        } else {
          // Was downvoted, change to upvote
          await updateDoc(doc(db, "answerVotes", voteDoc.id), {
            vote: "upvote",
            updatedAt: serverTimestamp(),
          });

          // Update answer votes
          const answerRef = doc(db, "answers", answerId);
          await updateDoc(answerRef, {
            upvotes: increment(1),
            downvotes: increment(-1),
          });

          // Update local state
          setAnswers((prev) =>
            prev.map((answer) => {
              if (answer.id === answerId) {
                return {
                  ...answer,
                  upvotes: answer.upvotes + 1,
                  downvotes: answer.downvotes - 1,
                };
              }
              return answer;
            })
          );
        }
      }
    } catch (error) {
      console.error("Error updating vote:", error);
      toast.error("Failed to update vote");
    }
  };

  // Handle downvote on answer
  const handleDownvoteAnswer = async (answerId: string) => {
    if (!user) {
      toast.error("You must be signed in to vote");
      return;
    }

    try {
      // Get current user votes
      const votesQuery = query(collection(db, "answerVotes"), where("answerId", "==", answerId), where("userId", "==", user.uid));

      const votesSnapshot = await getDocs(votesQuery);

      if (votesSnapshot.empty) {
        // No vote yet, add downvote
        await addDoc(collection(db, "answerVotes"), {
          answerId,
          userId: user.uid,
          vote: "downvote",
          createdAt: serverTimestamp(),
        });

        // Update answer downvotes
        const answerRef = doc(db, "answers", answerId);
        await updateDoc(answerRef, {
          downvotes: increment(1),
        });

        // Update local state
        setAnswers((prev) =>
          prev.map((answer) => {
            if (answer.id === answerId) {
              return {
                ...answer,
                downvotes: answer.downvotes + 1,
              };
            }
            return answer;
          })
        );
      } else {
        const voteDoc = votesSnapshot.docs[0];
        const voteData = voteDoc.data();

        if (voteData.vote === "downvote") {
          // Already downvoted, remove vote
          await deleteDoc(doc(db, "answerVotes", voteDoc.id));

          // Update answer downvotes
          const answerRef = doc(db, "answers", answerId);
          await updateDoc(answerRef, {
            downvotes: increment(-1),
          });

          // Update local state
          setAnswers((prev) =>
            prev.map((answer) => {
              if (answer.id === answerId) {
                return {
                  ...answer,
                  downvotes: answer.downvotes - 1,
                };
              }
              return answer;
            })
          );
        } else {
          // Was upvoted, change to downvote
          await updateDoc(doc(db, "answerVotes", voteDoc.id), {
            vote: "downvote",
            updatedAt: serverTimestamp(),
          });

          // Update answer votes
          const answerRef = doc(db, "answers", answerId);
          await updateDoc(answerRef, {
            upvotes: increment(-1),
            downvotes: increment(1),
          });

          // Update local state
          setAnswers((prev) =>
            prev.map((answer) => {
              if (answer.id === answerId) {
                return {
                  ...answer,
                  upvotes: answer.upvotes - 1,
                  downvotes: answer.downvotes + 1,
                };
              }
              return answer;
            })
          );
        }
      }
    } catch (error) {
      console.error("Error updating vote:", error);
      toast.error("Failed to update vote");
    }
  };

  // Mark an answer as the best answer
  const markAsBestAnswer = async (answerId: string) => {
    if (!user || user.uid !== questionAuthorId) {
      toast.error("Only the question author can mark the best answer");
      return;
    }

    try {
      // First reset any existing best answer
      const answersQuery = query(collection(db, "answers"), where("questionId", "==", questionId), where("isBestAnswer", "==", true));
      const existingBestAnswers = await getDocs(answersQuery);

      const batch = writeBatch(db);

      // Reset existing best answers
      existingBestAnswers.forEach((doc) => {
        batch.update(doc.ref, { isBestAnswer: false });
      });

      // Set new best answer
      const answerRef = doc(db, "answers", answerId);
      batch.update(answerRef, { isBestAnswer: true });

      // Commit the batch
      await batch.commit();

      // Find the answer to get the author for notification
      const answer = answers.find((a) => a.id === answerId);

      // Create notification for answer author
      if (answer && answer.author.id !== user.uid) {
        try {
          await createNotification({
            userId: answer.author.id,
            type: "bestAnswer",
            text: `Your answer was marked as the best answer on "${questionTitle.substring(0, 60)}${questionTitle.length > 60 ? "..." : ""}"`,
            relatedId: questionId,
            triggeredBy: {
              id: user.uid,
              name: user.displayName || "Anonymous",
              avatar: user.photoURL || undefined,
            },
          });
        } catch (notificationError) {
          console.error("Error creating notification:", notificationError);
          // Don't fail the entire operation if notification fails
        }
      }

      // Update local state
      setAnswers((prev) =>
        prev.map((answer) => ({
          ...answer,
          isBestAnswer: answer.id === answerId,
        }))
      );

      toast.success("Best answer updated!");
    } catch (error) {
      console.error("Error marking best answer:", error);
      toast.error("Failed to update best answer. Please try again.");
    }
  };

  // Answer skeleton loader
  const AnswersSkeleton = () => (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-muted h-8 w-8"></div>
            <div className="space-y-1">
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Format comment text to highlight mentions
  const formatCommentText = (text: string) => {
    const parts = text.split(/@([a-zA-Z0-9_\s]+)/g);

    return (
      <>
        {parts.map((part, index) => {
          // Even indices are regular text
          if (index % 2 === 0) {
            return part;
          }
          // Odd indices are mention names
          return (
            <span key={index} className="text-blue-500 font-medium">
              @{part}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center">
            Answers
            <span className="ml-2 text-sm font-normal text-muted-foreground">({answers.length})</span>
          </h2>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <AnswersSkeleton />
          ) : error ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-2">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : answers.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No answers yet. Be the first to answer!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {answers.map((answer) => {
                const isExpanded = expandedComments.includes(answer.id);
                const commentCount = answer.comments.length;
                const formattedDate = formatDistanceToNow(answer.createdAt?.toDate ? answer.createdAt.toDate() : new Date(answer.createdAt), { addSuffix: true });

                return (
                  <Card key={answer.id} className={`w-full ${answer.isBestAnswer ? "border-green-500 dark:border-green-700" : ""}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={answer.author.avatar} alt={answer.author.name} />
                            <AvatarFallback>{answer.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{answer.author.name}</p>
                            <p className="text-muted-foreground text-xs">{formattedDate}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Best answer badge */}
                          {answer.isBestAnswer && (
                            <Badge variant="success" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Best Answer
                            </Badge>
                          )}

                          {/* Mark as best answer (only for question author) */}
                          {user?.uid === questionAuthorId && !answer.isBestAnswer && (
                            <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => markAsBestAnswer(answer.id)}>
                              Mark as Best
                            </Button>
                          )}

                          {/* Report button */}
                          <ReportDialog contentId={answer.id} contentType="answer" contentTitle={answer.content?.substring(0, 50)} />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Voting and content */}
                      <div className="grid grid-cols-12 gap-4">
                        {/* Voting buttons */}
                        <div className="col-span-1 flex flex-col items-center">
                          <Button variant="ghost" size="sm" className="rounded-full p-0 h-8 w-8" onClick={() => handleUpvoteAnswer(answer.id)}>
                            <ArrowUpCircle className="h-5 w-5" />
                          </Button>
                          <span className="text-sm font-medium">{answer.upvotes - answer.downvotes}</span>
                          <Button variant="ghost" size="sm" className="rounded-full p-0 h-8 w-8" onClick={() => handleDownvoteAnswer(answer.id)}>
                            <ArrowDownCircle className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Answer content */}
                        <div className="col-span-11">
                          <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: answer.content }} />

                          {/* Comments section */}
                          <div className="mt-6">
                            <div className="flex items-center justify-between">
                              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => toggleComments(answer.id)}>
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {answer.comments.length} {answer.comments.length === 1 ? "Comment" : "Comments"}
                                {isExpanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                              </Button>
                            </div>

                            {/* Expanded comments */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                  <div className="mt-3 space-y-3">
                                    {/* Existing comments */}
                                    {answer.comments.map((comment) => (
                                      <div key={comment.id} className="pl-4 border-l-2 border-muted">
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              <Avatar className="h-6 w-6">
                                                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                                                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                                              </Avatar>
                                              <span className="font-medium text-xs">{comment.author.name}</span>
                                              <span className="text-muted-foreground text-xs">
                                                {formatDistanceToNow(comment.createdAt?.toDate ? comment.createdAt.toDate() : new Date(comment.createdAt), {
                                                  addSuffix: true,
                                                })}
                                              </span>
                                            </div>
                                            <div className="mt-1 text-sm" dangerouslySetInnerHTML={{ __html: formatCommentText(comment.text) }} />
                                          </div>

                                          {/* Comment report button */}
                                          <ReportDialog contentId={comment.id} contentType="comment" contentTitle={comment.text?.substring(0, 50)} />
                                        </div>
                                      </div>
                                    ))}

                                    {/* Comment input */}
                                    <div className="pt-3">
                                      <Textarea
                                        ref={(el) => {
                                          commentRefs.current[answer.id] = el;
                                        }}
                                        placeholder="Add a comment..."
                                        value={commentText[answer.id] || ""}
                                        onChange={(e) => {
                                          setCommentText({ ...commentText, [answer.id]: e.target.value });
                                          checkForMention(e.target.value, answer.id);
                                          setCursorPosition(e.target.selectionStart);
                                        }}
                                        onKeyDown={(e) => handleMentionKeyDown(e, answer.id)}
                                        className="min-h-[80px] text-sm"
                                      />

                                      {/* Mention results */}
                                      {mentionResults.length > 0 && activeMentionAnswerId === answer.id && (
                                        <div className="absolute z-10 mt-1 w-64 max-h-48 overflow-y-auto bg-popover rounded-md border shadow-md">
                                          {mentionResults.map((user, idx) => (
                                            <button key={user.id} className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-accent ${idx === mentionIndex ? "bg-accent" : ""}`} onClick={() => insertMention(answer.id, user)}>
                                              <Avatar className="h-6 w-6">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                              </Avatar>
                                              <span className="text-sm">{user.name}</span>
                                            </button>
                                          ))}
                                        </div>
                                      )}

                                      <div className="flex justify-end mt-2">
                                        <Button size="sm" onClick={() => handleSubmitComment(answer.id)} disabled={!commentText[answer.id]?.trim()} className="flex items-center gap-1">
                                          <Send className="h-3 w-3" />
                                          Comment
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Add answer form */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Your Answer</h3>

            {!user ? (
              <div className="text-center py-4 border rounded-lg">
                <p className="mb-2">You need to be signed in to answer this question</p>
                <Button>Sign In</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border rounded-md overflow-hidden">{isQuillMounted && <ReactQuill theme="snow" value={answerContent} onChange={setAnswerContent} modules={quillModules} formats={quillFormats} placeholder="Write your answer here. Be specific and clear..." className="bg-transparent text-foreground min-h-[200px]" readOnly={isSubmitting} />}</div>

                <div className="flex justify-end">
                  <Button onClick={handleSubmitAnswer} disabled={isSubmitting || !answerContent.trim()} className="flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-1" />
                        Post Your Answer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
