"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { UserPreferences } from "@/lib/userService";
import { db } from "@/lib/firebase";
import { getDocs, collection, limit, query, doc, setDoc, updateDoc } from "firebase/firestore";
import { checkFirebaseConnection } from "@/lib/firebase";

// Define form schema
const preferencesSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  institution: z.string().min(2, { message: "Institution is required" }),
  level: z.string().min(1, { message: "Level is required" }),
  group: z.string().optional(),
  batch: z.string().optional(),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

export function PreferencesForm() {
  const { user, updatePreferences, userData, resetNetworkConnection } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(true);
  const router = useRouter();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkConnectionStatus();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check Firestore connection on initial load
    checkConnectionStatus();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Test Firestore connection using the improved helper
  const checkConnectionStatus = async () => {
    // Try resetting network connection if we've had connectivity issues
    if (!isFirestoreConnected) {
      try {
        await resetNetworkConnection();
      } catch (error) {
        console.error("Failed to reset network:", error);
      }
    }

    const isConnected = await checkFirebaseConnection();
    setIsFirestoreConnected(isConnected);
    return isConnected;
  };

  // Alternative direct save to Firestore function as a fallback
  const directSaveToFirestore = async (preferences: UserPreferences): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log("Attempting direct save to Firestore");
      const userDocRef = doc(db, "users", user.uid);

      await updateDoc(userDocRef, {
        ...preferences,
        hasCompletedPreferences: true,
        updatedAt: Date.now(),
      });

      console.log("✅ Direct save successful");
      return true;
    } catch (updateError) {
      console.error("Update failed, trying setDoc instead", updateError);

      try {
        // If update fails, try set instead (for new users)
        const userDocRef = doc(db, "users", user.uid);

        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email || "",
          ...preferences,
          hasCompletedPreferences: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        console.log("✅ Direct save with setDoc successful");
        return true;
      } catch (setError) {
        console.error("❌ Both update and set failed", setError);
        return false;
      }
    }
  };

  // Check if preferences were completed and redirect if needed
  useEffect(() => {
    if (userData?.hasCompletedPreferences) {
      console.log("Preferences completed, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [userData, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      name: user?.displayName || "",
      institution: "",
      level: "",
      group: "",
      batch: "",
    },
  });

  // Handle preferences submission with navigation to dashboard if successful
  const onSubmit = useCallback(
    async (data: PreferencesFormValues) => {
      setIsLoading(true);
      setError(null);

      // Double check online status
      const isActuallyOnline = typeof navigator !== "undefined" && navigator.onLine;
      if (!isActuallyOnline) {
        setError("You appear to be offline. Your data will be saved when you reconnect.");
        setIsLoading(false);
        return;
      }

      // Reset network connection to fix any potential issues
      try {
        await resetNetworkConnection();
      } catch (resetError) {
        console.log("Network reset attempt:", resetError);
      }

      // Check Firestore connection before attempting update
      const isConnected = await checkConnectionStatus();
      if (!isConnected) {
        setError("Cannot connect to database. Please check your network connection and try again.");
        setIsLoading(false);
        return;
      }

      const preferences: UserPreferences = {
        name: data.name,
        institution: data.institution,
        level: data.level,
        group: data.group || undefined,
        batch: data.batch || undefined,
        photoURL: user?.photoURL || undefined,
      };

      try {
        console.log("Updating preferences:", preferences);
        const updatedData = await updatePreferences(preferences);
        console.log("Preferences updated successfully, data:", updatedData);

        // Only navigate if the update was successful and preferences are marked as completed
        if (updatedData?.hasCompletedPreferences) {
          console.log("Confirmed preferences completion, navigating to dashboard");
          router.push("/dashboard");
        } else {
          // If we got data but preferences not marked as completed, try direct save
          console.log("Preferences update incomplete, trying direct save...");
          const directSaveSuccessful = await directSaveToFirestore(preferences);

          if (directSaveSuccessful) {
            console.log("Direct save successful, navigating to dashboard");
            router.push("/dashboard");
          } else {
            setError("Could not save preferences. Please try again later.");
          }
        }
      } catch (error) {
        console.error("Error updating preferences:", error);

        // Try direct save as fallback
        try {
          console.log("Attempting direct save after main save failed");
          const directSaveSuccessful = await directSaveToFirestore(preferences);

          if (directSaveSuccessful) {
            console.log("Direct save successful, navigating to dashboard");
            router.push("/dashboard");
            return;
          }
        } catch (directSaveError) {
          console.error("Direct save also failed:", directSaveError);
        }

        // Handle specific Firebase errors if direct save also failed
        if (error instanceof Error) {
          const errorMessage = error.message;
          const isActuallyOffline = typeof navigator !== "undefined" && !navigator.onLine;

          // Show specific, user-friendly error messages
          if (isActuallyOffline && (errorMessage.includes("offline") || errorMessage.includes("Network error"))) {
            setError("You are offline. Please check your internet connection and try again.");
          } else if (errorMessage.includes("client is offline")) {
            setError("Failed to connect to the database. Please try again in a few seconds.");
            // Schedule a connection check to update UI state
            setTimeout(checkConnectionStatus, 3000);
          } else if (errorMessage.includes("permission-denied") || errorMessage.includes("unauthorized")) {
            setError("You don't have permission to update your preferences. Please sign out and sign in again.");
          } else if (errorMessage.includes("not-found")) {
            setError("User profile not found. Please sign out and sign in again to create your profile.");
          } else {
            setError(`Failed to update preferences: ${errorMessage}`);
          }
        } else {
          setError("Failed to update preferences. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router, updatePreferences, user, resetNetworkConnection]
  );

  // Skip preferences and go straight to dashboard
  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Complete Your Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Please provide some information to personalize your experience</p>
      </div>

      {!isOnline && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">You are currently offline. Your changes will be saved when you reconnect.</span>
        </div>
      )}

      {!isFirestoreConnected && isOnline && (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Cannot connect to the database server. Some features may be limited.</span>
          <button onClick={checkConnectionStatus} className="mt-2 py-1 px-2 bg-orange-700 text-white text-xs rounded hover:bg-orange-800">
            Retry Connection
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium leading-none">
            Full Name
          </label>
          <Input id="name" type="text" placeholder="Your full name" disabled={isLoading} {...register("name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="institution" className="text-sm font-medium leading-none">
            Institution
          </label>
          <Input id="institution" type="text" placeholder="Your school/college/university" disabled={isLoading} {...register("institution")} />
          {errors.institution && <p className="text-sm text-red-500">{errors.institution.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="level" className="text-sm font-medium leading-none">
            Academic Level
          </label>
          <select id="level" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" disabled={isLoading} {...register("level")}>
            <option value="">Select your level</option>
            <option value="School">School</option>
            <option value="High School">High School</option>
            <option value="College">College</option>
            <option value="Admission">Admission Prep</option>
          </select>
          {errors.level && <p className="text-sm text-red-500">{errors.level.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="group" className="text-sm font-medium leading-none">
            Group/Department (Optional)
          </label>
          <Input id="group" type="text" placeholder="e.g., Science, Arts, Commerce" disabled={isLoading} {...register("group")} />
          {errors.group && <p className="text-sm text-red-500">{errors.group.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="batch" className="text-sm font-medium leading-none">
            Batch/Year (Optional)
          </label>
          <Input id="batch" type="text" placeholder="e.g., 2023, 2024" disabled={isLoading} {...register("batch")} />
          {errors.batch && <p className="text-sm text-red-500">{errors.batch.message}</p>}
        </div>

        <div className="flex space-x-2">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save and Continue"}
          </Button>

          <Button type="button" variant="outline" className="flex-none" onClick={handleSkip}>
            Skip
          </Button>
        </div>
      </form>
    </div>
  );
}
