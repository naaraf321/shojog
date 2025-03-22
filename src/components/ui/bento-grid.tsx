"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// BentoGrid component for creating a responsive grid layout
export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function BentoGrid({ className, children, ...props }: BentoGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full", className)} {...props}>
      {children}
    </div>
  );
}

// BentoGridItem component for individual cards in the grid
export interface BentoGridItemProps {
  className?: string;
  title: string;
  description: string;
  header: React.ReactNode;
  icon?: React.ReactNode;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
}

export function BentoGridItem({ className, title, description, header, icon, colSpan = 1, rowSpan = 1 }: BentoGridItemProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, margin: "-50px" }} className={cn("row-span-1 col-span-1 rounded-xl group/bento hover:shadow-xl transition-all duration-500 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-input overflow-hidden", colSpan === 2 && "md:col-span-2", rowSpan === 2 && "md:row-span-2", className)}>
      <div className="relative h-full w-full p-4 flex flex-col justify-between">
        <motion.div className="absolute inset-0 h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />

        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            {icon && (
              <motion.div className="p-1" initial={{ scale: 0.8 }} whileInView={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}>
                {icon}
              </motion.div>
            )}
            <motion.h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-200" initial={{ opacity: 0, x: -5 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
              {title}
            </motion.h3>
          </div>
          <motion.div className="text-sm text-gray-600 dark:text-zinc-400" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
            {description}
          </motion.div>
        </div>

        <motion.div className="relative mt-4" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          {header}
        </motion.div>
      </div>
    </motion.div>
  );
}
