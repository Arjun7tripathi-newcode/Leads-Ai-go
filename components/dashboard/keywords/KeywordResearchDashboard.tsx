"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Target, TrendingUp, BarChart2, Zap, ArrowRight, MousePointerClick,
  ExternalLink, Download, Filter, Sparkles, AlertCircle, X, ChevronUp, ChevronDown,
  Lightbulb, Info
} from "lucide-react"

// --- Types ---

type Intent = "Informational" | "Navigational" | "Commercial" | "Transactional"

type KeywordData = {
  id: string
  keyword: string
  volume: number
  cpc: number
  difficulty: number
  intent: Intent
  trend: number[]
}

type ApiResponse = {
  mainKeyword: KeywordData
  relatedKeywords: KeywordData[]
  longTailKeywords: KeywordData[]
  aiInsights: string
  source?: 'ai' | 'fallback'
}

// --- Helpers ---

const INTENT_STYLES: Record<Intent, string> = {
  Informational: "bg-blue-50 text-blue-700 border-blue-200",
  Navigational:  "bg-purple-50 text-purple-700 border-purple-200",
  Commercial:    "bg-amber-50 text-amber-700 border-amber-200",
  Transactional: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

const ALL_INTENTS: Intent[] = ["Informational", "Navigational", "Commercial", "Transactional"]

function getDifficultyMeta(score: number): { label: string; bar: string; text: string } {
  if (score < 30) return { label: "Easy",   bar: "bg-emerald-500", text: "text-emerald-600" }
  if (score < 60) return { label: "Medium", bar: "bg-amber-400",   text: "text-amber-600"  }
  return            { label: "Hard",   bar: "bg-rose-500",    text: "text-rose-600"   }
}

function exportToCsv(rows: KeywordData[], filename: string) {
  const header = ["Keyword", "Volume", "CPC ($)", "Difficulty", "Intent"]
  const lines  = rows.map(r =>
    [r.keyword, r.volume, r.cpc.toFixed(2), r.difficulty, r.intent].join(",")
  )
  const csv  = [header.join(","), ...lines].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement("a"), { href: url, download: filename })
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// --- Sub-components ---

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  return (
    <div className="flex items-end gap-[3px] h-6 w-20">
      {data.map((val, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm bg-indigo-200 hover:bg-indigo-400 transition-colors cursor-default"
          style={{ height: `${Math.max(15, ((val - min) / range) * 100)}%` }}
          title={`Month ${i + 1}: ${val}`}
        />
      ))}
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + i * 8}%` }} />
        </td>
      ))}
    </tr>
  )
}

function MetricCard({
  title, value, subtitle, icon: Icon, colorClass, bgClass,
}: {
  title: string; value: string | number; subtitle?: string
  icon: any; colorClass: string; bgClass: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group flex items-start justify-between"
    >
      <div>
        <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-gray-900 leading-none">{value}</span>
          {subtitle && <span className="text-[12px] font-medium text-gray-400">{subtitle}</span>}
        </div>
      </div>
      <div className={`h-10 w-10 rounded-xl ${bgClass} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </div>
    </motion.div>
  )
}

function DifficultyCard({ score }: { score: number }) {
  const meta = getDifficultyMeta(score)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Keyword Difficulty</p>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
          score < 30 ? "bg-emerald-50 text-emerald-700" :
          score < 60 ? "bg-amber-50 text-amber-700" :
          "bg-rose-50 text-rose-700"
        }`}>{meta.label}</span>
      </div>
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-2xl font-bold text-gray-900">{score}</span>
        <span className="text-[12px] font-medium text-gray-400">/ 100</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${meta.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}

function AiInsightsBanner({ insights, keyword }: { insights: string; keyword: string }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 border border-indigo-200 rounded-2xl overflow-hidden mb-6"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <Sparkles className="absolute top-2 right-4 w-32 h-32 text-indigo-900" />
      </div>
      <div className="relative p-5">
        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-[12px] font-semibold text-indigo-500 uppercase tracking-wider">AI Insights</p>
              <p className="text-[13px] font-bold text-gray-900">Opportunity Analysis for "{keyword}"</p>
            </div>
          </div>
          <div className="p-1.5 rounded-lg hover:bg-indigo-100 transition-colors text-indigo-400">
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </div>
        </button>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-indigo-200/60">
                <div className="flex gap-3">
                  <Lightbulb className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-[14px] leading-relaxed text-gray-700">{insights}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function KeywordTable({
  data,
  isLoading,
  activeFilter,
  setActiveFilter,
  onExport,
  tabLabel,
}: {
  data: KeywordData[]
  isLoading: boolean
  activeFilter: Intent | "All"
  setActiveFilter: (f: Intent | "All") => void
  onExport: () => void
  tabLabel: string
}) {
  const [sortKey, setSortKey] = useState<keyof KeywordData>("volume")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  const filtered = useMemo(() => {
    const rows = activeFilter === "All" ? data : data.filter(r => r.intent === activeFilter)
    return [...rows].sort((a, b) => {
      const av = a[sortKey] as any
      const bv = b[sortKey] as any
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortDir === "asc" ? av - bv : bv - av
    })
  }, [data, activeFilter, sortKey, sortDir])

  const toggleSort = (key: keyof KeywordData) => {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("desc") }
  }

  const SortIcon = ({ col }: { col: keyof KeywordData }) =>
    col === sortKey
      ? sortDir === "desc" ? <ChevronDown className="h-3 w-3 ml-1 inline" /> : <ChevronUp className="h-3 w-3 ml-1 inline" />
      : null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table toolbar */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-[13px] font-medium text-gray-600">
          <span className="font-bold text-gray-900">{filtered.length}</span> keywords
          {activeFilter !== "All" && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[12px] font-semibold">
              {activeFilter}
              <button onClick={() => setActiveFilter("All")}>
                <X className="h-3 w-3 hover:text-indigo-900" />
              </button>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowFilterMenu(v => !v)}
            className={`px-3 py-2 border rounded-lg text-[13px] font-medium flex items-center gap-1.5 shadow-sm transition-all ${
              activeFilter !== "All"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter Intent
          </button>

          <AnimatePresence>
            {showFilterMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20"
              >
                {(["All", ...ALL_INTENTS] as const).map(intent => (
                  <button
                    key={intent}
                    onClick={() => { setActiveFilter(intent); setShowFilterMenu(false) }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors ${
                      activeFilter === intent
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {intent === "All" ? "All Intents" : intent}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={onExport}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-white">
              <th className="px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Keyword</th>
              <th className="px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Intent</th>
              <th
                className="px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                onClick={() => toggleSort("volume")}
              >
                Volume <SortIcon col="volume" />
              </th>
              <th className="px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Trend</th>
              <th
                className="px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                onClick={() => toggleSort("difficulty")}
              >
                KD% <SortIcon col="difficulty" />
              </th>
              <th
                className="px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                onClick={() => toggleSort("cpc")}
              >
                CPC <SortIcon col="cpc" />
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              : filtered.length === 0
              ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-[14px]">
                    No keywords match the selected filter.
                  </td>
                </tr>
              )
              : filtered.map((row) => {
                const diff = getDifficultyMeta(row.difficulty)
                const isHot = row.difficulty < 30 && row.volume > 1000
                const isLowKd = row.difficulty < 20
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/70 transition-colors group"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-[14px]">{row.keyword}</span>
                        {isHot && (
                          <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider border border-rose-100">
                            🔥 Hot
                          </span>
                        )}
                        {isLowKd && !isHot && (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                            Low KD
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-md border text-[12px] font-medium ${INTENT_STYLES[row.intent]}`}>
                        {row.intent}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-[14px] font-semibold text-gray-800">{row.volume.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <Sparkline data={row.trend} />
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[14px] font-bold ${diff.text}`}>{row.difficulty}</span>
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${diff.bar}`} style={{ width: `${row.difficulty}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-[14px] font-medium text-gray-700">${row.cpc.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- Main Component ---

export function KeywordResearchDashboard() {
  const [query, setQuery]           = useState("")
  const [isLoading, setIsLoading]   = useState(false)
  const [hasResults, setHasResults] = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [activeTab, setActiveTab]   = useState<"related" | "longtail">("related")
  const [activeFilter, setActiveFilter] = useState<Intent | "All">("All")
  const [results, setResults]       = useState<ApiResponse | null>(null)
  const [searchedQuery, setSearchedQuery] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    setIsLoading(true)
    setHasResults(false)
    setError(null)
    setResults(null)
    setSearchedQuery(query.trim())
    setActiveFilter("All")

    try {
      const res = await fetch("/api/keywords/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: query.trim() }),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Unknown error from server.")
      }

      setResults(json.data as ApiResponse)
      setHasResults(true)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const currentTableData = results
    ? activeTab === "related" ? results.relatedKeywords : results.longTailKeywords
    : []

  const handleExport = () => {
    if (!currentTableData.length) return
    const filename = `${searchedQuery.replace(/\s+/g, "_")}_${activeTab}_keywords.csv`
    exportToCsv(currentTableData, filename)
  }

  return (
    <div className="space-y-8 pb-32">

      {/* ── Header & Search ── */}
      <div className="relative bg-white p-8 rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="absolute -top-8 -right-8 opacity-[0.04] pointer-events-none select-none">
          <Target className="w-72 h-72 text-indigo-900" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[12px] font-semibold text-indigo-600 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered · Keyword Intelligence
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Keyword Research
          </h1>
          <p className="text-gray-500 mb-8 text-[15px] max-w-xl leading-relaxed">
            Discover search volume, CPC, difficulty, intent, related keywords, and long-tail opportunities — powered by AI.
          </p>

          <form onSubmit={handleSearch} className="flex items-center bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden focus-within:ring-4 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all">
            <div className="pl-5 pr-3 text-gray-400 shrink-0">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter a seed keyword  (e.g. 'b2b lead generation')"
              className="flex-1 py-4 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 font-medium text-[15px]"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="m-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>Analyze <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ── Error Banner ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700"
          >
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-[14px]">Analysis Failed</p>
              <p className="text-[13px] mt-0.5 text-rose-600">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="p-1 hover:bg-rose-100 rounded-lg transition-colors">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Skeleton while loading ── */}
      {isLoading && (
        <div className="space-y-8">
          {/* Metric skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                <div className="h-7 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            ))}
          </div>
          {/* Insights skeleton */}
          <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl space-y-2">
            <div className="h-4 bg-indigo-100 rounded animate-pulse w-1/3" />
            <div className="h-3 bg-indigo-100 rounded animate-pulse w-full" />
            <div className="h-3 bg-indigo-100 rounded animate-pulse w-5/6" />
          </div>
          {/* Table skeleton */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="h-5 bg-gray-100 rounded animate-pulse w-40" />
            </div>
            <table className="w-full">
              <tbody>{Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      <AnimatePresence mode="wait">
        {hasResults && results && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* KPI Cards */}
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                Overview for{" "}
                <span className="text-indigo-600">"{searchedQuery}"</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Monthly Volume"
                  value={results.mainKeyword.volume.toLocaleString()}
                  subtitle="searches/mo"
                  icon={BarChart2}
                  colorClass="text-blue-600"
                  bgClass="bg-blue-50"
                />
                <MetricCard
                  title="Average CPC"
                  value={`$${results.mainKeyword.cpc.toFixed(2)}`}
                  subtitle="USD"
                  icon={MousePointerClick}
                  colorClass="text-emerald-600"
                  bgClass="bg-emerald-50"
                />
                <DifficultyCard score={results.mainKeyword.difficulty} />
                <MetricCard
                  title="Search Intent"
                  value={results.mainKeyword.intent}
                  icon={Zap}
                  colorClass="text-amber-600"
                  bgClass="bg-amber-50"
                />
              </div>
            </div>

            {/* AI Insights */}
            <AiInsightsBanner insights={results.aiInsights} keyword={searchedQuery} />

            {/* Tabs + Table */}
            <div>
              {/* Tab switcher */}
              <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl w-fit mb-5">
                <button
                  onClick={() => { setActiveTab("related"); setActiveFilter("All") }}
                  className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    activeTab === "related"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Related Keywords
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-gray-200 text-gray-600 font-bold">
                    {results.relatedKeywords.length}
                  </span>
                </button>
                <button
                  onClick={() => { setActiveTab("longtail"); setActiveFilter("All") }}
                  className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    activeTab === "longtail"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Long-Tail Opportunities
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-gray-200 text-gray-600 font-bold">
                    {results.longTailKeywords.length}
                  </span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === "related" ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <KeywordTable
                    data={currentTableData}
                    isLoading={false}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    onExport={handleExport}
                    tabLabel={activeTab}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer info */}
            <div className="flex items-center gap-2 text-[12px] text-gray-400 px-1">
              <Info className="h-3.5 w-3.5 shrink-0" />
              Keyword metrics are AI-estimated for research purposes. Data refreshes on each new analysis.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
