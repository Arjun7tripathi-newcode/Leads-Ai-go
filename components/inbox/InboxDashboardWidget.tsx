"use client";

import { useState, useEffect } from "react";
import { Mail, Inbox, Zap, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

interface InboxStats {
  unread: number;
  today: number;
  connected: boolean;
}

export function InboxDashboardWidget() {
  const [stats, setStats] = useState<InboxStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/email/inbox?limit=1")
      .then((r) => r.json())
      .then((d) => {
        setStats({
          unread: d.stats?.unread || 0,
          today: d.stats?.today || 0,
          connected: d.connected || false,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
        <div className="h-4 w-24 bg-gray-100 rounded mb-4" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 bg-gray-100 rounded-xl" />
          <div className="h-16 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats?.connected) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl border border-blue-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-800">AI Email Inbox</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Connect Gmail to manage emails with AI-powered replies
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard/inbox" })}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Connect Gmail <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-800">AI Email Inbox</span>
        </div>
        <Link
          href="/dashboard/inbox"
          className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Open <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-1.5 mb-1">
            <Inbox className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">Unread</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
        </div>
        <div className="p-3 bg-violet-50 rounded-xl border border-violet-100">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-violet-600" />
            <span className="text-[10px] font-semibold text-violet-600 uppercase tracking-wider">Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
        </div>
      </div>

      <Link
        href="/dashboard/inbox"
        className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-100 transition-all"
      >
        <Zap className="h-3.5 w-3.5" />
        Generate AI Replies
      </Link>
    </div>
  );
}
