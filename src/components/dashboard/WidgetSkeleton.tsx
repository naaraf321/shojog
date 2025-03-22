import { cn } from "@/lib/utils";

interface WidgetSkeletonProps {
  className?: string;
  type?: "chart" | "list" | "card";
}

export function WidgetSkeleton({ className, type = "chart" }: WidgetSkeletonProps) {
  return (
    <div className={cn("bg-card border border-border rounded-lg shadow-sm p-6", className)}>
      {/* Skeleton header */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-accent/30 animate-pulse h-7 w-1/3 rounded-md"></div>
        <div className="bg-accent/30 animate-pulse h-6 w-16 rounded-full"></div>
      </div>

      {/* Skeleton content based on type */}
      {type === "chart" && <div className="bg-accent/30 animate-pulse h-48 rounded-md"></div>}

      {type === "list" && (
        <div className="space-y-3">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="bg-accent/30 animate-pulse h-8 w-8 rounded-full"></div>
                <div className="flex-1">
                  <div className="bg-accent/30 animate-pulse h-5 w-full rounded-md mb-1"></div>
                  <div className="bg-accent/30 animate-pulse h-4 w-2/3 rounded-md"></div>
                </div>
              </div>
            ))}
        </div>
      )}

      {type === "card" && (
        <div className="space-y-4">
          <div className="bg-accent/30 animate-pulse h-20 rounded-md"></div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-accent/30 animate-pulse h-12 rounded-md"></div>
            <div className="bg-accent/30 animate-pulse h-12 rounded-md"></div>
          </div>
          <div className="bg-accent/30 animate-pulse h-8 w-1/2 rounded-md"></div>
        </div>
      )}
    </div>
  );
}
