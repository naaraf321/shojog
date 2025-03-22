"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Settings, Trophy } from "lucide-react";
import { MotionDiv } from "@/components/ui/framer-wrapper";
import { UserData } from "@/lib/userService";
import { User as FirebaseUser } from "firebase/auth";

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  coverPhoto: string;
}

interface ProfileHeaderProps {
  user: ProfileUser;
  userData?: UserData | null;
  statistics?: any;
}

export function ProfileHeader({ user, userData, statistics }: ProfileHeaderProps) {
  return (
    <MotionDiv initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* User Avatar with Animation */}
        <MotionDiv initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
          <Avatar className="h-24 w-24 border-4 border-primary/10 shadow-lg">
            <AvatarImage src={user.profilePicture || userData?.photoURL || ""} alt={userData?.name || user.name || ""} />
            <AvatarFallback className="text-3xl bg-primary/10">{(userData?.name || user.name || "User").charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </MotionDiv>

        <div className="flex-1 text-center md:text-left">
          {/* User Name and Badges */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
            <h1 className="text-2xl font-bold">{userData?.name || user.name || "User"}</h1>
            <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
              {userData?.level && (
                <MotionDiv initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  {userData.level}
                </MotionDiv>
              )}
              {userData?.institution && (
                <MotionDiv initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  {userData.institution}
                </MotionDiv>
              )}
            </div>
          </div>

          {/* User Info Details */}
          <div className="text-muted-foreground mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70">
                <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.8a2 2 0 0 0 1.4-.6L12 4.6a2 2 0 0 1 1.4-.6h5.8a2 2 0 0 1 2 2v2.4Z" />
                <path d="M8 13.5v.5" />
                <path d="M16 13.5v.5" />
                <path d="M12 13.5v.5" />
              </svg>
              {userData?.batch && <span>Batch: {userData.batch}</span>}
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Member since {new Date(userData?.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {userData?.group && <span>Group: {userData.group}</span>}
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 1 3 3 3h6c2 0 3-1 3-3v-5" />
              </svg>
              <span>{userData?.email || user.email}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center md:justify-start flex-wrap">
            <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </MotionDiv>
            <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </MotionDiv>
            <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="secondary" size="sm" className="gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
                Export Data
              </Button>
            </MotionDiv>
          </div>
        </div>

        {/* User Points and Rank Card */}
        <MotionDiv initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="min-w-36 rounded-lg bg-primary/5 p-4 text-center hidden md:block">
          <div className="text-4xl font-bold text-primary">{statistics.totalPoints}</div>
          <div className="text-sm text-muted-foreground">Total Points</div>
          <div className="mt-2 text-sm">
            <span className="font-medium">Rank #{statistics.rank}</span>
            <span className="text-muted-foreground"> (Top {statistics.rankPercentile}%)</span>
          </div>
          <div className="mt-3 pt-3 border-t border-primary/10">
            <div className="text-sm text-muted-foreground mb-1">Current streak</div>
            <div className="flex items-center justify-center gap-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{statistics.streakDays} days</span>
            </div>
          </div>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
}
