"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import dynamic from "next/dynamic";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

// Dynamically import React Quill with no SSR to avoid hydration issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full border rounded-md flex items-center justify-center">Loading editor...</div>,
});
import "react-quill/dist/quill.snow.css";

// Mock data for subjects and chapters
const SUBJECTS = [
  { id: "1", name: "Physics" },
  { id: "2", name: "Chemistry" },
  { id: "3", name: "Biology" },
  { id: "4", name: "Mathematics" },
];

// Chapters are organized by subject ID
const CHAPTERS_BY_SUBJECT = {
  "1": [
    { id: "1-1", name: "Mechanics" },
    { id: "1-2", name: "Optics" },
    { id: "1-3", name: "Thermodynamics" },
  ],
  "2": [
    { id: "2-1", name: "Organic Chemistry" },
    { id: "2-2", name: "Inorganic Chemistry" },
    { id: "2-3", name: "Physical Chemistry" },
  ],
  "3": [
    { id: "3-1", name: "Zoology" },
    { id: "3-2", name: "Botany" },
    { id: "3-3", name: "Human Physiology" },
  ],
  "4": [
    { id: "4-1", name: "Algebra" },
    { id: "4-2", name: "Calculus" },
    { id: "4-3", name: "Geometry" },
  ],
};

const quillModules = {
  toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image", "code-block"], ["clean"]],
};

const quillFormats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "link", "image", "code-block"];

export function AskQuestionForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);

  // Fix to handle ReactQuill component within a client component in Next.js
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset chapter when subject changes
  const handleSubjectChange = (value: string) => {
    setSubject(value);
    setChapter("");
  };

  // Add a tag to the list
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  // Remove a tag from the list
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle tag input keypress
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Check file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, and GIF images are allowed");
        return;
      }

      // Store the file for later upload
      setImageFile(file);

      // Create image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setImageURL(null);
    setUploadProgress(0);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    try {
      const fileExtension = imageFile.name.split(".").pop();
      const fileName = `question_images/${uuidv4()}.${fileExtension}`;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Update progress
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(progress);
          },
          (error) => {
            // Handle errors
            console.error("Upload failed:", error);
            toast.error("Failed to upload image");
            reject(null);
          },
          async () => {
            // Upload completed successfully
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setImageURL(downloadURL);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Error starting upload:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!title.trim()) {
      toast.error("Please enter a question title");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter question details");
      return;
    }

    if (!subject) {
      toast.error("Please select a subject");
      return;
    }

    // Check if user is authenticated
    if (!user) {
      toast.error("You must be signed in to post a question");
      router.push("/auth/signin");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image if present
      let questionImageURL = null;
      if (imageFile) {
        questionImageURL = await uploadImage();
        if (!questionImageURL) {
          toast.error("Failed to upload image. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      // Get subject and chapter names
      const subjectName = SUBJECTS.find((s) => s.id === subject)?.name || "";
      const chapterName = chapter ? CHAPTERS_BY_SUBJECT[subject as keyof typeof CHAPTERS_BY_SUBJECT]?.find((c) => c.id === chapter)?.name || "" : "";

      // Prepare question data
      const questionData = {
        title: title.trim(),
        content,
        subject: {
          id: subject,
          name: subjectName,
        },
        chapter: chapter
          ? {
              id: chapter,
              name: chapterName,
            }
          : null,
        tags,
        imageURL: questionImageURL,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorPhotoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
        views: 0,
        answers: 0,
        isResolved: false,
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, "questions"), questionData);

      console.log("Question posted with ID:", docRef.id);

      toast.success("Your question has been posted!");
      router.push("/doubts");
    } catch (error) {
      console.error("Error submitting question:", error);
      toast.error("Failed to post your question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="space-y-6">
            {/* Question title */}
            <div className="space-y-2">
              <Label htmlFor="title">Question Title *</Label>
              <Input id="title" placeholder="Enter a clear, specific title for your question" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isSubmitting} maxLength={100} required />
              <div className="text-xs text-muted-foreground text-right">{title.length}/100</div>
            </div>

            {/* Subject and Chapter selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select value={subject} onValueChange={handleSubjectChange} disabled={isSubmitting}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subj) => (
                      <SelectItem key={subj.id} value={subj.id}>
                        {subj.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chapter">Chapter</Label>
                <Select value={chapter} onValueChange={setChapter} disabled={isSubmitting || !subject}>
                  <SelectTrigger id="chapter">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {subject &&
                      CHAPTERS_BY_SUBJECT[subject as keyof typeof CHAPTERS_BY_SUBJECT]?.map((chap) => (
                        <SelectItem key={chap.id} value={chap.id}>
                          {chap.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Question content */}
          <div className="space-y-2">
            <Label htmlFor="content">Question Details *</Label>
            <div className="border rounded-md overflow-hidden">{isMounted && <ReactQuill id="content" theme="snow" value={content} onChange={setContent} modules={quillModules} formats={quillFormats} placeholder="Describe your question in detail. Include relevant information, what you've tried, and what you're trying to achieve." className="bg-transparent text-foreground h-[200px]" readOnly={isSubmitting} />}</div>
            <p className="text-xs text-muted-foreground">Format your question with rich text options to make it more clear and readable</p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (max 5)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <div key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center text-sm">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-muted-foreground hover:text-foreground" disabled={isSubmitting}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input id="tags" placeholder="Add a tag and press Enter" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={handleTagKeyPress} disabled={isSubmitting || tags.length >= 5} maxLength={20} />
              <Button type="button" variant="outline" onClick={addTag} disabled={isSubmitting || !currentTag.trim() || tags.length >= 5}>
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Tags help others find your question. Add up to 5 short keywords.</p>
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image (optional)</Label>

            {imagePreview ? (
              <div className="relative border rounded-md p-2 mt-2">
                <div className="relative w-full h-[200px] flex items-center justify-center">
                  <Image src={imagePreview as string} alt="Question image preview" fill style={{ objectFit: "contain" }} className="rounded-md" />
                </div>
                <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeImage} disabled={isSubmitting}>
                  <X className="h-4 w-4" />
                </Button>
                {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center text-xs py-1">Uploading: {uploadProgress}%</div>}
              </div>
            ) : (
              <div className="border border-dashed rounded-md p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-sm font-medium">Drag & drop an image or click to browse</div>
                  <p className="text-xs text-muted-foreground">PNG, JPG or GIF up to 5MB</p>
                </div>
                <input id="image" type="file" accept="image/jpeg,image/png,image/gif" className="hidden" onChange={handleImageUpload} disabled={isSubmitting} ref={fileInputRef} />
                <Button type="button" variant="outline" className="mt-4" onClick={() => document.getElementById("image")?.click()} disabled={isSubmitting}>
                  Select File
                </Button>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/doubts")} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : "Post Question"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
