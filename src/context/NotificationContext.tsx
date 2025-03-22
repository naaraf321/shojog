"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, query, where, getDocs, orderBy, limit, onSnapshot, updateDoc, doc, serverTimestamp, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

// Define the notification type
export interface Notification {
  id: string;
  userId: string;
  type: "answer" | "comment" | "mention" | "follow" | "bestAnswer";
  text: string;
  read: boolean;
  createdAt: any;
  relatedId: string; // ID of the related item (question, answer, comment)
  triggeredBy: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  createNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => Promise<string>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Listen for notifications changes in real-time
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(50) // Limit to most recent 50 notifications
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notificationsList: Notification[] = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Notification)
        );

        setNotifications(notificationsList);
        setUnreadCount(notificationsList.filter((n) => !n.read).length);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to load notifications");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Mark a single notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, {
        read: true,
      });

      // Update local state
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)));
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to update notification");
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;

    try {
      const unreadNotifications = notifications.filter((n) => !n.read);

      // Update each notification in Firestore
      const updatePromises = unreadNotifications.map((n) => updateDoc(doc(db, "notifications", n.id), { read: true }));

      await Promise.all(updatePromises);

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);

      toast.success("Marked all notifications as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to update notifications");
    }
  };

  // Create a new notification
  const createNotification = async (notificationData: Omit<Notification, "id" | "createdAt" | "read">) => {
    try {
      const notification = {
        ...notificationData,
        read: false,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "notifications"), notification);
      return docRef.id;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw new Error("Failed to create notification");
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        createNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
