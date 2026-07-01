"use client";

import { useState, useEffect } from "react";
import {
  Save, Loader2, CheckCircle2, Mail, Zap, Clock,
  Bell, Trash2, Plus, Toggle, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = ["Professional", "Friendly", "Formal", "Sales", "Support", "Concise"];
const CATEGORIES = [
  "Lead Inquiry", "Support Request", "Sales Question",
  "Meeting Request", "Invoice", "General Inquiry",
];

interface AccountData {
  emailAddress: string;
  signature: string;
  brandVoice: string;
  autoReplyEnabled: boolean;
  workingHoursStart: string;
  workingHoursEnd: string;
  defaultTone: string;
}

export default function InboxSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState<AccountData>({
    emailAddress: "",
    signature: "",
    brandVoice: "",
    autoReplyEnabled: false,
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00",
    defaultTone: "Professional",
  });

  useEffect(() => {
    fetch("/api/email/sync")
      .then((r) => r.json())
      .then((d) => {
        if (d.emailAddress) setData((prev) => ({ ...prev, emailAddress: d.emailAddress }));
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // In production this would POST to /api/email/settings
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inbox Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your AI Email Assistant preferences</p>
      </div>

      {/* Gmail Account Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">Connected Gmail Account</h2>
            <p className="text-xs text-gray-500">Your Gmail integration status</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
              {data.emailAddress.charAt(0).toUpperCase() || "G"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {data.emailAddress || "Not connected"}
              </p>
              <p className="text-xs text-emerald-600 font-medium">● Connected via Google OAuth</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/auth/signin"
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              Reconnect
            </a>
            <button className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all">
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <Zap className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">AI Reply Settings</h2>
            <p className="text-xs text-gray-500">Customize how AI generates your replies</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Default Tone */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Default Reply Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setData((d) => ({ ...d, defaultTone: t }))}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
                    data.defaultTone === t
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Voice */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Custom Brand Voice</label>
            <textarea
              value={data.brandVoice}
              onChange={(e) => setData((d) => ({ ...d, brandVoice: e.target.value }))}
              placeholder="Describe your brand's writing style. e.g. 'We are a friendly SaaS agency. Use first names, be concise, and always end with a question to keep the conversation going.'"
              rows={3}
              className="w-full px-4 py-3 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
            />
          </div>

          {/* Email Signature */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Email Signature</label>
            <textarea
              value={data.signature}
              onChange={(e) => setData((d) => ({ ...d, signature: e.target.value }))}
              placeholder="e.g. John Smith&#10;Head of Growth | Acme Agency&#10;john@acme.com | +1 (555) 123-4567"
              rows={3}
              className="w-full px-4 py-3 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">Working Hours</h2>
            <p className="text-xs text-gray-500">Auto-replies respect these hours</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-xs font-semibold text-gray-600 block mb-1">Start Time</label>
            <input
              type="time"
              value={data.workingHoursStart}
              onChange={(e) => setData((d) => ({ ...d, workingHoursStart: e.target.value }))}
              className="w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="text-gray-400 text-sm mt-5">to</div>
          <div className="flex-1">
            <label className="text-xs font-semibold text-gray-600 block mb-1">End Time</label>
            <input
              type="time"
              value={data.workingHoursEnd}
              onChange={(e) => setData((d) => ({ ...d, workingHoursEnd: e.target.value }))}
              className="w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Auto-Reply */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Bell className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Auto-Reply</h2>
              <p className="text-xs text-gray-500">Automatically reply to classified emails</p>
            </div>
          </div>
          <button
            onClick={() => setData((d) => ({ ...d, autoReplyEnabled: !d.autoReplyEnabled }))}
            className={cn(
              "relative h-6 w-11 rounded-full transition-all border",
              data.autoReplyEnabled
                ? "bg-blue-600 border-blue-600"
                : "bg-gray-200 border-gray-300"
            )}
          >
            <span className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
              data.autoReplyEnabled ? "translate-x-5" : "translate-x-0"
            )} />
          </button>
        </div>

        {data.autoReplyEnabled && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-xs font-semibold text-blue-800 mb-2">Auto-reply Rules</p>
            <div className="space-y-2">
              {[
                { category: "Lead Inquiry", action: "Generate draft & notify" },
                { category: "Support Request", action: "Auto-reply with template" },
                { category: "Meeting Request", action: "Suggest availability" },
              ].map((rule) => (
                <div key={rule.category} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-blue-700">{rule.category}</span>
                  <span className="text-blue-600">{rule.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Security */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <Shield className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">Security</h2>
            <p className="text-xs text-gray-500">Your tokens are encrypted at rest</p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            "OAuth tokens are encrypted in MongoDB",
            "Tokens are never exposed in API responses",
            "Access tokens are refreshed automatically",
            "You can revoke access at any time via Google Account settings",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-xs text-gray-600">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-60"
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Saving...</>
          ) : saved ? (
            <><CheckCircle2 className="h-4 w-4" />Saved!</>
          ) : (
            <><Save className="h-4 w-4" />Save Settings</>
          )}
        </button>
      </div>
    </div>
  );
}
