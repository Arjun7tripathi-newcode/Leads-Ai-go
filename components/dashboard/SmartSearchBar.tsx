"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, Clock, TrendingUp, Sparkles, ArrowUpRight, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Static Data ─────────────────────────────────────────────────────────────

const INDUSTRIES = [
  "Restaurants", "Dentists", "Law Firms", "Real Estate Agents",
  "Marketing Agencies", "Roofing Companies", "Plumbers", "Electricians",
  "Gyms", "Hotels", "Medical Clinics", "Salons", "Car Dealers",
  "Construction Companies", "Accountants", "Insurance Agencies",
  "Landscaping Companies", "Chiropractors", "Veterinarians", "Optometrists",
];

const LOCATIONS = [
  "New York", "Los Angeles", "Chicago", "Miami", "Dallas", "Houston",
  "Phoenix", "Philadelphia", "San Antonio", "San Diego",
  "California", "Texas", "Florida", "New York State",
  "London", "Dubai", "Toronto", "Sydney", "Singapore",
];

const OPPORTUNITY_SUFFIXES = [
  "without websites",
  "with poor SEO",
  "with no contact form",
  "with low Google reviews",
  "without social media",
  "with outdated websites",
  "needing digital marketing",
  "needing Google Business optimization",
  "needing website redesign",
];

const AI_TEMPLATES = [
  { icon: "🔥", label: "Find Businesses Without Websites",       query: "local businesses without websites" },
  { icon: "📈", label: "Find Businesses With Poor SEO",           query: "local businesses with poor SEO" },
  { icon: "📱", label: "Find Businesses Without Social Media",    query: "local businesses without social media" },
  { icon: "⭐", label: "Find Businesses With Low Reviews",        query: "businesses with low Google reviews" },
  { icon: "🚀", label: "Find High Opportunity Leads",             query: "high growth potential local businesses" },
  { icon: "💰", label: "Find Businesses Likely To Buy Marketing", query: "businesses needing marketing services" },
];

const TRENDING = [
  "Plumbers without websites in Texas",
  "Dentists with poor SEO in California",
  "Restaurants with low reviews in NYC",
  "Roofing Companies needing digital marketing",
  "Medical Clinics without social media",
  "Law Firms in London",
];

const HISTORY_KEY = "leadflow_search_history";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getHistory(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); }
  catch { return []; }
}

function saveHistory(query: string) {
  if (typeof window === "undefined") return;
  const current = getHistory().filter(h => h !== query);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([query, ...current].slice(0, 8)));
}

function highlight(text: string, query: string) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <span className="text-blue-600 font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface SmartSearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SmartSearchBar({ onSearch, isLoading = false }: SmartSearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setHistory(getHistory()); }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Build autocomplete suggestions from the query
  const getSuggestions = useCallback((): Array<{ label: string; type: "auto" | "opportunity" }> => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const results: Array<{ label: string; type: "auto" | "opportunity" }> = [];

    // Industry × Location combos
    INDUSTRIES.filter(i => i.toLowerCase().includes(q)).slice(0, 3).forEach(ind => {
      LOCATIONS.slice(0, 3).forEach(loc => {
        results.push({ label: `${ind} in ${loc}`, type: "auto" });
      });
    });

    // Location × Industry combos
    LOCATIONS.filter(l => l.toLowerCase().includes(q)).slice(0, 2).forEach(loc => {
      INDUSTRIES.slice(0, 2).forEach(ind => {
        results.push({ label: `${ind} in ${loc}`, type: "auto" });
      });
    });

    // Opportunity suffixes
    INDUSTRIES.filter(i => i.toLowerCase().includes(q)).slice(0, 2).forEach(ind => {
      OPPORTUNITY_SUFFIXES.slice(0, 3).forEach(sfx => {
        results.push({ label: `${ind} ${sfx}`, type: "opportunity" });
      });
    });

    // Dedupe and limit
    const seen = new Set<string>();
    return results.filter(r => {
      if (seen.has(r.label)) return false;
      seen.add(r.label);
      return true;
    }).slice(0, 8);
  }, [query]);

  const suggestions = getSuggestions();
  const showDropdown = focused;

  const commit = (q: string) => {
    if (!q.trim()) return;
    saveHistory(q.trim());
    setHistory(getHistory());
    setQuery(q);
    setFocused(false);
    setActiveIndex(-1);
    onSearch(q.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    const items = suggestions.length > 0 ? suggestions.map(s => s.label) : [];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && items[activeIndex]) {
        commit(items[activeIndex]);
      } else {
        commit(query);
      }
    } else if (e.key === "Escape") {
      setFocused(false);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input */}
      <div className={`relative flex items-center bg-white rounded-[16px] border transition-all duration-200 shadow-sm ${
        focused ? "border-blue-500 ring-4 ring-blue-500/10 shadow-md" : "border-gray-200"
      }`}>
        <div className="pl-5 text-gray-400">
          {isLoading
            ? <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            : <Search className="h-5 w-5" />
          }
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveIndex(-1); }}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Find businesses that need websites, SEO, or digital marketing..."
          className="flex-1 h-14 px-4 text-[15px] bg-transparent outline-none text-gray-900 placeholder:text-gray-400 disabled:opacity-60"
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="px-3 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => commit(query)}
          disabled={isLoading || !query.trim()}
          className="m-2 h-10 px-6 bg-gray-900 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-[12px] font-semibold text-[13px] flex items-center gap-2 transition-all shrink-0"
        >
          {isLoading ? "Searching..." : <><Zap className="h-3.5 w-3.5 fill-white" /> Generate</>}
        </button>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden"
          >
            {/* ── Autocomplete from typed query ── */}
            {query.trim() && suggestions.length > 0 && (
              <div className="p-3 border-b border-gray-100">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Suggestions</p>
                {suggestions.map((s, i) => (
                  <button
                    key={s.label}
                    onMouseDown={() => commit(s.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left transition-colors group ${
                      activeIndex === i ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                      s.type === "opportunity" ? "bg-amber-50" : "bg-gray-100"
                    }`}>
                      {s.type === "opportunity"
                        ? <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        : <Search className="h-3.5 w-3.5 text-gray-500" />
                      }
                    </div>
                    <span className="text-[14px] text-gray-800">{highlight(s.label, query)}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 ml-auto transition-colors" />
                  </button>
                ))}
              </div>
            )}

            {/* ── Empty state (no query) ── */}
            {!query.trim() && (
              <div className="divide-y divide-gray-100">
                {/* AI Templates */}
                <div className="p-4">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-3">AI Opportunity Templates</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {AI_TEMPLATES.map(t => (
                      <button
                        key={t.query}
                        onMouseDown={() => commit(t.query)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left hover:bg-gray-50 transition-colors group"
                      >
                        <span className="text-base">{t.icon}</span>
                        <span className="text-[13px] font-medium text-gray-700 leading-tight">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {history.length > 0 && (
                  <div className="p-4">
                    <div className="flex items-center justify-between px-1 mb-2">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Recent Searches</p>
                      <button onMouseDown={clearHistory} className="text-[11px] text-gray-400 hover:text-red-500 transition-colors">Clear</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {history.map(h => (
                        <button
                          key={h}
                          onMouseDown={() => commit(h)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-[13px] text-gray-700 transition-colors"
                        >
                          <Clock className="h-3 w-3 text-gray-400" />
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending */}
                <div className="p-4">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">Trending Searches</p>
                  <div className="space-y-0.5">
                    {TRENDING.map((t, i) => (
                      <button
                        key={t}
                        onMouseDown={() => commit(t)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="h-5 w-5 flex items-center justify-center">
                          <TrendingUp className="h-3.5 w-3.5 text-rose-400" />
                        </div>
                        <span className="text-[13px] text-gray-700">{t}</span>
                        <span className="ml-auto text-[11px] font-bold text-gray-300">#{i + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer hint */}
            <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">↑↓</kbd> to navigate, <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">↵</kbd> to search</span>
              <span className="text-[11px] text-gray-400 flex items-center gap-1"><Sparkles className="h-3 w-3 text-indigo-400" /> AI-Powered</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
