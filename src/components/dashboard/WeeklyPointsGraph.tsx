import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend } from "recharts";
import { MaximizableWidget } from "./MaximizableWidget";

// Type for daily points entry
type DailyPoints = {
  day: string; // Day of the week or date
  points: number;
  average?: number;
};

// Sample data for development
const sampleData: DailyPoints[] = [
  { day: "Mon", points: 120, average: 100 },
  { day: "Tue", points: 160, average: 105 },
  { day: "Wed", points: 90, average: 110 },
  { day: "Thu", points: 180, average: 115 },
  { day: "Fri", points: 200, average: 120 },
  { day: "Sat", points: 250, average: 125 },
  { day: "Sun", points: 190, average: 130 },
];

// Custom tooltip component for enhanced styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-2 rounded-md shadow-sm text-sm">
        <p className="font-semibold">{label}</p>
        <p className="text-primary font-mono">
          {payload[0].name}: {payload[0].value} pts
        </p>
        {payload[1] && (
          <p className="text-muted-foreground font-mono">
            {payload[1].name}: {payload[1].value} pts
          </p>
        )}
      </div>
    );
  }

  return null;
};

interface WeeklyPointsGraphProps {
  data?: DailyPoints[];
  isLoading?: boolean;
  isMaximized?: boolean;
}

export function WeeklyPointsGraph({ data = sampleData, isLoading = false, isMaximized = false }: WeeklyPointsGraphProps) {
  if (isLoading) {
    return (
      <MaximizableWidget isMaximized={isMaximized}>
        <div className="h-full bg-card border border-border rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Points</h2>
          <div className="bg-accent/30 animate-pulse h-48 rounded-md"></div>
        </div>
      </MaximizableWidget>
    );
  }

  // Calculate the highest point value for the y-axis domain
  const maxPoints = Math.max(...data.map((item) => item.points)) * 1.2;

  return (
    <MaximizableWidget isMaximized={isMaximized}>
      <div className="h-full bg-card border border-border rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Weekly Points</h2>
          <Badge variant="outline" className="hover:bg-primary/10 transition-colors cursor-pointer">
            Last 7 Days
          </Badge>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={isMaximized ? "h-[70vh]" : "h-48"}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: isMaximized ? 0 : -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis dataKey="day" tick={{ fontSize: isMaximized ? 14 : 12 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
              <YAxis tick={{ fontSize: isMaximized ? 14 : 12 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} domain={[0, maxPoints]} tickFormatter={(value) => value.toLocaleString()} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={data.reduce((acc, curr) => acc + curr.points, 0) / data.length}
                stroke="var(--muted-foreground)"
                strokeDasharray="3 3"
                label={{
                  value: "Avg",
                  position: "insideBottomRight",
                  fill: "var(--muted-foreground)",
                  fontSize: isMaximized ? 12 : 10,
                }}
              />
              <Line
                type="monotone"
                dataKey="points"
                name="Your Points"
                stroke="var(--primary)"
                strokeWidth={isMaximized ? 3 : 2.5}
                dot={{
                  r: isMaximized ? 5 : 4,
                  fill: "var(--primary)",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: isMaximized ? 8 : 6,
                  fill: "var(--primary)",
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
                animationDuration={1500}
              />
              <Line type="monotone" dataKey="average" name="Community Avg" stroke="var(--muted-foreground)" strokeWidth={isMaximized ? 2 : 1.5} strokeDasharray="5 5" dot={false} animationDuration={1500} />
              {isMaximized && <Legend verticalAlign="bottom" height={36} />}
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </MaximizableWidget>
  );
}
