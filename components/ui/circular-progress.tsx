"use client";

import React from "react";
import { motion } from "framer-motion";

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color = "text-blue-600",
  className = "",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeValue = Math.min(Math.max(value, 0), max);
  const percent = safeValue / max;
  const dashoffset = circumference - percent * circumference;

  let strokeColorClass = color;
  if (color === "auto") {
    if (percent >= 0.9) strokeColorClass = "text-green-500";
    else if (percent >= 0.7) strokeColorClass = "text-yellow-500";
    else if (percent >= 0.5) strokeColorClass = "text-orange-500";
    else strokeColorClass = "text-red-500";
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="text-gray-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={strokeColorClass}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tracking-tighter text-gray-900">
          {Math.round(safeValue)}
        </span>
      </div>
    </div>
  );
}
