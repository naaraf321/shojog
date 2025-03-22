"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "./button";
import { useNotifications, Notification } from "@/context/NotificationContext";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Separator } from "./separator";
import { Badge } from "./badge";

export default function NotificationDropdown() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNotificationClick = async (notification: Notification) => {
    // Mark notification as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "answer":
      case "comment":
      case "bestAnswer":
        router.push(`/doubts/${notification.relatedId}`);
        break;
      case "mention":
        router.push(`/doubts/${notification.relatedId}`);
        break;
      case "follow":
        router.push(`/doubts/${notification.relatedId}`);
        break;
      default:
        break;
    }

    // Close dropdown
    setIsOpen(false);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "answer":
        return "💬";
      case "comment":
        return "💭";
      case "mention":
        return "🔖";
      case "follow":
        return "👁️";
      case "bestAnswer":
        return "🏆";
      default:
        return "📣";
    }
  };

  return (
    <div className="relative">
      {/* Bell icon with badge */}
      <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon" aria-label="Notifications" className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto bg-background border rounded-md shadow-lg z-50">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-semibold text-base">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0} className="text-xs">
                Mark all as read
              </Button>
            </div>

            {loading ? (
              <div className="p-4 text-center text-muted-foreground">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <p>You have no notifications</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div key={notification.id} onClick={() => handleNotificationClick(notification)} className={`p-3 cursor-pointer hover:bg-accent transition-colors duration-200 ${!notification.read ? "bg-accent/50" : ""}`}>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 text-lg">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm line-clamp-2">{notification.text}</p>
                          {!notification.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>}
                        </div>
                        <div className="flex items-center mt-1 gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={notification.triggeredBy.avatar} />
                            <AvatarFallback className="text-[10px]">{notification.triggeredBy.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{notification.triggeredBy.name}</span>
                          <span className="text-xs text-muted-foreground">{notification.createdAt && formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    <Separator className="mt-3" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
