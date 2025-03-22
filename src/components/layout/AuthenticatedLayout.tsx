"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="min-h-screen flex-1 lg:ml-64 transition-all duration-300">
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
