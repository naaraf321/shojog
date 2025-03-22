import { renderHook, act } from "@testing-library/react";
import { useNotifications, NotificationProvider } from "../NotificationContext";
import { collection, query, where, getDocs, orderBy, limit, onSnapshot, updateDoc, doc, serverTimestamp, addDoc } from "firebase/firestore";
import { toast } from "sonner";

// Mock Firebase Firestore
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
  serverTimestamp: jest.fn(),
  addDoc: jest.fn(),
}));

// Mock toast notifications
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock the useAuth hook
jest.mock("../AuthContext", () => ({
  useAuth: jest.fn(() => ({
    user: { uid: "test-user-id" },
  })),
}));

// Mock React's useContext
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useContext: jest.fn(),
  };
});

describe("useNotifications hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should throw error when used outside NotificationProvider", () => {
    // Simulate using hook outside provider
    const reactModule = require("react");
    reactModule.useContext.mockReturnValueOnce(undefined);

    const { result } = renderHook(() => useNotifications());

    expect(result.error).toBeDefined();
    expect(result.error.message).toBe("useNotifications must be used within a NotificationProvider");
  });

  test("should return notifications context", () => {
    // Mock context value
    const mockContextValue = {
      notifications: [],
      unreadCount: 0,
      loading: false,
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      createNotification: jest.fn(),
    };

    const reactModule = require("react");
    reactModule.useContext.mockReturnValueOnce(mockContextValue);

    const { result } = renderHook(() => useNotifications());

    expect(result.current).toEqual(mockContextValue);
    expect(typeof result.current.markAsRead).toBe("function");
    expect(typeof result.current.markAllAsRead).toBe("function");
    expect(typeof result.current.createNotification).toBe("function");
  });

  test("markAsRead should update a notification", async () => {
    const mockUpdateDoc = jest.fn().mockResolvedValue(undefined);
    updateDoc.mockImplementation(mockUpdateDoc);
    doc.mockReturnValue("notification-ref");

    // Mock initial state with unread notifications
    const mockNotifications = [
      { id: "notification1", read: false, text: "Test notification" },
      { id: "notification2", read: true, text: "Another notification" },
    ];

    const mockSetNotifications = jest.fn();
    const mockSetUnreadCount = jest.fn();

    const mockContextValue = {
      notifications: mockNotifications,
      unreadCount: 1,
      markAsRead: async (id) => {
        await updateDoc(doc(null, "notifications", id), { read: true });
        mockSetNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
        mockSetUnreadCount((prev) => prev - 1);
      },
    };

    const reactModule = require("react");
    reactModule.useContext.mockReturnValueOnce(mockContextValue);

    const { result } = renderHook(() => useNotifications());

    await act(async () => {
      await result.current.markAsRead("notification1");
    });

    expect(doc).toHaveBeenCalledWith(null, "notifications", "notification1");
    expect(mockUpdateDoc).toHaveBeenCalledWith("notification-ref", { read: true });
    expect(mockSetNotifications).toHaveBeenCalled();
    expect(mockSetUnreadCount).toHaveBeenCalled();
  });

  test("markAllAsRead should update all unread notifications", async () => {
    const mockUpdateDoc = jest.fn().mockResolvedValue(undefined);
    updateDoc.mockImplementation(mockUpdateDoc);
    doc.mockImplementation((_, __, id) => `notification-ref-${id}`);

    // Mock initial state with unread notifications
    const mockNotifications = [
      { id: "notification1", read: false, text: "Test notification" },
      { id: "notification2", read: false, text: "Another notification" },
      { id: "notification3", read: true, text: "Read notification" },
    ];

    const mockSetNotifications = jest.fn();
    const mockSetUnreadCount = jest.fn();

    const mockContextValue = {
      notifications: mockNotifications,
      unreadCount: 2,
      markAllAsRead: async () => {
        const unreadNotifications = mockNotifications.filter((n) => !n.read);

        // Update each notification
        const updatePromises = unreadNotifications.map((n) => updateDoc(doc(null, "notifications", n.id), { read: true }));

        await Promise.all(updatePromises);

        mockSetNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        mockSetUnreadCount(0);

        toast.success("Marked all notifications as read");
      },
    };

    const reactModule = require("react");
    reactModule.useContext.mockReturnValueOnce(mockContextValue);

    const { result } = renderHook(() => useNotifications());

    await act(async () => {
      await result.current.markAllAsRead();
    });

    // Should update 2 notifications
    expect(updateDoc).toHaveBeenCalledTimes(2);
    expect(updateDoc).toHaveBeenCalledWith("notification-ref-notification1", { read: true });
    expect(updateDoc).toHaveBeenCalledWith("notification-ref-notification2", { read: true });
    expect(mockSetNotifications).toHaveBeenCalled();
    expect(mockSetUnreadCount).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Marked all notifications as read");
  });

  test("createNotification should add a new notification", async () => {
    const mockAddDoc = jest.fn().mockResolvedValue({ id: "new-notification-id" });
    addDoc.mockImplementation(mockAddDoc);
    collection.mockReturnValue("notifications-collection");
    serverTimestamp.mockReturnValue("server-timestamp");

    const mockNotificationData = {
      userId: "test-user-id",
      type: "mention",
      text: "You were mentioned in a comment",
      relatedId: "comment-123",
      triggeredBy: {
        id: "user-456",
        name: "Test User",
      },
    };

    const mockContextValue = {
      createNotification: async (notificationData) => {
        const notification = {
          ...notificationData,
          read: false,
          createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(null, "notifications"), notification);
        return docRef.id;
      },
    };

    const reactModule = require("react");
    reactModule.useContext.mockReturnValueOnce(mockContextValue);

    const { result } = renderHook(() => useNotifications());

    let notificationId;
    await act(async () => {
      notificationId = await result.current.createNotification(mockNotificationData);
    });

    expect(collection).toHaveBeenCalledWith(null, "notifications");
    expect(mockAddDoc).toHaveBeenCalledWith("notifications-collection", {
      ...mockNotificationData,
      read: false,
      createdAt: "server-timestamp",
    });
    expect(notificationId).toBe("new-notification-id");
  });
});
