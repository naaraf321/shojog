"use client";

import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle, Flag, MessageSquare, Eye, Share2, Bell, BellOff, CopyIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { doc, updateDoc, increment, arrayUnion, arrayRemove, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { toast } from "sonner";
import "react-quill/dist/quill.snow.css";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, LinkedinShareButton, EmailShareButton, FacebookIcon, TwitterIcon, WhatsappIcon, LinkedinIcon, EmailIcon } from "react-share";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Author {
  id: string;
  name: string;
  avatar?: string;
}

interface Subject {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  name: string;
}

interface Question {
  id: string;
  title: string;
  content: string;
  author: Author;
  subject: Subject;
  chapter?: Chapter;
  tags: string[];
  createdAt: any;
  viewCount: number;
  answerCount: number;
  upvotes: number;
  downvotes: number;
  imageURL?: string;
  isResolved: boolean;
  followers?: string[]; // Array of user IDs who follow this question
}

interface QuestionDetailProps {
  question: Question;
}

// Share Dialog Component
interface ShareDialogProps {
  url: string;
  title: string;
}

function ShareDialog({ url, title }: ShareDialogProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-1">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Question</DialogTitle>
          <DialogDescription>Share this question with your friends or colleagues</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4 justify-center">
            <FacebookShareButton url={url} hashtag="#ShudhuMCQ">
              <FacebookIcon size={40} round />
            </FacebookShareButton>
            <TwitterShareButton url={url} title={title}>
              <TwitterIcon size={40} round />
            </TwitterShareButton>
            <WhatsappShareButton url={url} title={title}>
              <WhatsappIcon size={40} round />
            </WhatsappShareButton>
            <LinkedinShareButton url={url} title={title}>
              <LinkedinIcon size={40} round />
            </LinkedinShareButton>
            <EmailShareButton url={url} subject={`Check out this question: ${title}`} body={`I found this interesting question and thought you might like it:\n\n${title}\n\n${url}`}>
              <EmailIcon size={40} round />
            </EmailShareButton>
          </div>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <div className="flex items-center justify-between border rounded-md p-2">
                <span className="text-sm truncate max-w-[280px]">{url}</span>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={handleCopy}>
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DialogClose asChild>
          <Button variant="secondary" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

// Report Dialog Component
interface ReportDialogProps {
  questionId: string;
  questionTitle: string;
}

// Report reasons
const reportReasons = [
  { id: "spam", label: "Spam" },
  { id: "inappropriate", label: "Inappropriate content" },
  { id: "harassment", label: "Harassment" },
  { id: "misinformation", label: "Misinformation" },
  { id: "duplicate", label: "Duplicate question" },
  { id: "other", label: "Other" },
];

function ReportDialog({ questionId, questionTitle }: ReportDialogProps) {
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
        contentType: "question",
        contentId: questionId,
        contentTitle: questionTitle,
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
        <Button variant="outline" size="sm" className="flex gap-1 text-muted-foreground">
          <Flag className="h-4 w-4" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Question</DialogTitle>
          <DialogDescription>Report this question for inappropriate content or other issues. Our moderators will review it.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={reason || ""} onValueChange={setReason}>
            {reportReasons.map((reportReason) => (
              <div key={reportReason.id} className="flex items-center space-x-2">
                <RadioGroupItem value={reportReason.id} id={reportReason.id} />
                <Label htmlFor={reportReason.id}>{reportReason.label}</Label>
              </div>
            ))}
          </RadioGroup>

          <div className="grid gap-2">
            <Label htmlFor="report-details">Additional details (optional)</Label>
            <Textarea id="report-details" placeholder="Please provide any additional information that might help us understand the issue" value={details} onChange={(e) => setDetails(e.target.value)} />
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

export function QuestionDetail({ question }: QuestionDetailProps) {
  const { user } = useAuth();
  const [localUpvotes, setLocalUpvotes] = useState(question.upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(question.downvotes);
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(question.followers?.length || 0);
  const [shareUrl, setShareUrl] = useState<string>("");

  // Format the timestamp
  const timeAgo = formatDistanceToNow(question.createdAt?.toDate ? question.createdAt.toDate() : new Date(question.createdAt), { addSuffix: true });

  // Set the share URL on client-side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  // Check if user is following this question
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user) {
        setIsFollowingLoading(false);
        return;
      }

      try {
        const questionRef = doc(db, "questions", question.id);
        const questionDoc = await getDoc(questionRef);

        if (questionDoc.exists()) {
          const questionData = questionDoc.data();
          const followers = questionData.followers || [];
          setIsFollowing(followers.includes(user.uid));
          setFollowerCount(followers.length);
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setIsFollowingLoading(false);
      }
    };

    checkFollowStatus();
  }, [question.id, user]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!user) {
      toast.error("You must be signed in to follow questions");
      return;
    }

    setIsFollowingLoading(true);

    try {
      const questionRef = doc(db, "questions", question.id);

      if (isFollowing) {
        // Unfollow the question
        await updateDoc(questionRef, {
          followers: arrayRemove(user.uid),
        });
        setIsFollowing(false);
        setFollowerCount((prev) => prev - 1);
        toast.success("You are no longer following this question");
      } else {
        // Follow the question
        await updateDoc(questionRef, {
          followers: arrayUnion(user.uid),
        });
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
        toast.success("You are now following this question");
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      toast.error("Failed to update follow status");
    } finally {
      setIsFollowingLoading(false);
    }
  };

  // Handle upvote
  const handleUpvote = async () => {
    if (!user) {
      toast.error("You must be signed in to vote");
      return;
    }

    if (isVoting) return;

    setIsVoting(true);

    try {
      const questionRef = doc(db, "questions", question.id);

      if (userVote === "upvote") {
        // Remove upvote
        await updateDoc(questionRef, {
          upvotes: increment(-1),
        });
        setLocalUpvotes((prev) => prev - 1);
        setUserVote(null);
      } else if (userVote === "downvote") {
        // Change from downvote to upvote
        await updateDoc(questionRef, {
          upvotes: increment(1),
          downvotes: increment(-1),
        });
        setLocalUpvotes((prev) => prev + 1);
        setLocalDownvotes((prev) => prev - 1);
        setUserVote("upvote");
      } else {
        // New upvote
        await updateDoc(questionRef, {
          upvotes: increment(1),
        });
        setLocalUpvotes((prev) => prev + 1);
        setUserVote("upvote");
      }
    } catch (error) {
      console.error("Error updating vote:", error);
      toast.error("Failed to update vote");
    } finally {
      setIsVoting(false);
    }
  };

  // Handle downvote
  const handleDownvote = async () => {
    if (!user) {
      toast.error("You must be signed in to vote");
      return;
    }

    if (isVoting) return;

    setIsVoting(true);

    try {
      const questionRef = doc(db, "questions", question.id);

      if (userVote === "downvote") {
        // Remove downvote
        await updateDoc(questionRef, {
          downvotes: increment(-1),
        });
        setLocalDownvotes((prev) => prev - 1);
        setUserVote(null);
      } else if (userVote === "upvote") {
        // Change from upvote to downvote
        await updateDoc(questionRef, {
          upvotes: increment(-1),
          downvotes: increment(1),
        });
        setLocalUpvotes((prev) => prev - 1);
        setLocalDownvotes((prev) => prev + 1);
        setUserVote("downvote");
      } else {
        // New downvote
        await updateDoc(questionRef, {
          downvotes: increment(1),
        });
        setLocalDownvotes((prev) => prev + 1);
        setUserVote("downvote");
      }
    } catch (error) {
      console.error("Error updating vote:", error);
      toast.error("Failed to update vote");
    } finally {
      setIsVoting(false);
    }
  };

  // Handle report
  const handleReport = () => {
    if (!user) {
      toast.error("You must be signed in to report content");
      return;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold">{question.title}</h1>
          <div className="flex items-center space-x-3 text-muted-foreground text-sm">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{question.viewCount}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{question.answerCount}</span>
            </div>
            <div className="flex items-center">
              <Bell className="h-4 w-4 mr-1" />
              <span>{followerCount}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary" className="font-normal">
            {question.subject.name}
          </Badge>

          {question.chapter && (
            <Badge variant="outline" className="font-normal">
              {question.chapter.name}
            </Badge>
          )}

          {question.tags &&
            question.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-normal">
                {tag}
              </Badge>
            ))}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Question Content */}
        <div className="grid grid-cols-12 gap-4">
          {/* Voting Section */}
          <div className="col-span-1 flex flex-col items-center gap-1">
            <Button variant="ghost" size="sm" className={`rounded-full p-0 h-8 w-8 ${userVote === "upvote" ? "text-green-500" : ""}`} onClick={handleUpvote} disabled={isVoting}>
              <ArrowUpCircle className="h-6 w-6" />
            </Button>

            <span className="font-medium text-sm">{localUpvotes - localDownvotes}</span>

            <Button variant="ghost" size="sm" className={`rounded-full p-0 h-8 w-8 ${userVote === "downvote" ? "text-red-500" : ""}`} onClick={handleDownvote} disabled={isVoting}>
              <ArrowDownCircle className="h-6 w-6" />
            </Button>
          </div>

          {/* Question Content Section */}
          <div className="col-span-11">
            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: question.content }} />

            {/* Question Image (if available) */}
            {question.imageURL && (
              <div className="mt-4 border rounded-md p-2">
                <div className="relative w-full h-[300px]">
                  <Image src={question.imageURL} alt="Question image" fill style={{ objectFit: "contain" }} className="rounded-md" />
                </div>
              </div>
            )}

            {/* Author and timestamp */}
            <div className="flex items-center mt-8 space-x-2 text-sm">
              <Avatar className="h-8 w-8">
                <AvatarImage src={question.author.avatar} alt={question.author.name} />
                <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium">{question.author.name}</span>
                <p className="text-muted-foreground text-xs">Asked {timeAgo}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t flex justify-between pt-4">
        <Button variant="outline" size="sm" onClick={handleFollowToggle} disabled={isFollowingLoading} className={`flex gap-1 ${isFollowing ? "bg-primary/10" : ""}`}>
          {isFollowing ? (
            <>
              <BellOff className="h-4 w-4" />
              Unfollow
            </>
          ) : (
            <>
              <Bell className="h-4 w-4" />
              Follow
            </>
          )}
        </Button>
        <div className="flex gap-2">
          <ShareDialog url={shareUrl} title={question.title} />
          <ReportDialog questionId={question.id} questionTitle={question.title} />
        </div>
      </CardFooter>
    </Card>
  );
}
