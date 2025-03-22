import { ReactNode, useState, isValidElement, Children, cloneElement } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WidgetModal } from "./WidgetModal";

interface DashboardWidgetProps {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  action?: ReactNode;
  colSpan?: "default" | "wide" | "full";
  rowSpan?: "default" | "tall" | "full";
}

export function DashboardWidget({ title, children, isLoading = false, className, action, colSpan = "default", rowSpan = "default" }: DashboardWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Map the colSpan and rowSpan props to actual CSS classes
  const colSpanClasses = {
    default: "md:col-span-1",
    wide: "md:col-span-2",
    full: "md:col-span-3 xl:col-span-4",
  };

  const rowSpanClasses = {
    default: "md:row-span-1",
    tall: "md:row-span-2",
    full: "md:row-span-3",
  };

  // Toggle collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Toggle maximize state
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  // Function to render children with isMaximized prop
  const renderWithMaximizedProp = (children: ReactNode) => {
    return Children.map(children, (child) => {
      if (isValidElement(child) && typeof child.type !== "string") {
        return cloneElement(child, { isMaximized } as any);
      }
      return child;
    });
  };

  return (
    <>
      {/* Modal for maximized view */}
      <WidgetModal isOpen={isMaximized} onClose={toggleMaximize} title={title}>
        {renderWithMaximizedProp(children)}
      </WidgetModal>

      {/* Normal widget */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className={cn("bg-card border border-border rounded-lg shadow-sm transition-all", colSpanClasses[colSpan], rowSpanClasses[rowSpan], className)}
      >
        <div className="p-4 sm:p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="flex items-center gap-2">
              {action}
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleMaximize} title="Maximize">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleCollapse} title={isCollapsed ? "Expand" : "Collapse"}>
                {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Widget Content */}
          <motion.div animate={{ height: isCollapsed ? 0 : "auto", opacity: isCollapsed ? 0 : 1 }} transition={{ duration: 0.3 }} className="flex-1 overflow-hidden">
            {isLoading ? <div className="bg-accent/30 animate-pulse h-48 rounded-md"></div> : children}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
