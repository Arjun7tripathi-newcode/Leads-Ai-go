"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, Mail, Phone, Globe, MapPin, Sparkles, Zap, PhoneCall, Send,
  Copy, CheckCircle, ExternalLink, Star, TrendingUp, AlertTriangle,
  ShieldCheck, Smartphone, FileText, Image, Link, Code, MessageSquare,
  Calendar, Loader2, ArrowRight
} from "lucide-react"
import { IProspect } from "@/models/Prospect"

interface ProspectDrawerProps {
  prospect: any | null
  isOpen: boolean
  onClose: () => void
  onAnalyze: (id: string) => void
  analyzingId: string | null
}

const STATUS_STYLES: Record<string, string> = {
  'New': 'bg-gray-50 text-gray-600 border-gray-200',
  'Qualified': 'bg-blue-50 text-blue-700 border-blue-200',
  'Contacted': 'bg-purple-50 text-purple-700 border-purple-200',
  'Interested': 'bg-amber-50 text-amber-700 border-amber-200',
  'Meeting Scheduled': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Proposal Sent': 'bg-orange-50 text-orange-700 border-orange-200',
  'Won': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Lost': 'bg-red-50 text-red-600 border-red-200',
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="p-1 rounded-md hover:bg-gray-200 transition-colors flex-shrink-0">
      {copied ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
    </button>
  )
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 20, circ = 2 * Math.PI * r
  const offset = circ - (Math.min(score, 100) / 100) * circ
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-14 h-14">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={r} fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
          <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="3.5"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">{score}</span>
      </div>
      <span className="text-[10px] font-semibold text-gray-400 text-center leading-tight uppercase tracking-wide">{label}</span>
    </div>
  )
}

function CheckRow({ label, value, icon: Icon }: { label: string; value: boolean | undefined; icon: any }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-[12px] text-gray-600">{label}</span>
      </div>
      {value === undefined ? (
        <span className="text-[11px] text-gray-300">—</span>
      ) : value ? (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
          <CheckCircle className="h-3.5 w-3.5" /> Yes
        </span>
      ) : (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-red-500">
          <AlertTriangle className="h-3.5 w-3.5" /> Missing
        </span>
      )}
    </div>
  )
}

const OUTREACH_TYPES = [
  { type: 'cold_email', label: 'Cold Email', icon: Mail },
  { type: 'whatsapp', label: 'WhatsApp Message', icon: MessageSquare },
  { type: 'linkedin', label: 'LinkedIn Message', icon: ExternalLink },
  { type: 'call_script', label: 'Discovery Call Script', icon: PhoneCall },
  { type: 'proposal', label: 'Sales Proposal', icon: Send },
  { type: 'follow_up', label: 'Follow-up Email', icon: Calendar },
]

export function ProspectDrawer({ prospect, isOpen, onClose, onAnalyze, analyzingId }: ProspectDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'seo' | 'outreach'>('overview')
  const [generatingType, setGeneratingType] = useState<string | null>(null)
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({})

  const handleGenerate = async (type: string) => {
    if (!prospect) return
    setGeneratingType(type)
    try {
      const res = await fetch('/api/prospects/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospectId: (prospect as any)._id, type }),
      })
      const data = await res.json()
      if (data.content) setGeneratedContent(prev => ({ ...prev, [type]: data.content }))
    } catch { /* silent */ }
    finally { setGeneratingType(null) }
  }

  if (!prospect) return null

  const p = prospect as any
  const initials = (prospect.name || '').split(' ').map((n: string) => n[0] || '').join('').toUpperCase().slice(0, 2) || 'PR'
  const hue = (prospect.name?.charCodeAt(0) || 0) % 360
  const statusStyle = STATUS_STYLES[prospect.status] || STATUS_STYLES['New']
  const hasWebsite = !!p.company?.website
  const seoAnalysis = p.seoAnalysis || {}
  const websiteAnalysis = p.websiteAnalysis || {}
  const isAnalyzing = analyzingId === String(p._id)

  const opportunityEmoji = p.opportunityScore >= 85 ? '🔥' : p.opportunityScore >= 70 ? '⚡' : '⭐'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40" onClick={onClose} />

          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-full w-[520px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200"
          >
            {/* ── Header ── */}
            <div className="flex-shrink-0 p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
                    style={{ background: `hsl(${hue},60%,55%)` }}>
                    {initials}
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold text-gray-900 leading-tight">{prospect.name}</h2>
                    <p className="text-[12px] text-gray-500 mt-0.5">{p.category || p.company?.industry || 'Local Business'} · {prospect.location}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusStyle}`}>{prospect.status}</span>
                      {p.opportunityScore >= 70 && (
                        <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                          {opportunityEmoji} {p.opportunityScore}/100 Opportunity
                        </span>
                      )}
                      {!hasWebsite && (
                        <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">🚫 No Website</span>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Analyze Button */}
              <button
                onClick={() => onAnalyze(String(p._id))}
                disabled={isAnalyzing}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-[13px] font-semibold transition-all shadow-md shadow-indigo-500/25 disabled:opacity-70"
              >
                {isAnalyzing ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing Website...</> : <><Sparkles className="h-4 w-4" /> {p.isAnalyzed ? 'Re-Analyze Business' : 'AI Analyze Business'}</>}
              </button>
            </div>

            {/* ── Tabs ── */}
            <div className="flex border-b border-gray-100 px-4 flex-shrink-0 bg-gray-50/30">
              {[{ id: 'overview', label: '📋 Overview' }, { id: 'seo', label: '📈 SEO & Website' }, { id: 'outreach', label: '✉️ Outreach' }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-[13px] font-medium border-b-2 mr-1 transition-colors ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto">

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="p-5 space-y-5">

                  {/* Opportunity Card */}
                  <div className="bg-gradient-to-br from-indigo-50 via-violet-50/50 to-purple-50 border border-indigo-100 rounded-2xl p-4">
                    <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-3">🎯 Opportunity Analysis</p>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <ScoreRing score={p.opportunityScore || 0} label="Opportunity" color="#6366f1" />
                      <ScoreRing score={p.seoScore ?? 0} label="SEO Score" color={p.seoScore >= 70 ? "#10b981" : p.seoScore >= 40 ? "#f59e0b" : "#ef4444"} />
                      <ScoreRing score={p.leadScore || 0} label="Lead Score" color="#8b5cf6" />
                    </div>

                    {/* Problem → Service → Value */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 p-3 bg-white/80 rounded-xl border border-red-100">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[11px] font-bold text-red-600 uppercase tracking-wide">Problem</p>
                          <p className="text-[12px] text-gray-700 mt-0.5">{!hasWebsite ? "No website found for this business." : p.seoScore < 40 ? `Critical SEO score of ${p.seoScore}/100.` : "Website needs digital marketing improvements."}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-gray-300" />
                      </div>
                      <div className="flex items-start gap-2 p-3 bg-white/80 rounded-xl border border-indigo-100">
                        <Zap className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide">Recommended Service</p>
                          <p className="text-[12px] font-semibold text-gray-800 mt-0.5">{p.recommendedService || 'Website Development'}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-gray-300" />
                      </div>
                      <div className="flex items-start gap-2 p-3 bg-white/80 rounded-xl border border-emerald-100">
                        <TrendingUp className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">Estimated Deal Value</p>
                          <p className="text-[13px] font-bold text-gray-800 mt-0.5">{p.estimatedDealValue || '₹15,000 – ₹50,000'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Summary */}
                  {p.aiAnalysis?.summary && (
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 border border-gray-100 rounded-xl">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">✦ AI Summary</p>
                      <p className="text-[13px] text-gray-700 leading-relaxed">{p.aiAnalysis.summary}</p>
                    </div>
                  )}

                  {/* Growth Opportunities */}
                  {p.aiAnalysis?.growthOpportunities?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">🚀 Growth Opportunities</p>
                      <div className="space-y-2">
                        {p.aiAnalysis.growthOpportunities.map((opp: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                            <p className="text-[12px] font-medium text-emerald-800">{opp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Contact</p>
                    <div className="space-y-2">
                      {prospect.phone && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-[13px] font-medium text-gray-800">{prospect.phone}</span>
                          </div>
                          <CopyButton text={prospect.phone} />
                        </div>
                      )}
                      {prospect.email && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-[13px] font-medium text-gray-800">{prospect.email}</span>
                          </div>
                          <CopyButton text={prospect.email} />
                        </div>
                      )}
                      {prospect.location && (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-[13px] font-medium text-gray-800">{prospect.location}</span>
                        </div>
                      )}
                      {p.googleRating && (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                          <span className="text-[13px] font-medium text-gray-800">{p.googleRating} stars · {p.reviewCount || 0} reviews on Google</span>
                        </div>
                      )}
                      {p.company?.website && (
                        <a href={p.company.website.startsWith('http') ? p.company.website : `https://${p.company.website}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-indigo-500" />
                            <span className="text-[13px] font-medium text-indigo-700 truncate max-w-[300px]">{p.company.website}</span>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SEO & WEBSITE TAB */}
              {activeTab === 'seo' && (
                <div className="p-5 space-y-5">
                  {!p.isAnalyzed ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                        <Sparkles className="h-7 w-7 text-indigo-400" />
                      </div>
                      <p className="text-[14px] font-semibold text-gray-700">No analysis yet</p>
                      <p className="text-[12px] text-gray-400 mt-1 mb-5">Click "AI Analyze Business" to get website & SEO data</p>
                      <button onClick={() => onAnalyze(String(p._id))} disabled={isAnalyzing}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-60">
                        {isAnalyzing ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="h-4 w-4" /> Analyze Now</>}
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Website Status */}
                      <div className={`p-4 rounded-2xl border ${!hasWebsite ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                        <p className="text-[11px] font-bold uppercase tracking-widest mb-1 ${!hasWebsite ? 'text-red-500' : 'text-emerald-600'}">{!hasWebsite ? '🚫 Website Status' : '🌐 Website Status'}</p>
                        <p className="text-[15px] font-bold text-gray-900">{p.websiteStatus || 'No Website'}</p>
                        {p.seoScore !== null && <p className="text-[12px] text-gray-500 mt-1">SEO Score: <strong className="text-gray-800">{p.seoScore}/100</strong></p>}
                      </div>

                      {/* SEO Analysis */}
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">📊 SEO Analysis</p>
                        <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50 overflow-hidden">
                          <CheckRow label="Page Title" value={seoAnalysis.hasTitle} icon={FileText} />
                          <CheckRow label="Meta Description" value={seoAnalysis.hasMetaDescription} icon={FileText} />
                          <CheckRow label="H1 Heading" value={seoAnalysis.hasH1} icon={FileText} />
                          <CheckRow label="Schema Markup" value={seoAnalysis.hasSchema} icon={Code} />
                          <CheckRow label="SSL Certificate" value={seoAnalysis.hasSSL} icon={ShieldCheck} />
                          <CheckRow label="Mobile Viewport" value={seoAnalysis.hasMobileViewport} icon={Smartphone} />
                          <CheckRow label="Contact Form" value={seoAnalysis.hasContactForm} icon={MessageSquare} />
                          <CheckRow label="Open Graph Tags" value={seoAnalysis.hasOpenGraph} icon={Image} />
                        </div>
                        {seoAnalysis.wordCount > 0 && (
                          <p className="text-[12px] text-gray-500 mt-2 pl-1">~{seoAnalysis.wordCount.toLocaleString()} words · {seoAnalysis.imageCount} images detected</p>
                        )}
                      </div>

                      {/* Website Analysis */}
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">🖥️ Website Quality</p>
                        <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50 overflow-hidden">
                          <CheckRow label="Mobile Responsive" value={websiteAnalysis.isResponsive} icon={Smartphone} />
                          <CheckRow label="Live Chat" value={websiteAnalysis.hasLiveChat} icon={MessageSquare} />
                          <CheckRow label="Booking System" value={websiteAnalysis.hasBookingSystem} icon={Calendar} />
                          <CheckRow label="Trust Signals" value={websiteAnalysis.hasTrustSignals} icon={ShieldCheck} />
                          <CheckRow label="Social Media Links" value={websiteAnalysis.hasSocialMedia} icon={Link} />
                        </div>
                        {websiteAnalysis.designQuality && (
                          <p className="text-[12px] text-gray-500 mt-2 pl-1">Design Quality: <strong className="text-gray-800">{websiteAnalysis.designQuality}</strong></p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* OUTREACH TAB */}
              {activeTab === 'outreach' && (
                <div className="p-5 space-y-4">
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <p className="text-[12px] font-semibold text-indigo-700">✦ Context for AI</p>
                    <p className="text-[12px] text-indigo-600 mt-1">Service: <strong>{p.recommendedService || 'Website Development'}</strong> · Value: <strong>{p.estimatedDealValue || '₹15,000–₹50,000'}</strong></p>
                  </div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Generate Outreach</p>
                  <div className="space-y-2">
                    {OUTREACH_TYPES.map(({ type, label, icon: Icon }) => (
                      <div key={type}>
                        <button onClick={() => handleGenerate(type)} disabled={generatingType !== null}
                          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 transition-all group disabled:opacity-50">
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                            {label}
                          </div>
                          {generatingType === type
                            ? <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                            : <Sparkles className="h-3.5 w-3.5 text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </button>
                        <AnimatePresence>
                          {generatedContent[type] && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                              <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                <p className="text-[12px] text-gray-700 leading-relaxed whitespace-pre-wrap">{generatedContent[type]}</p>
                                <button onClick={() => navigator.clipboard.writeText(generatedContent[type])}
                                  className="mt-3 flex items-center gap-1.5 text-[12px] text-indigo-600 font-semibold hover:text-indigo-800">
                                  <Copy className="h-3 w-3" /> Copy text
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex gap-2 flex-shrink-0 bg-gray-50/30">
              <a 
                href={prospect.email ? `mailto:${prospect.email}` : '#'} 
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-colors shadow-sm ${prospect.email ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                onClick={e => !prospect.email && e.preventDefault()}
              >
                <Mail className="h-4 w-4" /> Send Email
              </a>
              <a 
                href={prospect.phone ? `tel:${prospect.phone}` : '#'} 
                className={`px-4 py-2.5 border rounded-xl text-[13px] font-medium transition-colors flex items-center gap-2 ${prospect.phone ? 'border-gray-200 text-gray-600 hover:bg-gray-100' : 'border-gray-100 text-gray-300 cursor-not-allowed'}`}
                onClick={e => !prospect.phone && e.preventDefault()}
              >
                <PhoneCall className="h-4 w-4" /> Call
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
