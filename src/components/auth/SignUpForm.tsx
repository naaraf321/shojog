"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Facebook, Mail } from "lucide-react";
import { FirebaseError } from "firebase/app";
import Image from "next/image";
import Link from "next/link";

// Define form schema
const signUpSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }).regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" }).regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const { signUp, signInWithGoogle, signInWithFacebook } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle email/password sign up
  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await signUp(data.email, data.password);
      router.push("/auth/preferences");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setError("This email address is already in use");
            break;
          case "auth/invalid-email":
            setError("Invalid email address");
            break;
          default:
            setError("An error occurred during sign up. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      router.push("/auth/preferences");
    } catch (error) {
      console.error("Google sign-in error:", error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/popup-closed-by-user":
            setError("Sign in was cancelled. Please try again.");
            break;
          case "auth/popup-blocked":
            setError("Pop-up was blocked by your browser. Please allow pop-ups for this site.");
            break;
          case "auth/cancelled-popup-request":
            setError("Sign in was cancelled. Please try again.");
            break;
          case "auth/unauthorized-domain":
            setError("This domain is not authorized for OAuth operations. Please contact support.");
            break;
          default:
            setError(`Google sign-in failed: ${error.message}`);
        }
      } else {
        setError("Could not sign in with Google. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Facebook sign in
  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithFacebook();
      router.push("/auth/preferences");
    } catch (error) {
      setError("Could not sign in with Facebook. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">Enter your details to create your account</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none">
            Email
          </label>
          <Input id="email" type="email" placeholder="name@example.com" autoComplete="email" disabled={isLoading} {...register("email")} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium leading-none">
            Password
          </label>
          <Input id="password" type="password" placeholder="••••••••" autoComplete="new-password" disabled={isLoading} {...register("password")} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
            Confirm Password
          </label>
          <Input id="confirmPassword" type="password" placeholder="••••••••" autoComplete="new-password" disabled={isLoading} {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
          <div className="mr-2 h-4 w-4 relative">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5453 6.54545H8.00001V9.63636H12.3273C12 11.5999 10.3636 12.7273 8.00001 12.7273C5.09093 12.7273 2.90911 10.5455 2.90911 7.63636C2.90911 4.72727 5.09093 2.54545 8.00001 2.54545C9.30911 2.54545 10.4727 3.00909 11.3455 3.78181L13.6727 1.45454C12.1455 0.0909086 10.2091 -0.363637 8.00001 -0.363637C3.44547 -0.363637 -0.363617 3.44545 -0.363617 7.99999C-0.363617 12.5545 3.44547 16.3636 8.00001 16.3636C12.1455 16.3636 15.8182 13.4545 15.8182 7.99999C15.8182 7.49999 15.6364 6.99999 15.5453 6.54545Z" fill="#FFC107" />
              <path d="M0.726379 4.21818L3.41821 6.22727C4.14549 4.12727 5.92731 2.54545 7.99998 2.54545C9.30908 2.54545 10.4727 3.00909 11.3455 3.78182L13.6727 1.45455C12.1455 0.0909086 10.2091 -0.363637 7.99998 -0.363637C4.85455 -0.363637 2.12731 1.5 0.726379 4.21818Z" fill="#FF3D00" />
              <path d="M8.00003 16.3636C10.1455 16.3636 12.0364 15.9455 13.5273 14.6636L11.0001 12.5C10.1455 13.0909 9.14549 13.4545 8.00003 13.4545C5.65457 13.4545 3.65457 12.3273 2.69094 10.4C2.6727 10.3636 2.6545 10.3273 2.63634 10.2909L0.109589 12.3818C1.47277 14.7455 4.47277 16.3636 8.00003 16.3636Z" fill="#4CAF50" />
              <path d="M15.5455 6.54545H8.00003V9.63636H12.3273C11.6727 10.9091 10.6364 11.7818 9.38185 12.3636L9.38194 12.3635L11.8547 14.5C11.6364 14.7 15.8182 11.9 15.8182 8C15.8182 7.5 15.6364 7 15.5455 6.54545Z" fill="#1976D2" />
            </svg>
          </div>
          Google
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={handleFacebookSignIn} disabled={isLoading}>
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/signin" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
