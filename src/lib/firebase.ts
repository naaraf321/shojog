import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, collection, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED, connectFirestoreEmulator, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, setLogLevel, query, limit, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Enable detailed error logging for Firebase in development
if (process.env.NODE_ENV === "development") {
  setLogLevel("debug");
}

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase config
const validateFirebaseConfig = () => {
  const requiredFields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];

  const missingFields = requiredFields.filter((field) => !firebaseConfig[field as keyof typeof firebaseConfig]);

  if (missingFields.length > 0) {
    console.error(`Missing Firebase configuration: ${missingFields.join(", ")}`);
    console.error("Please check your environment variables");
    return false;
  }

  // Check if running on localhost - common cause of auth domain issues
  if (typeof window !== "undefined") {
    const currentDomain = window.location.hostname;
    console.log(`Current domain: ${currentDomain}`);

    if (currentDomain !== "localhost" && !firebaseConfig.authDomain?.includes(currentDomain)) {
      console.warn(`Warning: Current domain (${currentDomain}) might not be authorized in Firebase. Check Firebase Console > Authentication > Settings > Authorized domains`);
    }
  }

  return true;
};

// Only initialize if config is valid
const isConfigValid = validateFirebaseConfig();
if (isConfigValid) {
  console.log("Firebase configuration looks valid");
} else {
  console.error("Invalid Firebase configuration. Some features may not work correctly");
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Initialize Firestore with offline persistence and auto reconnect
const db =
  typeof window !== "undefined"
    ? initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      })
    : getFirestore(app);

// Explicitly enable network for Firestore to fix "client is offline" errors
if (typeof window !== "undefined") {
  // Import the enableNetwork function dynamically to avoid SSR issues
  import("firebase/firestore")
    .then(({ enableNetwork }) => {
      // Add a delay before enabling network to ensure initialization completes
      setTimeout(async () => {
        try {
          await enableNetwork(db);
          console.log("Firestore network explicitly enabled");
        } catch (error) {
          console.error("Failed to enable Firestore network:", error);
        }
      }, 1000);
    })
    .catch((err) => {
      console.error("Error importing enableNetwork:", err);
    });
}

const storage = getStorage(app);

// Use Auth emulator for local development if configured
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" && typeof window !== "undefined" && window.location.hostname === "localhost") {
  console.log("Using Firebase Auth emulator");
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}

// Log Firebase status for debugging
console.log("🔥 Firebase initialized:", {
  appInitialized: !!app,
  authInitialized: !!auth,
  dbInitialized: !!db,
  storageInitialized: !!storage,
  usingEmulator: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true",
});

// Collection references
const usersCollection = collection(db, "users");

// Helper function to check Firebase connection status
export const checkFirebaseConnection = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;

  // First check if browser is online
  if (!navigator.onLine) {
    console.warn("Browser reports offline status");
    return false;
  }

  try {
    // Try to get a single document from any collection to test connectivity
    const testQuery = query(collection(db, "users"), limit(1));
    await getDocs(testQuery);
    console.log("✅ Firebase connection test succeeded");
    return true;
  } catch (error) {
    console.error("❌ Firebase connection test failed:", error);

    // Try once more after a delay
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const retryQuery = query(collection(db, "users"), limit(1));
      await getDocs(retryQuery);
      console.log("✅ Firebase connection retry succeeded");
      return true;
    } catch (retryError) {
      console.error("❌ Firebase connection retry also failed:", retryError);
      return false;
    }
  }
};

export { app, auth, db, storage, usersCollection };
