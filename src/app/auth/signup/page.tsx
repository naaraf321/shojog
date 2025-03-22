import { SignUpForm } from "@/components/auth/SignUpForm";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 bg-card text-card-foreground p-8 rounded-lg shadow-md">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-6">
          ← Back to home
        </Link>

        <SignUpForm />

        <div className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
