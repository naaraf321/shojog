"use client";

import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { WeeklyLeaderboard } from "@/components/dashboard/WeeklyLeaderboard";
import { WeeklyPointsGraph } from "@/components/dashboard/WeeklyPointsGraph";
import { ExamAccuracyChart } from "@/components/dashboard/ExamAccuracyChart";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { WidgetSkeleton } from "@/components/dashboard/WidgetSkeleton";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Settings, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Definition of widgets with initial order
  const [widgets, setWidgets] = useState([
    { id: "weeklyPoints", span: "wide", type: "chart" },
    { id: "weeklyLeaderboard", span: "default", type: "list" },
    { id: "examAccuracy", span: "default", type: "chart" },
  ]);

  // Simulate data loading
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setIsLoadingData(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      redirect("/auth/signin");
    }
  }, [user, loading]);

  // Function to toggle customization mode
  const toggleCustomization = () => {
    setIsCustomizing(!isCustomizing);
  };

  // Function to reorder widgets
  const moveWidget = (id: string, direction: "up" | "down") => {
    const currentIndex = widgets.findIndex((widget) => widget.id === id);
    if (direction === "up" && currentIndex > 0) {
      const newWidgets = [...widgets];
      [newWidgets[currentIndex], newWidgets[currentIndex - 1]] = [newWidgets[currentIndex - 1], newWidgets[currentIndex]];
      setWidgets(newWidgets);
    } else if (direction === "down" && currentIndex < widgets.length - 1) {
      const newWidgets = [...widgets];
      [newWidgets[currentIndex], newWidgets[currentIndex + 1]] = [newWidgets[currentIndex + 1], newWidgets[currentIndex]];
      setWidgets(newWidgets);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render widget based on its ID
  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case "weeklyPoints":
        return <WeeklyPointsGraph isLoading={isLoadingData} />;
      case "weeklyLeaderboard":
        return <WeeklyLeaderboard isLoading={isLoadingData} />;
      case "examAccuracy":
        return <ExamAccuracyChart isLoading={isLoadingData} />;
      default:
        return null;
    }
  };

  // Determine widget title based on ID
  const getWidgetTitle = (widgetId: string) => {
    switch (widgetId) {
      case "weeklyPoints":
        return "Weekly Points";
      case "weeklyLeaderboard":
        return "Weekly Leaderboard";
      case "examAccuracy":
        return "Exam Accuracy";
      default:
        return "Widget";
    }
  };

  // Get customization actions for a widget
  const getWidgetActions = (widgetId: string, index: number) => {
    if (!isCustomizing) return null;

    return (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={index === 0} onClick={() => moveWidget(widgetId, "up")}>
          <ArrowDownUp className="h-4 w-4 rotate-180" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={index === widgets.length - 1} onClick={() => moveWidget(widgetId, "down")}>
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <AuthenticatedLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant={isCustomizing ? "default" : "outline"} size="sm" onClick={toggleCustomization} className="gap-2">
          <Settings className="h-4 w-4" />
          {isCustomizing ? "Done" : "Customize"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
        {isLoadingData ? (
          // Display skeletons when loading
          <>
            <WidgetSkeleton className="md:col-span-2" type="chart" />
            <WidgetSkeleton type="list" />
            <WidgetSkeleton type="chart" />
          </>
        ) : (
          // Display actual widgets
          <>
            {widgets.map((widget, index) => (
              <motion.div
                key={widget.id}
                layout
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className={widget.span === "wide" ? "md:col-span-2" : "md:col-span-1"}
              >
                <DashboardWidget title={getWidgetTitle(widget.id)} colSpan={widget.span === "wide" ? "wide" : "default"} action={getWidgetActions(widget.id, index)}>
                  {renderWidget(widget.id)}
                </DashboardWidget>
              </motion.div>
            ))}
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
