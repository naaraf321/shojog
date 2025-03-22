import { SignInForm } from "@/components/auth/SignInForm";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 bg-card text-card-foreground p-8 rounded-lg shadow-md">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-6">
          ← Back to home
        </Link>

        <SignInForm />
      </div>
    </div>
  );
}
