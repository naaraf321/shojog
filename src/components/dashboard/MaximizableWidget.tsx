import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MaximizableWidgetProps {
  children: ReactNode;
  isMaximized?: boolean;
  className?: string;
}

export function MaximizableWidget({ children, isMaximized = false, className }: MaximizableWidgetProps) {
  return (
    <div
      className={cn(
        isMaximized
          ? "w-full h-full" // Full size when maximized
          : "", // Default size when in normal view
        className
      )}
    >
      {children}
    </div>
  );
}
