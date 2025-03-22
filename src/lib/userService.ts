import { User } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, enableNetwork, query, where, limit, getDocs, DocumentData } from "firebase/firestore";
import { db, usersCollection } from "./firebase";

// User preference types
export interface UserPreferences {
  name?: string;
  institution?: string;
  level?: string; // School, High School, College, Admission
  group?: string;
  batch?: string;
  photoURL?: string;
}

export interface UserData extends UserPreferences {
  uid: string;
  email: string;
  createdAt: number;
  updatedAt: number;
  hasCompletedPreferences: boolean;
}

// Cache for user data to use as fallback
const userDataCache = new Map<string, UserData>();

// Create a new user document in Firestore
export const createUserDocument = async (user: User): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);

    // Only create if user doesn't exist
    if (!userSnapshot.exists()) {
      const userData: UserData = {
        uid: user.uid,
        email: user.email || "",
        photoURL: user.photoURL || "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        hasCompletedPreferences: false,
      };

      await setDoc(userDocRef, userData);
    }
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    // Enable network connection for this operation
    try {
      await enableNetwork(db);
    } catch (enableError) {
      console.log("Note: enableNetwork not available in this context:", enableError);
    }

    // Try to get the document
    const userDocRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as UserData;
      // Update cache for future fallback
      userDataCache.set(uid, userData);
      return userData;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);

    // Check if we have cached data we can return in emergency
    if (userDataCache.has(uid)) {
      console.log("Using cached user data as fallback");
      return userDataCache.get(uid) || null;
    }

    // Add more specific error handling for the "client is offline" error
    if (error instanceof Error) {
      const errorMessage = error.message;
      const isActuallyOffline = typeof navigator !== "undefined" && !navigator.onLine;

      // Distinguish between actual offline status and Firebase's mistaken offline report
      if (errorMessage.includes("client is offline")) {
        console.warn("Firebase reports offline but we'll try another approach");

        // If Firebase thinks we're offline but browser says we're online, use a hack approach
        if (!isActuallyOffline) {
          try {
            // Create a fresh doc reference and try again
            console.log("Retrying with fresh document reference...");
            const freshDocRef = doc(db, "users", uid);
            // We use a direct await here, not Promise-chaining to avoid potential error swallowing
            const retrySnapshot = await getDoc(freshDocRef);

            if (retrySnapshot.exists()) {
              console.log("Retry successful using fresh document reference");
              const userData = retrySnapshot.data() as UserData;
              userDataCache.set(uid, userData);
              return userData;
            }
            return null;
          } catch (retryError) {
            console.error("All retrieval approaches failed:", retryError);

            // LAST RESORT: Return empty user data shell to prevent blocking the UI
            if (!isActuallyOffline) {
              console.warn("Using EMERGENCY user data shell to prevent blocking");
              return {
                uid,
                email: "",
                createdAt: Date.now(),
                updatedAt: Date.now(),
                hasCompletedPreferences: false,
              };
            }

            // Don't repeat the misleading error message
            throw new Error("Temporary connection issue. Please try again.");
          }
        }
      }
    }

    // Use more descriptive error
    if (typeof navigator !== "undefined" && navigator.onLine) {
      throw new Error("Unable to connect to database. Please try again later.");
    } else {
      throw new Error("You are offline. Please check your internet connection.");
    }
  }
};

// Update user preferences in Firestore
export const updateUserPreferences = async (uid: string, preferences: UserPreferences): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", uid);

    // First check if document exists
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(userDocRef, {
        ...preferences,
        hasCompletedPreferences: true,
        updatedAt: Date.now(),
      });
    } else {
      // Create new document if it doesn't exist
      await setDoc(userDocRef, {
        uid,
        ...preferences,
        hasCompletedPreferences: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        email: "", // This will be updated later
      });
    }

    // Successfully updated
    console.log("User preferences updated successfully");
  } catch (error) {
    console.error("Error updating user preferences:", error);

    // More specific error handling for network issues
    if (error instanceof Error) {
      const errorCode = (error as any).code;
      const errorMessage = error.message || "";

      // Log extended error info for debugging
      console.error("Error details:", { code: errorCode, message: errorMessage });

      // Check for specific network-related errors only
      if (errorCode === "unavailable" || errorCode === "failed-precondition" || errorMessage.includes("network error") || errorMessage.includes("disconnected") || (errorMessage.includes("client is offline") && !navigator.onLine)) {
        console.warn("Network issue detected during preference update");
        throw new Error("Network error: Unable to connect to Firebase");
      }
    }

    // Rethrow the original error for other cases
    throw error;
  }
};

// Search for users by name prefix for @mentions
export const searchUsersByName = async (namePrefix: string, limitCount: number = 5): Promise<{ id: string; name: string; avatar?: string }[]> => {
  if (!namePrefix || namePrefix.length < 2) {
    return [];
  }

  try {
    // Convert prefix to lowercase for case-insensitive search
    const lowercasePrefix = namePrefix.toLowerCase();

    // Create query with where clauses
    const usersQuery = query(usersCollection, where("name", ">=", lowercasePrefix), where("name", "<=", lowercasePrefix + "\uf8ff"), limit(limitCount));

    const querySnapshot = await getDocs(usersQuery);

    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map((doc) => {
      const userData = doc.data() as UserData;
      return {
        id: doc.id,
        name: userData.name || "Anonymous",
        avatar: userData.photoURL,
      };
    });
  } catch (error) {
    console.error("Error searching for users:", error);
    return [];
  }
};

/**
 * Fetches user profile data based on user ID
 * @param userId - The ID of the user to fetch profile for
 * @returns The user profile data
 */
export const getUserProfile = async (userId: string) => {
  try {
    // Currently using the core user data service
    const userData = await getUserData(userId);

    // Transform the data as needed for profile use
    return {
      ...userData,
      // Add any profile-specific transformations here
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
