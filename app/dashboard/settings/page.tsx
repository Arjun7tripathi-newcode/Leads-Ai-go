"use client";

import { useState, useEffect } from "react";
import { Key, Save, Loader2, Info } from "lucide-react";

export default function SettingsPage() {
  const [apifyKey, setApifyKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/user/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.apifyApiKey) {
            setApifyKey(data.apifyApiKey);
          }
          if (data.openaiApiKey) {
            setOpenaiKey(data.openaiApiKey);
          }
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apifyApiKey: apifyKey, openaiApiKey: openaiKey }),
      });

      if (res.ok) {
        setMessage({ text: "Settings saved successfully!", type: "success" });
      } else {
        setMessage({ text: "Failed to save settings.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred while saving.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and API keys.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
              <p className="text-sm text-gray-500">Configure your custom API keys for extended usage.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6 max-w-xl">
            <div>
              <label htmlFor="apifyKey" className="block text-sm font-medium text-gray-700 mb-1.5">
                Apify API Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="apifyKey"
                  value={apifyKey}
                  onChange={(e) => setApifyKey(e.target.value)}
                  placeholder="apify_api_..."
                  className="w-full pl-4 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
              <div className="mt-3 flex gap-2 items-start text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <p>
                  Add your own Apify API key here. When the built-in system quota runs out, we will use this key for your searches and audits.
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="openaiKey" className="block text-sm font-medium text-gray-700 mb-1.5">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="openaiKey"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full pl-4 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
              <div className="mt-3 flex gap-2 items-start text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <p>
                  Add your OpenAI API key here for AI Assistant and Bulk Analysis features.
                </p>
              </div>
            </div>

            {message.text && (
              <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

