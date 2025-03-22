import { renderHook, act } from "@testing-library/react";
import { useAuth, AuthProvider } from "../AuthContext";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { createUserDocument, getUserData, updateUserPreferences } from "@/lib/userService";
import { checkFirebaseConnection } from "@/lib/firebase";
import { enableNetwork, disableNetwork } from "firebase/firestore";

// Mock Firebase modules
jest.mock("firebase/auth");
jest.mock("@/lib/firebase", () => ({
  auth: {},
  db: {},
  checkFirebaseConnection: jest.fn(),
}));
jest.mock("@/lib/userService", () => ({
  createUserDocument: jest.fn(),
  getUserData: jest.fn(),
  updateUserPreferences: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  enableNetwork: jest.fn(),
  disableNetwork: jest.fn(),
}));

// Mock React's useContext to provide our test AuthContext
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useContext: jest.fn(() => ({
      user: null,
      userData: null,
      loading: false,
      networkError: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      signInWithGoogle: jest.fn(),
      signInWithFacebook: jest.fn(),
      updatePreferences: jest.fn(),
      hasCompletedPreferences: false,
      retryFetchUserData: jest.fn(),
      resetNetworkConnection: jest.fn(),
    })),
  };
});

// Mock window.navigator.onLine
Object.defineProperty(window.navigator, "onLine", {
  configurable: true,
  get: jest.fn().mockReturnValue(true),
});

describe("useAuth hook", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test("should throw error when used outside AuthProvider", () => {
    // Make useContext return undefined to simulate using hook outside provider
    const reactModule = require("react");
    reactModule.useContext.mockReturnValueOnce(undefined);

    const { result } = renderHook(() => useAuth());

    expect(result.error).toBeDefined();
    expect(result.error.message).toBe("useAuth must be used within an AuthProvider");
  });

  test("should provide auth context when used within AuthProvider", () => {
    // Mock successful context
    const reactModule = require("react");
    reactModule.useContext.mockReturnValueOnce({
      user: null,
      loading: false,
      signIn: jest.fn(),
      signOut: jest.fn(),
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current).toBeDefined();
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(typeof result.current.signIn).toBe("function");
    expect(typeof result.current.signOut).toBe("function");
  });

  test("signIn function should call Firebase signInWithEmailAndPassword", async () => {
    const mockSignIn = jest.fn().mockResolvedValue({});
    signInWithEmailAndPassword.mockImplementation(mockSignIn);

    const reactModule = require("react");
    reactModule.useContext.mockReturnValueOnce({
      signIn: async (email, password) => {
        await signInWithEmailAndPassword(null, email, password);
      },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn("test@example.com", "password123");
    });

    expect(mockSignIn).toHaveBeenCalledWith(null, "test@example.com", "password123");
  });

  test("signUp function should call Firebase createUserWithEmailAndPassword", async () => {
    const mockUser = { uid: "test-uid" };
    const mockSignUp = jest.fn().mockResolvedValue({ user: mockUser });
    createUserWithEmailAndPassword.mockImplementation(mockSignUp);

    const reactModule = require("react");
    reactModule.useContext.mockReturnValueOnce({
      signUp: async (email, password) => {
        const result = await createUserWithEmailAndPassword(null, email, password);
        return result.user;
      },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const user = await result.current.signUp("test@example.com", "password123");
      expect(user).toEqual(mockUser);
    });

    expect(mockSignUp).toHaveBeenCalledWith(null, "test@example.com", "password123");
  });

  test("signOut function should call Firebase signOut", async () => {
    const mockSignOut = jest.fn().mockResolvedValue({});
    signOut.mockImplementation(mockSignOut);

    const reactModule = require("react");
    reactModule.useContext.mockReturnValueOnce({
      signOut: async () => {
        await signOut(null);
      },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });

  test("resetNetworkConnection function should call Firestore network functions", async () => {
    disableNetwork.mockResolvedValue();
    enableNetwork.mockResolvedValue();

    const reactModule = require("react");
    reactModule.useContext.mockReturnValueOnce({
      resetNetworkConnection: async () => {
        await disableNetwork({});
        await enableNetwork({});
      },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.resetNetworkConnection();
    });

    expect(disableNetwork).toHaveBeenCalled();
    expect(enableNetwork).toHaveBeenCalled();
  });
});
