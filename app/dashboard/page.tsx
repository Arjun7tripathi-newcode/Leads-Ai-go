"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Sparkles, Filter, Database, Users, Phone, TrendingUp, Award, Star
} from "lucide-react"
import { BulkActionBar } from "@/components/dashboard/BulkActionBar"
import { LeadEnrichmentDrawer } from "@/components/dashboard/LeadEnrichmentDrawer"
import { DiscoveryTable, Lead } from "@/components/dashboard/DiscoveryTable"
import { FloatingStatus } from "@/components/dashboard/FloatingStatus"
import { SmartSearchBar } from "@/components/dashboard/SmartSearchBar"
import { InboxDashboardWidget } from "@/components/inbox/InboxDashboardWidget"

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchStep, setSearchStep] = useState(0)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [drawerLead, setDrawerLead] = useState<any | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [lastQuery, setLastQuery] = useState<string>("")

  const handleSearch = async (q: string) => {
    if (!q.trim()) return
    setIsSearching(true)
    setSearchError(null)
    setLastQuery(q)
    
    // Animate progress steps while waiting for Apify
    let step = 0
    const interval = setInterval(() => {
      step += 1
      if (step < 5) setSearchStep(step)
    }, 800)

    try {
      const res = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      })
      
      const json = await res.json()
      clearInterval(interval)
      setSearchStep(4)

      if (json.success && Array.isArray(json.data)) {
        setLeads(json.data)
      } else {
        setSearchError(json.error || "Search failed. Please try again.")
        setLeads([])
      }

      setTimeout(() => {
        setIsSearching(false)
        setSearchStep(0)
      }, 800)
    } catch (e: any) {
      clearInterval(interval)
      setIsSearching(false)
      setSearchStep(0)
      setSearchError("Network error. Please check your connection.")
    }
  }

  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id])
  }

  const toggleAll = () => {
    setSelectedRows(selectedRows.length === leads.length ? [] : leads.map(l => l._id))
  }

  const handleDelete = (ids: string[]) => {
    setLeads(prev => prev.filter(l => !ids.includes(l._id)))
  }

  const handleAnalysisComplete = (enriched: any[]) => {
    setLeads(prev => prev.map(lead => {
      const found = enriched.find(e => e._id === lead._id)
      return found ? { ...lead, analysis: found.analysis } : lead
    }))
  }

  const toggleFilter = (f: string) => {
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  // Apply filters
  const filteredLeads = leads.filter(l => {
    if (activeFilters.length === 0) return true;
    let match = true;
    if (activeFilters.includes('Has Phone') && !l.phone) match = false;
    if (activeFilters.includes('Has Website') && !l.website) match = false;
    if (activeFilters.includes('Verified') && l.status !== "Verified") match = false;
    if (activeFilters.includes('High Rating (4.5+)') && (typeof l.rating !== 'number' || l.rating < 4.5)) match = false;
    // Recently Added is a bit tricky without timestamps in this mock, we can just return true
    return match;
  })

  // Dynamic KPIs based on real data
  const verifiedCount = filteredLeads.filter(l => l.status === "Verified").length
  const withPhone = filteredLeads.filter(l => l.phone).length
  const withWebsite = filteredLeads.filter(l => l.website).length
  const avgRating = filteredLeads.length > 0 
    ? (filteredLeads.reduce((sum, l) => sum + (l.rating || 0), 0) / filteredLeads.filter(l => l.rating).length || 0).toFixed(1)
    : "—"

  const kpis = [
    { label: "Total Found", value: filteredLeads.length > 0 ? filteredLeads.length.toString() : "—", icon: Database, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Verified", value: filteredLeads.length > 0 ? verifiedCount.toString() : "—", icon: Award, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "With Phone", value: filteredLeads.length > 0 ? withPhone.toString() : "—", icon: Phone, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "With Website", value: filteredLeads.length > 0 ? withWebsite.toString() : "—", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Avg Rating", value: avgRating.toString(), icon: Star, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Selected", value: selectedRows.length > 0 ? selectedRows.length.toString() : "—", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
  ]

  return (
    <div className="space-y-6 pb-32">
      
      {/* 1. DISCOVERY ENGINE BAR */}
      <SmartSearchBar onSearch={handleSearch} isLoading={isSearching} />

      {/* Error Banner */}
      {searchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 flex items-center justify-between">
          <span className="text-[14px] font-medium">{searchError}</span>
          <button onClick={() => setSearchError(null)} className="text-[13px] underline">Dismiss</button>
        </div>
      )}

      {/* 2. KPI SECTION */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow group">
             <div className={`h-10 w-10 rounded-xl ${kpi.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
               <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
             </div>
             <p className="text-[13px] font-semibold text-gray-500 mb-1">{kpi.label}</p>
             <span className="text-2xl font-bold text-gray-900 leading-none">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* Inbox Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InboxDashboardWidget />
      </div>

      {/* 3. MAIN CONTENT: AI INSIGHTS + TABLE */}
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* AI Insights Card - only show when we have results */}
          {leads.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-indigo-950 uppercase tracking-wide">AI Discovery Insight</h3>
                  <p className="text-[14px] text-indigo-900/80 mt-0.5 font-medium">
                    Found {filteredLeads.length} businesses for "{lastQuery}". {verifiedCount} are verified on Google Maps.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => toggleFilter('Verified')}
                className={`px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-sm border transition-all whitespace-nowrap ${activeFilters.includes('Verified') ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-indigo-600 border-indigo-100 hover:shadow'}`}
              >
                Filter Verified
              </button>
            </div>
          )}

          {/* Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-[12px] text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
              <Filter className="h-4 w-4" /> All Filters
            </button>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            {['Has Phone', 'Has Website', 'Verified', 'High Rating (4.5+)', 'Recently Added'].map((filter) => (
              <button 
                key={filter} 
                onClick={() => toggleFilter(filter)}
                className={`whitespace-nowrap px-4 py-2 border rounded-[12px] text-[13px] font-medium transition-colors shadow-sm ${activeFilters.includes(filter) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* HERO TABLE */}
          {isSearching ? (
            <div className="h-64 bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center gap-4">
              <div className="relative h-14 w-14">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="text-[15px] font-semibold text-gray-900">Scanning Google Maps...</p>
                <p className="text-[13px] text-gray-500 mt-1">This may take 30–60 seconds</p>
              </div>
            </div>
          ) : (
            <DiscoveryTable 
              leads={filteredLeads}
              selectedRows={selectedRows}
              onToggleRow={toggleRow}
              onToggleAll={toggleAll}
              onRowClick={setDrawerLead}
            />
          )}

        </motion.div>
      </AnimatePresence>

      <FloatingStatus isSearching={isSearching} step={searchStep} />

      <BulkActionBar
        selectedLeads={leads.filter(l => selectedRows.includes(l._id))}
        onClear={() => setSelectedRows([])}
        onDelete={handleDelete}
        onAnalysisComplete={handleAnalysisComplete}
      />

      <LeadEnrichmentDrawer 
        isOpen={!!drawerLead} 
        onClose={() => setDrawerLead(null)} 
        lead={drawerLead} 
      />
      
    </div>
  )
}
