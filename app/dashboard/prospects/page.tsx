"use client"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Upload, Download, Sparkles, Search, Filter,
  LayoutList, LayoutGrid, ChevronDown, X
} from "lucide-react"
import { IProspect } from "@/models/Prospect"
import { ProspectKPIs } from "@/components/prospects/ProspectKPIs"
import { ProspectTable } from "@/components/prospects/ProspectTable"
import { ProspectPipeline } from "@/components/prospects/ProspectPipeline"
import { ProspectDrawer } from "@/components/prospects/ProspectDrawer"
import { ProspectBulkActionBar } from "@/components/prospects/ProspectBulkActionBar"
import { EmptyState } from "@/components/prospects/EmptyState"
import { CSVImportModal } from "@/components/prospects/CSVImportModal"
import { AddProspectModal } from "@/components/prospects/AddProspectModal"

const STATUS_OPTIONS = ['New', 'Qualified', 'Contacted', 'Interested', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost']

// Smart filter pills — agency-focused
const SMART_FILTERS = [
  { id: 'noWebsite',        label: '🚫 No Website' },
  { id: 'poorSeo',          label: '📉 Poor SEO (< 40)' },
  { id: 'highOpportunity',  label: '🔥 High Opportunity (70+)' },
  { id: 'noSocial',         label: '📱 No Social Media' },
  { id: 'lowReviews',       label: '⭐ Low Reviews (< 20)' },
  { id: 'hasPhone',         label: '📞 Has Phone' },
  { id: 'hasEmail',         label: '✉️ Has Email' },
  { id: 'notAnalyzed',      label: '🔎 Not Yet Analyzed' },
]

// Saved segments
const SEGMENTS = [
  { id: 'noWebsite',       label: '🔥 No Website Leads' },
  { id: 'poorSeo',         label: '📈 Poor SEO Leads' },
  { id: 'highOpportunity', label: '⚡ High Opportunity' },
  { id: 'noSocial',        label: '📱 No Social Media' },
]

function TableSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50/70 p-4">
        <div className="flex gap-6">
          {[140, 100, 120, 160, 100, 80, 90, 110, 130].map((w, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: w }} />
          ))}
        </div>
      </div>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-center gap-6 px-5 py-4 border-b border-gray-50">
          <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
              <div className="h-2.5 w-20 bg-gray-50 rounded animate-pulse" />
            </div>
          </div>
          {[80, 100, 140, 90, 90, 70, 60, 90, 120].map((w, j) => (
            <div key={j} className="h-3 bg-gray-100 rounded animate-pulse" style={{ width: w }} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'pipeline'>('table')
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [drawerProspect, setDrawerProspect] = useState<any | null>(null)
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)

  const fetchProspects = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      const res = await fetch(`/api/prospects?${params}`)
      const json = await res.json()
      if (json.success) {
        setProspects(json.data)
      }
    } catch (e) {
      console.error('Failed to load prospects:', e)
    } finally {
      setIsLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => { fetchProspects() }, [fetchProspects])

  // Client-side filtering
  useEffect(() => {
    let result = [...prospects]
    const p = result as any[]
    if (activeFilters.includes('noWebsite'))       result = p.filter(x => !x.company?.website)
    if (activeFilters.includes('poorSeo'))          result = p.filter(x => x.seoScore !== null && x.seoScore < 40)
    if (activeFilters.includes('highOpportunity'))  result = p.filter(x => (x.opportunityScore || 0) >= 70)
    if (activeFilters.includes('noSocial'))         result = p.filter(x => !x.websiteAnalysis?.hasSocialMedia)
    if (activeFilters.includes('lowReviews'))       result = p.filter(x => (x.reviewCount || 0) < 20)
    if (activeFilters.includes('hasPhone'))         result = result.filter(x => x.phone)
    if (activeFilters.includes('hasEmail'))         result = result.filter(x => x.email)
    if (activeFilters.includes('notAnalyzed'))      result = p.filter(x => !x.isAnalyzed)
    setFiltered(result)
  }, [prospects, activeFilters])

  // ── Analyze single prospect ───────────────────────────────────────────────
  const handleAnalyze = async (id: string) => {
    setAnalyzingId(id)
    try {
      const res = await fetch('/api/prospects/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospectId: id }),
      })
      const json = await res.json()
      if (json.success && json.prospect) {
        // Optimistic update in-place
        setProspects(prev => prev.map(p => (p._id as any)?.toString() === id ? json.prospect : p))
        if (drawerProspect && (drawerProspect._id as any)?.toString() === id) {
          setDrawerProspect(json.prospect)
        }
      }
    } catch (e) { console.error(e) }
    finally { setAnalyzingId(null) }
  }

  const handleStatusChange = async (id: string, status: string) => {
    setProspects(prev => prev.map(p => (p._id as any)?.toString() === id ? { ...p, status: status as any } : p))
    try {
      await fetch(`/api/prospects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
    } catch { fetchProspects() }
  }

  const toggleRow = (id: string) =>
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id])
  const toggleAll = () =>
    setSelectedRows(selectedRows.length === filtered.length ? [] : filtered.map(p => (p._id as any)?.toString() ?? '').filter(Boolean))
  const toggleFilter = (f: string) =>
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  const setSegment = (id: string) => setActiveFilters([id])

  // ── KPI Stats ─────────────────────────────────────────────────────────────
  const ps = prospects as any[]
  const noWebsiteCount    = ps.filter(p => !p.company?.website).length
  const poorSeoCount      = ps.filter(p => p.seoScore !== null && p.seoScore < 40).length
  const highOppCount      = ps.filter(p => (p.opportunityScore || 0) >= 70).length
  const qualifiedCount    = ps.filter(p => p.status === 'Qualified' || p.status === 'Interested').length
  // Rough revenue range: ₹15,000 per lead low, ₹50,000 high
  const revLow  = noWebsiteCount * 15000 + poorSeoCount * 8000
  const revHigh = noWebsiteCount * 50000 + poorSeoCount * 25000

  const stats = {
    total: prospects.length,
    noWebsite: noWebsiteCount,
    poorSeo: poorSeoCount,
    highOpportunity: highOppCount,
    potentialRevenueLow: revLow,
    potentialRevenueHigh: revHigh,
    qualified: qualifiedCount,
  }

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (filtered.length === 0) return
    const headers = ['Name', 'Category', 'Phone', 'Email', 'Website', 'SEO Score', 'Website Status', 'Google Rating', 'Reviews', 'Opportunity Score', 'Recommended Service', 'Deal Value', 'Location', 'Status']
    const rows = (filtered as any[]).map(p => [
      p.name, p.category || p.company?.industry, p.phone, p.email, p.company?.website,
      p.seoScore, p.websiteStatus, p.googleRating, p.reviewCount,
      p.opportunityScore, p.recommendedService, p.estimatedDealValue, p.location, p.status
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'prospects.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  // ── Bulk Analyze ───────────────────────────────────────────────────────────
  const handleBulkAnalyze = async () => {
    const ids = selectedRows.length > 0 ? selectedRows : filtered.slice(0, 10).map(p => (p._id as any)?.toString())
    for (const id of ids) { await handleAnalyze(id) }
  }

  // ── Bulk Delete ────────────────────────────────────────────────────────────
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    try {
      const res = await fetch('/api/prospects/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedRows }),
      });
      if (res.ok) {
        setSelectedRows([]);
        fetchProspects();
      }
    } catch (e) {
      console.error('Failed to delete prospects:', e);
    }
  }

  return (
    <div className="space-y-6 pb-28">

      {/* ── PAGE HEADER ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight leading-tight">Prospects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage, qualify, and prioritize high-opportunity businesses.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="h-4 w-4" /> Export
          </button>
          <button onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Upload className="h-4 w-4" /> Import CSV
          </button>
          <button onClick={handleBulkAnalyze} disabled={!!analyzingId}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-[13px] font-medium text-indigo-700 hover:bg-indigo-100 transition-colors shadow-sm disabled:opacity-50">
            <Sparkles className="h-4 w-4" /> Bulk Analyze
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-[13px] font-semibold transition-colors shadow-sm">
            <Plus className="h-4 w-4" /> Add Prospect
          </button>
        </div>
      </motion.div>

      {/* ── KPI CARDS ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <ProspectKPIs stats={stats} />
      </motion.div>

      {/* ── SAVED SEGMENTS ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Quick Segments:</span>
          {SEGMENTS.map(seg => (
            <button key={seg.id}
              onClick={() => activeFilters.includes(seg.id) ? setActiveFilters([]) : setSegment(seg.id)}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-[12px] font-semibold border transition-all ${activeFilters.includes(seg.id) ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20' : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-700'}`}>
              {seg.label}
            </button>
          ))}
          {activeFilters.length > 0 && (
            <button onClick={() => setActiveFilters([])} className="text-[12px] text-gray-400 hover:text-gray-700 ml-1 px-2">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* ── SEARCH & TOOLBAR ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-3 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, phone, website, location..."
                className="w-full pl-10 pr-4 h-10 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="h-10 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer">
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter toggle */}
            <button onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-medium border transition-colors ${showFilterPanel ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
              <Filter className="h-4 w-4" /> Filters
              {activeFilters.length > 0 && (
                <span className="w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{activeFilters.length}</span>
              )}
            </button>

            <div className="h-8 w-px bg-gray-200" />

            {/* View toggle */}
            <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200">
              <button onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                <LayoutList className="h-3.5 w-3.5" /> Table
              </button>
              <button onClick={() => setViewMode('pipeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${viewMode === 'pipeline' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                <LayoutGrid className="h-3.5 w-3.5" /> Pipeline
              </button>
            </div>

            <span className="text-[12px] text-gray-400 font-medium whitespace-nowrap">
              {filtered.length} prospect{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Smart Filter Pills */}
          <AnimatePresence>
            {showFilterPanel && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="flex items-center gap-2 pt-1 pb-0.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Smart Filters:</span>
                  {SMART_FILTERS.map(f => (
                    <button key={f.id} onClick={() => toggleFilter(f.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-medium border transition-all ${activeFilters.includes(f.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {f.label}
                      {activeFilters.includes(f.id) && <X className="h-3 w-3 ml-0.5" />}
                    </button>
                  ))}
                  {activeFilters.length > 0 && (
                    <button onClick={() => setActiveFilters([])} className="text-[12px] text-indigo-600 font-medium hover:text-indigo-800 ml-1">Clear all</button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── MAIN CONTENT ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        {isLoading ? (
          <TableSkeleton />
        ) : filtered.length === 0 && prospects.length === 0 ? (
          <EmptyState />
        ) : viewMode === 'table' ? (
          <ProspectTable
            prospects={filtered}
            selectedRows={selectedRows}
            onToggleRow={toggleRow}
            onToggleAll={toggleAll}
            onRowClick={p => setDrawerProspect(p)}
            onAnalyze={handleAnalyze}
            analyzingId={analyzingId}
          />
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Pipeline View</span>
            </div>
            <ProspectPipeline
              prospects={filtered}
              onProspectClick={p => setDrawerProspect(p)}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </motion.div>

      {/* ── PROSPECT DRAWER ── */}
      <ProspectDrawer
        prospect={drawerProspect}
        isOpen={!!drawerProspect}
        onClose={() => setDrawerProspect(null)}
        onAnalyze={handleAnalyze}
        analyzingId={analyzingId}
      />

      {/* ── BULK ACTION BAR ── */}
      <ProspectBulkActionBar
        selectedCount={selectedRows.length}
        onClear={() => setSelectedRows([])}
        onExport={handleExportCSV}
        onDelete={handleBulkDelete}
      />

      {/* ── CSV IMPORT MODAL ── */}
      <CSVImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={() => { setShowImportModal(false); fetchProspects() }}
      />

      {/* ── ADD PROSPECT MODAL ── */}
      <AddProspectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={(newProspect) => {
          setProspects(prev => [newProspect, ...prev]);
        }}
      />
    </div>
  )
}
