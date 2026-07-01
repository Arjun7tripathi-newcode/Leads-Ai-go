"use client";

import React from "react";
import { CircularProgress } from "@/components/ui/circular-progress";
import { LucideIcon } from "lucide-react";

interface ScoreCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  description: string;
  issues: number;
  warnings: number;
  passed: number;
}

export function ScoreCard({ title, score, icon: Icon, description, issues, warnings, passed }: ScoreCardProps) {
  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg hover:border-blue-500/30 transition-all">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-sm text-gray-500 max-w-[200px]">{description}</p>
        </div>
        <CircularProgress value={score} size={80} strokeWidth={8} color="auto" />
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 mt-2">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Errors</p>
          <p className="font-semibold text-red-600">{issues}</p>
        </div>
        <div className="text-center border-l border-r border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Warnings</p>
          <p className="font-semibold text-yellow-600">{warnings}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Passed</p>
          <p className="font-semibold text-green-600">{passed}</p>
        </div>
      </div>
    </div>
  );
}
