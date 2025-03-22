import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootLayout as AppRootLayout } from "@/components/layout/RootLayout";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { EnvironmentIndicator } from "@/components/ui/environment-indicator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShudhuMCQ - Interactive MCQ Platform",
  description: "A platform for students to practice MCQs, take mock tests, and improve their skills",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AppRootLayout>{children}</AppRootLayout>
          <Toaster />
          <EnvironmentIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
