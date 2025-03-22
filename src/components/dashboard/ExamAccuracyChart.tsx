import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Types for accuracy data
type AccuracyData = {
  name: string;
  value: number;
  color: string;
};

// Sample data for development
const sampleData: AccuracyData[] = [
  { name: "Correct", value: 65, color: "#10b981" }, // Green
  { name: "Wrong", value: 25, color: "#ef4444" }, // Red
  { name: "Skipped", value: 10, color: "#f59e0b" }, // Yellow/Amber
];

// Custom tooltip component for enhanced styling
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-2 rounded-md shadow-sm text-sm">
        <p className="font-semibold" style={{ color: payload[0].payload.color }}>
          {payload[0].name}
        </p>
        <p className="font-mono">
          {payload[0].value}% ({Math.round(payload[0].value * 0.3)} questions)
        </p>
      </div>
    );
  }
  return null;
};

// Custom Legend component
const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex justify-center gap-4 text-xs mt-2">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: entry.color }} />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

interface ExamAccuracyChartProps {
  data?: AccuracyData[];
  isLoading?: boolean;
}

export function ExamAccuracyChart({ data = sampleData, isLoading = false }: ExamAccuracyChartProps) {
  // Calculate total percentage for center display
  const correctPercentage = data.find((item) => item.name === "Correct")?.value || 0;

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Exam Accuracy</h2>
        <div className="bg-accent/30 animate-pulse h-48 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Exam Accuracy</h2>
        <Badge variant="outline" className="hover:bg-primary/10 transition-colors cursor-pointer">
          Last 30 Days
        </Badge>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270} animationDuration={1500}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center percentage text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold">{correctPercentage}%</span>
          <span className="text-xs text-muted-foreground">Accuracy</span>
        </div>
      </motion.div>
    </div>
  );
}
