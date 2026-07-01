"use client";

import { useState, useEffect } from "react";
import {
  Inbox, Send, FileEdit, Tag, Star, Trash2, RefreshCw,
  Loader2, CheckCircle2, AlertCircle, Wifi, WifiOff,
  ChevronDown, LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

const CATEGORIES = [
  "All", "Lead Inquiry", "Support Request", "Sales Question",
  "Meeting Request", "Invoice", "Partnership", "General Inquiry",
  "Newsletter", "Spam",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Lead Inquiry": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Support Request": "bg-amber-100 text-amber-700 border-amber-200",
  "Sales Question": "bg-blue-100 text-blue-700 border-blue-200",
  "Meeting Request": "bg-violet-100 text-violet-700 border-violet-200",
  "Invoice": "bg-red-100 text-red-700 border-red-200",
  "Partnership": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "Newsletter": "bg-gray-100 text-gray-600 border-gray-200",
  "Spam": "bg-red-50 text-red-400 border-red-100",
  "Job Application": "bg-pink-100 text-pink-700 border-pink-200",
  "General Inquiry": "bg-indigo-100 text-indigo-700 border-indigo-200",
};

interface Props {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  unreadCount: number;
  onSync: () => void;
  isSyncing: boolean;
  connected: boolean;
  emailAddress?: string;
  lastSyncAt?: string;
  emailCounts: Record<string, number>;
}

export function InboxSidebar({
  selectedCategory,
  onCategoryChange,
  unreadCount,
  onSync,
  isSyncing,
  connected,
  emailAddress,
  lastSyncAt,
  emailCounts,
}: Props) {
  return (
    <div className="w-64 flex-shrink-0 h-full bg-white border-r border-gray-100 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900 text-sm">AI Inbox</h2>
          <button
            onClick={onSync}
            disabled={isSyncing || !connected}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all disabled:opacity-50"
            title="Sync inbox"
          >
            <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
          </button>
        </div>

        {/* Connection Status */}
        <button 
          onClick={() => { if (!connected) signIn("google", { callbackUrl: "/dashboard/inbox" }) }}
          className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border w-full text-left",
          connected
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : "bg-red-50 text-red-600 border-red-100 cursor-pointer hover:bg-red-100 transition-colors"
        )}>
          {connected ? (
            <><CheckCircle2 className="h-3.5 w-3.5" /><span className="truncate">{emailAddress || "Gmail Connected"}</span></>
          ) : (
            <><WifiOff className="h-3.5 w-3.5" /><span>Connect Gmail</span></>
          )}
        </button>

        {lastSyncAt && (
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Last sync: {new Date(lastSyncAt).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Folders */}
      <div className="p-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Folders</p>
        {[
          { icon: Inbox, label: "Inbox", count: unreadCount },
          { icon: Send, label: "Sent", count: 0 },
          { icon: FileEdit, label: "Drafts", count: 0 },
        ].map(({ icon: Icon, label, count }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all text-left"
          >
            <Icon className="h-4 w-4 text-gray-400" />
            <span className="flex-1">{label}</span>
            {count > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Categories</p>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all text-left group",
              selectedCategory === cat
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <span className={cn(
              "w-2 h-2 rounded-full",
              CATEGORY_COLORS[cat]?.split(" ")[0] || "bg-gray-200"
            )} />
            <span className="flex-1 truncate">{cat}</span>
            {emailCounts[cat] > 0 && (
              <span className="text-[10px] text-gray-400 group-hover:text-gray-600">
                {emailCounts[cat]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export { CATEGORY_COLORS };
