"use client";

import { PreferencesForm } from "@/components/auth/PreferencesForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { checkFirebaseConnection } from "@/lib/firebase";

export default function PreferencesPage() {
  const { user, loading, hasCompletedPreferences, networkError, retryFetchUserData, resetNetworkConnection } = useAuth();
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [retryCount, setRetryCount] = useState(0);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const router = useRouter();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-retry when coming back online after a short delay to let connection establish
      setTimeout(() => {
        retryFetchUserData();
      }, 1500);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [retryFetchUserData]);

  // Retry mechanism for handling the "client is offline" error when browser reports online
  useEffect(() => {
    if (networkError && (networkError.includes("client is offline") || networkError.includes("Unable to connect to Firebase")) && isOnline && retryCount < 3) {
      const timer = setTimeout(() => {
        console.log(`Auto-retrying connection (attempt ${retryCount + 1})...`);
        handleRetry();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [networkError, isOnline, retryCount]);

  // Reset retry count when error changes
  useEffect(() => {
    if (!networkError) {
      setRetryCount(0);
    }
  }, [networkError]);

  // Skip function for temporarily offline users
  const handleSkip = () => {
    router.push("/dashboard");
  };

  // Handle retry button click with improved connection check
  const handleRetry = async () => {
    setIsCheckingConnection(true);

    try {
      // Reset network connection first to fix potential "client is offline" issues
      await resetNetworkConnection();

      // First check if Firebase is actually reachable
      const isConnected = await checkFirebaseConnection();

      if (!isConnected && navigator.onLine) {
        console.log("Firebase is unreachable but browser reports online");
      }

      // Increment retry count and try to fetch user data
      setRetryCount((prev) => prev + 1);
      await retryFetchUserData();
    } catch (error) {
      console.error("Error during retry:", error);
    } finally {
      setIsCheckingConnection(false);
    }
  };

  // Redirect authenticated users who have already completed preferences
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // No user, redirect to sign in
        router.push("/auth/signin");
      } else if (hasCompletedPreferences) {
        // User has already completed preferences, redirect to dashboard
        router.push("/dashboard");
      }
    }
  }, [user, loading, hasCompletedPreferences, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Return empty fragment if we're redirecting
  if (!user || hasCompletedPreferences) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        {networkError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Network Error: </strong>
            <span className="block sm:inline">{networkError}</span>
            <div className="mt-2 flex space-x-2">
              <Button onClick={handleRetry} className="bg-red-700 hover:bg-red-800 text-white" size="sm" disabled={isCheckingConnection}>
                {isCheckingConnection ? "Checking..." : `Retry Connection ${retryCount > 0 ? `(${retryCount})` : ""}`}
              </Button>

              <Button onClick={handleSkip} className="bg-gray-600 hover:bg-gray-700 text-white" size="sm">
                Skip for Now
              </Button>
            </div>
          </div>
        )}
        <PreferencesForm />

        {!isOnline && !networkError && (
          <div className="mt-4 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Having trouble connecting?</p>
            <Button onClick={handleSkip} variant="outline">
              Skip for Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
