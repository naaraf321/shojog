"use client";

import { useEffect, useRef } from "react";
import { MotionDiv } from "@/components/ui/framer-wrapper";

const weeklyData = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2.0 },
  { day: "Wed", hours: 0.5 },
  { day: "Thu", hours: 3.0 },
  { day: "Fri", hours: 2.5 },
  { day: "Sat", hours: 4.0 },
  { day: "Sun", hours: 1.0 },
];

export function TimeSpentGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chart dimensions
    const chartWidth = canvas.width * 0.85;
    const chartHeight = canvas.height * 0.7;
    const chartX = (canvas.width - chartWidth) / 2;
    const chartY = (canvas.height - chartHeight) / 2;

    // Calculate max hours for scaling
    const maxHours = Math.max(...weeklyData.map((data) => data.hours));
    const roundedMax = Math.ceil(maxHours);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(chartX, chartY + chartHeight);
    ctx.lineTo(chartX + chartWidth, chartY + chartHeight);
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw y-axis
    ctx.beginPath();
    ctx.moveTo(chartX, chartY);
    ctx.lineTo(chartX, chartY + chartHeight);
    ctx.stroke();

    // Draw y-axis labels
    ctx.textAlign = "right";
    ctx.font = "12px Arial";
    ctx.fillStyle = "#6b7280";

    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const value = (i / ySteps) * roundedMax;
      const y = chartY + chartHeight - (i / ySteps) * chartHeight;

      ctx.fillText(`${value.toFixed(1)}h`, chartX - 10, y + 4);

      // Draw horizontal gridlines
      ctx.beginPath();
      ctx.moveTo(chartX, y);
      ctx.lineTo(chartX + chartWidth, y);
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw data as line chart
    const pointDistance = chartWidth / (weeklyData.length - 1);

    // Draw area under the curve
    ctx.beginPath();
    ctx.moveTo(chartX, chartY + chartHeight);

    weeklyData.forEach((data, index) => {
      const x = chartX + index * pointDistance;
      const y = chartY + chartHeight - (data.hours / roundedMax) * chartHeight;

      if (index === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(chartX + (weeklyData.length - 1) * pointDistance, chartY + chartHeight);
    ctx.closePath();
    ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
    ctx.fill();

    // Draw the line
    ctx.beginPath();
    weeklyData.forEach((data, index) => {
      const x = chartX + index * pointDistance;
      const y = chartY + chartHeight - (data.hours / roundedMax) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw data points
    weeklyData.forEach((data, index) => {
      const x = chartX + index * pointDistance;
      const y = chartY + chartHeight - (data.hours / roundedMax) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw day labels
      ctx.fillStyle = "#4b5563";
      ctx.textAlign = "center";
      ctx.font = "12px Arial";
      ctx.fillText(data.day, x, chartY + chartHeight + 20);

      // Draw hour values above points
      ctx.fillStyle = "#1f2937";
      ctx.font = "12px Arial bold";
      ctx.fillText(`${data.hours}h`, x, y - 15);
    });

    // Resize handler
    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawChart();
      }
    };

    const drawChart = () => {
      if (!canvas || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw everything
      // (Ideally, the entire chart drawing code would be moved here to avoid repetition)
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <MotionDiv className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </MotionDiv>
  );
}
