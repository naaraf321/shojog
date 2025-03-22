"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserDocument, getUserData, updateUserPreferences, UserPreferences, UserData } from "@/lib/userService";
import { checkFirebaseConnection } from "@/lib/firebase";
import { enableNetwork, disableNetwork } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  networkError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<User>;
  signInWithFacebook: () => Promise<User>;
  updatePreferences: (preferences: UserPreferences) => Promise<UserData | null>;
  hasCompletedPreferences: boolean;
  retryFetchUserData: () => Promise<void>;
  resetNetworkConnection: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setNetworkError(null);

      // When coming back online, retry getting user data if we have a user
      if (user) {
        fetchUserData(user).catch(console.error);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNetworkError("You are currently offline. Some features may be limited.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [user]);

  // Fetch user data from Firestore
  const fetchUserData = async (user: User) => {
    try {
      // Try to fix any lingering connection issues
      if (networkError && networkError.includes("client is offline")) {
        await resetNetworkConnection();
      }

      // First check connectivity
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        // If we can't connect but browser says we're online
        if (typeof navigator !== "undefined" && navigator.onLine) {
          setNetworkError("Error: Unable to connect to Firebase. Please try again later.");
          return null;
        } else {
          // Actually offline
          setNetworkError("You are currently offline. Some features may be limited.");
          return null;
        }
      }

      // If connected, proceed with getting user data
      setNetworkError(null);
      const data = await getUserData(user.uid);
      setUserData(data);
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);

      // Handle offline or Firebase errors
      if (error instanceof Error) {
        const errorMessage = error.message;
        const errorCode = (error as any).code;

        // Check if actually offline before showing offline errors
        const isActuallyOffline = typeof navigator !== "undefined" && !navigator.onLine;

        if (isActuallyOffline && (errorCode === "unavailable" || errorCode === "failed-precondition" || errorMessage.includes("offline") || errorMessage.includes("client is offline"))) {
          setNetworkError("Unable to connect to the server. Please check your internet connection.");
        } else if (errorMessage.includes("client is offline")) {
          // Firebase sometimes incorrectly reports "client is offline" when it's a connection issue
          setNetworkError("Error: Failed to connect to Firebase. Please retry in a few seconds.");
        } else {
          setNetworkError(`Error: ${error.message}`);
        }
      }
      return null;
    }
  };

  // Reset Firestore network connection
  const resetNetworkConnection = async (): Promise<void> => {
    if (typeof window === "undefined") return;

    try {
      console.log("Attempting to reset Firestore network connection...");

      // Disable network first
      await disableNetwork(db);
      console.log("Network disabled");

      // Short delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Enable network again
      await enableNetwork(db);
      console.log("Network re-enabled");

      return;
    } catch (error) {
      console.error("Error resetting network:", error);
    }
  };

  const retryFetchUserData = async () => {
    if (!user) return;
    setLoading(true);

    // Clear error before retrying
    setNetworkError(null);

    // Reset network connection to fix potential "client is offline" error
    await resetNetworkConnection();

    // Check connection first
    const isConnected = await checkFirebaseConnection();
    if (!isConnected && navigator.onLine) {
      setNetworkError("Unable to connect to Firebase servers. Please try again later.");
      setLoading(false);
      return;
    }

    await fetchUserData(user);
    setLoading(false);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          // Create or update user document in Firestore
          await createUserDocument(user);
          // Fetch user data
          await fetchUserData(user);
        } catch (error) {
          console.error("Error in auth state change handler:", error);
          // We still continue even if there's an error as we might be offline
        }
      } else {
        setUserData(null);
        setNetworkError(null);
      }

      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string): Promise<User> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<User> => {
    try {
      const provider = new GoogleAuthProvider();
      // Remove additional scopes and parameters
      console.log("Starting Google sign-in process...");
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful");
      return result.user;
    } catch (error) {
      console.error("Detailed Google sign-in error:", error);
      // Check for specific Firebase errors
      if (error instanceof Error) {
        console.error("Error code:", (error as any).code);
        console.error("Error message:", error.message);

        // Handle specific error messages
        if ((error as any).code === "auth/configuration-not-found") {
          console.error("Firebase Google authentication is not properly configured. Please check Firebase console > Authentication > Sign-in methods > Google is enabled.");
        }
      }
      throw error;
    }
  };

  // Sign in with Facebook
  const signInWithFacebook = async (): Promise<User> => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      throw error;
    }
  };

  // Update user preferences
  const updatePreferences = async (preferences: UserPreferences) => {
    if (!user) throw new Error("No authenticated user");

    // Check connection status first
    const isActuallyOnline = typeof navigator !== "undefined" && navigator.onLine;
    if (!isActuallyOnline) {
      setNetworkError("You are offline. Please connect to the internet to save preferences.");
      throw new Error("Cannot update preferences while offline");
    }

    try {
      // Clear any previous network errors
      setNetworkError(null);

      // Update the preferences in Firestore
      await updateUserPreferences(user.uid, preferences);

      // Refresh user data
      const updatedData = await fetchUserData(user);

      // Log for debugging
      console.log("Preferences updated, hasCompletedPreferences:", updatedData?.hasCompletedPreferences);

      // Return the updated data
      return updatedData;
    } catch (error) {
      console.error("Error in updatePreferences:", error);

      // Show more accurate error message based on what actually happened
      if (error instanceof Error) {
        const errorMessage = error.message;

        if (errorMessage.includes("Network error")) {
          // This appears to be a network issue
          setNetworkError("Connection to Firebase failed. Please check your network connection.");
        } else if (errorMessage.includes("client is offline")) {
          // Firebase sometimes incorrectly reports "client is offline" when it's a connection issue
          setNetworkError("Error: Failed to connect to Firebase. Please retry in a few seconds.");
        } else {
          // Some other error occurred
          setNetworkError(`Error saving preferences: ${errorMessage}`);
        }
      }

      // Rethrow to allow component to handle
      throw error;
    }
  };

  // Check if user has completed preferences
  const hasCompletedPreferences = userData?.hasCompletedPreferences || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        networkError,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        signInWithFacebook,
        updatePreferences,
        hasCompletedPreferences,
        retryFetchUserData,
        resetNetworkConnection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
