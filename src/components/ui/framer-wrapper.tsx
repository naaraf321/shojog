"use client";

import React from "react";
import { motion, MotionProps } from "framer-motion";
import { HTMLMotionProps } from "framer-motion";

// Client-side wrapper for motion div
export function MotionDiv({ children, ...props }: HTMLMotionProps<"div">) {
  return <motion.div {...props}>{children}</motion.div>;
}

// Client-side wrapper for motion section
export function MotionSection({ children, ...props }: HTMLMotionProps<"section">) {
  return <motion.section {...props}>{children}</motion.section>;
}

// Client-side wrapper for motion button
export function MotionButton({ children, ...props }: HTMLMotionProps<"button">) {
  return <motion.button {...props}>{children}</motion.button>;
}

// Client-side wrapper for motion span
export function MotionSpan({ children, ...props }: HTMLMotionProps<"span">) {
  return <motion.span {...props}>{children}</motion.span>;
}

// Client-side wrapper for motion h2
export function MotionH2({ children, ...props }: HTMLMotionProps<"h2">) {
  return <motion.h2 {...props}>{children}</motion.h2>;
}

// Client-side wrapper for motion h3
export function MotionH3({ children, ...props }: HTMLMotionProps<"h3">) {
  return <motion.h3 {...props}>{children}</motion.h3>;
}

// Client-side wrapper for motion p
export function MotionP({ children, ...props }: HTMLMotionProps<"p">) {
  return <motion.p {...props}>{children}</motion.p>;
}
