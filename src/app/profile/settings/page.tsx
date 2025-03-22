"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Check, KeyRound, Mail, User, Bell, Trash2, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { MotionDiv } from "@/components/ui/framer-wrapper";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updateEmail, updatePassword, sendEmailVerification, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import Link from "next/link";
import { updateProfile } from "firebase/auth";

// Profile information schema
const profileFormSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  institution: z.string().optional(),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
});

// Password change schema
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Account deletion schema
const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required to delete your account"),
  confirmation: z.literal("DELETE MY ACCOUNT", {
    errorMap: () => ({ message: "You must type DELETE MY ACCOUNT exactly" }),
  }),
});

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isEmailVerified, setIsEmailVerified] = useState(user?.emailVerified || false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    examReminders: true,
    forumActivity: true,
    pointsUpdates: true,
  });

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
      institution: "",
      bio: "",
    },
  });

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Delete account form
  const deleteAccountForm = useForm<z.infer<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
      confirmation: "" as any,
    },
  });

  // Handle profile form submission
  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    setProfileUpdateSuccess(false);

    try {
      // Update display name
      if (data.displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: data.displayName,
        });
      }

      // Update email
      if (data.email !== user.email) {
        await updateEmail(user, data.email);
        setIsEmailVerified(false);
      }

      // Additional profile data like institution and bio would be saved to Firestore
      // This would require a call to a user service function
      // await updateUserProfile(user.uid, { institution: data.institution, bio: data.bio });

      setProfileUpdateSuccess(true);
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password form submission
  const onPasswordSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    if (!user || !user.email) return;

    setIsLoading(true);
    setError(null);
    setPasswordUpdateSuccess(false);

    try {
      // Reauthenticate user first
      const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, data.newPassword);

      setPasswordUpdateSuccess(true);
      passwordForm.reset();
    } catch (err) {
      console.error("Error updating password:", err);
      if (err instanceof Error) {
        if ((err as any).code === "auth/wrong-password") {
          setError("Current password is incorrect");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle account deletion
  const onDeleteAccount = async (data: z.infer<typeof deleteAccountSchema>) => {
    if (!user || !user.email) return;

    setIsLoading(true);
    setError(null);

    try {
      // Reauthenticate user first
      const credential = EmailAuthProvider.credential(user.email, data.password);
      await reauthenticateWithCredential(user, credential);

      // Delete the user
      await deleteUser(user);

      // Sign out and redirect to home page
      await signOut();
      router.push("/");
    } catch (err) {
      console.error("Error deleting account:", err);
      if (err instanceof Error) {
        if ((err as any).code === "auth/wrong-password") {
          setError("Password is incorrect");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Send email verification
  const sendVerificationEmail = async () => {
    if (!user) return;

    try {
      await sendEmailVerification(user);
      setEmailVerificationSent(true);
    } catch (err) {
      console.error("Error sending verification email:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  // Handle notification preference changes
  const handleNotificationChange = (key: keyof typeof notificationPreferences) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    // Here you would save these preferences to your user profile in Firestore
    // await updateUserNotificationPreferences(user.uid, { [key]: !notificationPreferences[key] });
  };

  if (!user) {
    return (
      <div className="p-10 text-center">
        <p>Please log in to access your settings.</p>
        <Button className="mt-4" asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="container max-w-4xl py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild className="mr-2">
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Account Settings</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your profile information and email address.</CardDescription>
            </CardHeader>
            <CardContent>
              {profileUpdateSuccess && (
                <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Your profile has been updated successfully.</AlertDescription>
                </Alert>
              )}

              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input placeholder="Your institution" {...field} />
                        </FormControl>
                        <FormDescription>Where you study or work</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Input placeholder="A short bio about yourself" {...field} />
                        </FormControl>
                        <FormDescription>Max 160 characters</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center pt-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </form>
              </Form>

              <Separator className="my-8" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Verification
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">{isEmailVerified ? "Your email is verified." : "Verify your email to access all features."}</p>
                  </div>
                  <div className="flex items-center">
                    {isEmailVerified ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <Button size="sm" onClick={sendVerificationEmail} disabled={emailVerificationSent || isLoading}>
                        {emailVerificationSent ? "Email Sent" : "Verify Email"}
                      </Button>
                    )}
                  </div>
                </div>

                {emailVerificationSent && !isEmailVerified && (
                  <Alert className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Verification Email Sent</AlertTitle>
                    <AlertDescription>Please check your email and click the verification link. You may need to check your spam folder.</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Settings */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <KeyRound className="mr-2 h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your password to maintain account security.</CardDescription>
            </CardHeader>
            <CardContent>
              {passwordUpdateSuccess && (
                <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Your password has been updated successfully.</AlertDescription>
                </Alert>
              )}

              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>Must be at least 6 characters long</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center pt-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                  </div>
                  <Switch id="email-notifications" checked={notificationPreferences.emailNotifications} onCheckedChange={() => handleNotificationChange("emailNotifications")} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="exam-reminders">Exam Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get notified about upcoming exams and deadlines</p>
                  </div>
                  <Switch id="exam-reminders" checked={notificationPreferences.examReminders} onCheckedChange={() => handleNotificationChange("examReminders")} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="forum-activity">Forum Activity</Label>
                    <p className="text-sm text-muted-foreground">Receive updates on your forum posts and followed questions</p>
                  </div>
                  <Switch id="forum-activity" checked={notificationPreferences.forumActivity} onCheckedChange={() => handleNotificationChange("forumActivity")} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="points-updates">Points Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about your rank changes and points earned</p>
                  </div>
                  <Switch id="points-updates" checked={notificationPreferences.pointsUpdates} onCheckedChange={() => handleNotificationChange("pointsUpdates")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone */}
        <TabsContent value="danger">
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader className="text-red-700 dark:text-red-400">
              <CardTitle className="flex items-center">
                <Trash2 className="mr-2 h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-red-600/80 dark:text-red-400/80">Irreversible actions that will affect your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>Deleting your account is irreversible. All your data, including progress, scores, and activity will be permanently removed.</AlertDescription>
                </Alert>

                <Form {...deleteAccountForm}>
                  <form onSubmit={deleteAccountForm.handleSubmit(onDeleteAccount)} className="space-y-6">
                    <FormField
                      control={deleteAccountForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormDescription>Enter your current password to confirm</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={deleteAccountForm.control}
                      name="confirmation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmation</FormLabel>
                          <FormControl>
                            <Input placeholder="Type DELETE MY ACCOUNT" {...field} />
                          </FormControl>
                          <FormDescription>Type &quot;DELETE MY ACCOUNT&quot; to confirm</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center pt-2">
                      <Button type="submit" variant="destructive" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                        {isLoading ? "Processing..." : "Delete My Account"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MotionDiv>
  );
}
