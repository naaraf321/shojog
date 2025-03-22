"use client";

import { useEffect, useRef } from "react";
import { MotionDiv } from "@/components/ui/framer-wrapper";

const subjectData = [
  { subject: "Biology", score: 78, color: "#4ade80" },
  { subject: "Chemistry", score: 65, color: "#60a5fa" },
  { subject: "Physics", score: 82, color: "#f472b6" },
  { subject: "Mathematics", score: 91, color: "#fb923c" },
  { subject: "English", score: 87, color: "#a78bfa" },
];

export function SubjectPerformanceGraph() {
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
    const chartWidth = canvas.width * 0.8;
    const chartHeight = canvas.height * 0.7;
    const chartX = (canvas.width - chartWidth) / 2;
    const chartY = (canvas.height - chartHeight) / 2;
    const barWidth = chartWidth / (subjectData.length * 2);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(chartX, chartY + chartHeight);
    ctx.lineTo(chartX + chartWidth, chartY + chartHeight);
    ctx.strokeStyle = "#9ca3af"; // Gray color
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

    for (let i = 0; i <= 10; i++) {
      const y = chartY + chartHeight - (i / 10) * chartHeight;
      ctx.fillText(`${i * 10}`, chartX - 10, y + 4);

      // Draw horizontal gridlines
      ctx.beginPath();
      ctx.moveTo(chartX, y);
      ctx.lineTo(chartX + chartWidth, y);
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Animate bars
    const drawBars = () => {
      subjectData.forEach((item, index) => {
        // Calculate bar height proportional to score
        const maxScore = 100;
        const barHeight = (item.score / maxScore) * chartHeight;

        // Position bar
        const x = chartX + (index * 2 + 1) * barWidth;
        const y = chartY + chartHeight - barHeight;

        // Draw bar
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw subject label
        ctx.fillStyle = "#4b5563";
        ctx.textAlign = "center";
        ctx.font = "12px Arial";
        ctx.fillText(item.subject, x + barWidth / 2, chartY + chartHeight + 20);

        // Draw score on top of bar
        ctx.fillStyle = "#1f2937";
        ctx.fillText(`${item.score}%`, x + barWidth / 2, y - 10);
      });
    };

    drawBars();

    // Resize handler
    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawBars();
      }
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
