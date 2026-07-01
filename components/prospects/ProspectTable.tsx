"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Copy, CheckCircle, Globe, Phone, Mail, MoreHorizontal, ArrowUpDown,
  Flame, Zap, Star, AlertCircle, TrendingDown, ExternalLink, Loader2
} from "lucide-react"
import { IProspect } from "@/models/Prospect"

interface ProspectTableProps {
  prospects: any[]
  selectedRows: string[]
  onToggleRow: (id: string) => void
  onToggleAll: () => void
  onRowClick: (prospect: any) => void
  onAnalyze: (id: string) => void
  analyzingId: string | null
}

// ── Copy Cell ─────────────────────────────────────────────────────────────────
function CopyCell({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="opacity-0 group-hover/cell:opacity-100 ml-1 p-0.5 rounded hover:bg-gray-100 transition-all flex-shrink-0">
      {copied ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-gray-400" />}
    </button>
  )
}

// ── SEO Score Badge ────────────────────────────────────────────────────────────
function SeoScoreBadge({ score }: { score: number | null }) {
  if (score === null || score === undefined) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">N/A</span>
  )
  if (score >= 90) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle className="h-3 w-3" />{score}
    </span>
  )
  if (score >= 70) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
      <Star className="h-3 w-3" />{score}
    </span>
  )
  if (score >= 40) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
      <AlertCircle className="h-3 w-3" />{score}
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
      <TrendingDown className="h-3 w-3" />{score}
    </span>
  )
}

// ── Website Status Badge ───────────────────────────────────────────────────────
function WebsiteStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'No Website':       'bg-red-50 text-red-700 border-red-200',
    'Poor Website':     'bg-orange-50 text-orange-700 border-orange-200',
    'Outdated Website': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Good Website':     'bg-blue-50 text-blue-700 border-blue-200',
    'Excellent Website':'bg-emerald-50 text-emerald-700 border-emerald-200',
  }
  const icons: Record<string, string> = {
    'No Website': '🚫', 'Poor Website': '⚠️', 'Outdated Website': '🔄',
    'Good Website': '✅', 'Excellent Website': '⭐',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border whitespace-nowrap ${styles[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {icons[status] || '?'} {status}
    </span>
  )
}

// ── Opportunity Score ──────────────────────────────────────────────────────────
function OpportunityBadge({ score }: { score: number }) {
  const emoji = score >= 85 ? '🔥' : score >= 70 ? '⚡' : score >= 50 ? '⭐' : '🟢'
  const color = score >= 85 ? 'text-red-600 bg-red-50 border-red-200' : score >= 70 ? 'text-amber-600 bg-amber-50 border-amber-200' : score >= 50 ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-gray-600 bg-gray-50 border-gray-200'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${color}`}>
      {emoji} {score}/100
    </span>
  )
}

// ── Lead Status Badge ──────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  'New':                'bg-gray-50 text-gray-600 border-gray-200',
  'Qualified':          'bg-blue-50 text-blue-700 border-blue-200',
  'Contacted':          'bg-purple-50 text-purple-700 border-purple-200',
  'Interested':         'bg-amber-50 text-amber-700 border-amber-200',
  'Meeting Scheduled':  'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Proposal Sent':      'bg-orange-50 text-orange-700 border-orange-200',
  'Won':                'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Lost':               'bg-red-50 text-red-600 border-red-200',
}

export function ProspectTable({ prospects, selectedRows, onToggleRow, onToggleAll, onRowClick, onAnalyze, analyzingId }: ProspectTableProps) {
  const allSelected = prospects.length > 0 && selectedRows.length === prospects.length

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/80 sticky top-0 z-10">
            <tr>
              <th className="pl-5 pr-3 py-3.5 w-10">
                <input type="checkbox" checked={allSelected} onChange={onToggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
              </th>
              {[
                'Business', 'Category', 'Phone', 'Website', 'SEO Score',
                'Website Status', 'Rating', 'Opportunity', 'Recommended Service', 'Status', ''
              ].map((col) => (
                <th key={col} className="px-3 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {col && (
                    <button className="flex items-center gap-1 hover:text-gray-800 transition-colors">
                      {col} {col !== '' && <ArrowUpDown className="h-3 w-3 opacity-30" />}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/80">
            <AnimatePresence>
              {prospects.map((p, idx) => {
                const isSelected = selectedRows.includes(String(p._id))
                const initials = (p.name || '').split(' ').map((n: string) => n[0] || '').join('').toUpperCase().slice(0, 2) || 'PR'
                const hue = (p.name?.charCodeAt(0) || 50) % 360
                const isAnalyzing = analyzingId === (String(p._id))
                const website = (p as any).company?.website || null

                return (
                  <motion.tr
                    key={String(p._id)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.015 }}
                    onClick={() => onRowClick(p)}
                    className={`group cursor-pointer transition-all hover:bg-indigo-50/20 ${isSelected ? 'bg-indigo-50/50 ring-1 ring-inset ring-indigo-200' : 'bg-white'}`}
                  >
                    {/* Checkbox */}
                    <td className="pl-5 pr-3 py-3.5" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={isSelected} onChange={() => onToggleRow(String(p._id))}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                    </td>

                    {/* Business */}
                    <td className="px-3 py-3.5 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                          style={{ background: `hsl(${hue},60%,55%)` }}>
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-gray-900 truncate max-w-[160px] group-hover:text-indigo-700 transition-colors">{p.name}</p>
                          <p className="text-[11px] text-gray-400 truncate max-w-[160px]">{p.location || '—'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-3 py-3.5 min-w-[120px]">
                      <span className="text-[12px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md font-medium truncate max-w-[110px] block">
                        {(p as any).category || p.company?.industry || '—'}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="px-3 py-3.5 min-w-[130px]">
                      <div className="group/cell flex items-center gap-1">
                        {p.phone ? (
                          <><Phone className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" /><span className="text-[12px] text-gray-700">{p.phone}</span><CopyCell text={p.phone} /></>
                        ) : <span className="text-[12px] text-gray-300">—</span>}
                      </div>
                    </td>

                    {/* Website */}
                    <td className="px-3 py-3.5 min-w-[140px]">
                      {website ? (
                        <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-[12px] text-indigo-600 hover:text-indigo-800 font-medium max-w-[120px] truncate">
                          <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{website.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-50" />
                        </a>
                      ) : (
                        <span className="text-[12px] text-red-500 font-semibold flex items-center gap-1">
                          🚫 No Website
                        </span>
                      )}
                    </td>

                    {/* SEO Score */}
                    <td className="px-3 py-3.5 min-w-[90px]">
                      <SeoScoreBadge score={(p as any).seoScore} />
                    </td>

                    {/* Website Status */}
                    <td className="px-3 py-3.5 min-w-[150px]">
                      <WebsiteStatusBadge status={(p as any).websiteStatus || 'No Website'} />
                    </td>

                    {/* Google Rating */}
                    <td className="px-3 py-3.5 min-w-[90px]">
                      {(p as any).googleRating ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-[12px] font-semibold text-gray-700">{(p as any).googleRating.toFixed(1)}</span>
                          <span className="text-[11px] text-gray-400">({(p as any).reviewCount || 0})</span>
                        </div>
                      ) : <span className="text-[12px] text-gray-300">—</span>}
                    </td>

                    {/* Opportunity Score */}
                    <td className="px-3 py-3.5 min-w-[110px]">
                      <OpportunityBadge score={(p as any).opportunityScore || 0} />
                    </td>

                    {/* Recommended Service */}
                    <td className="px-3 py-3.5 min-w-[200px]">
                      {(p as any).recommendedService ? (
                        <div className="flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                          <span className="text-[12px] font-medium text-gray-700 truncate max-w-[160px]">
                            {(p as any).recommendedService}
                          </span>
                        </div>
                      ) : <span className="text-[12px] text-gray-300">Not analyzed</span>}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3.5 min-w-[130px]">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${STATUS_STYLES[p.status] || STATUS_STYLES['New']}`}>
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3.5 min-w-[70px]" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onAnalyze(String(p._id))}
                          disabled={isAnalyzing}
                          title="AI Analyze"
                          className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600 transition-all disabled:opacity-50"
                        >
                          {isAnalyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>

        {prospects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
              <Globe className="h-7 w-7 text-indigo-300" />
            </div>
            <p className="text-[14px] font-semibold text-gray-600">No prospects match your filters</p>
            <p className="text-[13px] text-gray-400 mt-1">Try adjusting your search or import leads from Discovery</p>
          </div>
        )}
      </div>

      {prospects.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <p className="text-xs text-gray-400">Showing <span className="font-semibold text-gray-600">{prospects.length}</span> prospects</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-white transition-colors">Previous</button>
            <button className="px-3 py-1.5 text-xs font-medium bg-gray-900 text-white rounded-lg hover:bg-black transition-colors">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
