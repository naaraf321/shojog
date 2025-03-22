"use client";

import { useEffect, useState } from "react";
import { Badge } from "./badge";

export function EnvironmentIndicator() {
  const [environment, setEnvironment] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client-side
    setEnvironment(process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV);
  }, []);

  if (!environment || environment === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge variant={environment === "staging" ? "destructive" : "secondary"} className="text-xs font-bold uppercase">
        {environment}
      </Badge>
    </div>
  );
}
