"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Building2, MapPin, Globe, Mail, Phone, ExternalLink, Sparkles, TrendingUp } from "lucide-react"

const LinkedinIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const TwitterIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

interface LeadEnrichmentDrawerProps {
  isOpen: boolean
  onClose: () => void
  lead: any // For mock data right now
}

export function LeadEnrichmentDrawer({ isOpen, onClose, lead }: LeadEnrichmentDrawerProps) {
  if (!lead) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl z-50 border-l border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                   <Building2 className="h-5 w-5 text-indigo-600" />
                 </div>
                 <div>
                   <h2 className="text-lg font-semibold text-gray-900 leading-none mb-1">{lead.name}</h2>
                   <p className="text-[13px] text-gray-500 font-medium">{lead.industry || "Software Development"}</p>
                 </div>
               </div>
               <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                 <X className="h-5 w-5" />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Contact Information</h3>
                
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-[14px] font-medium text-gray-900">{lead.email}</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Verified</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-[14px] font-medium text-gray-900">{lead.phone || "+1 (555) 000-0000"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a href="#" className="text-[14px] font-medium text-indigo-600 hover:underline">www.{lead.name.toLowerCase().replace(' ', '')}.com</a>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-[14px] font-medium text-gray-900">{lead.location || "San Francisco, CA"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Enrichment */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                   <Sparkles className="h-5 w-5 text-indigo-600" />
                   <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">AI Lead Analysis</h3>
                 </div>
                 
                 <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-100/50">
                   <div className="flex items-center justify-between mb-4">
                     <span className="text-[13px] font-semibold text-indigo-900">Lead Quality Score</span>
                     <div className="flex items-center gap-2">
                       <TrendingUp className="h-4 w-4 text-emerald-600" />
                       <span className="text-lg font-bold text-emerald-600">{lead.score || 95}/100</span>
                     </div>
                   </div>
                   
                   <p className="text-[14px] text-indigo-900/80 leading-relaxed mb-4">
                     This lead matches your ICP perfectly. They recently expanded their marketing team and are likely looking for new tooling.
                   </p>

                   <div className="space-y-2">
                     <h4 className="text-[12px] font-bold text-indigo-900 uppercase tracking-wider">Recommended Outreach</h4>
                     <div className="bg-white rounded-xl p-3 border border-indigo-100 text-[13px] text-gray-700 italic">
                       "Hi [Name], noticed {lead.name} is scaling its marketing org. I have a strategy that could help streamline your lead pipeline..."
                     </div>
                   </div>
                 </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Social Presence</h3>
                <div className="flex gap-3">
                  <button className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors">
                    <LinkedinIcon className="h-5 w-5" />
                  </button>
                  <button className="flex items-center justify-center h-10 w-10 rounded-xl bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">
                    <TwitterIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

            </div>
            
            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-white grid grid-cols-2 gap-3">
               <button className="h-12 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-semibold text-[14px] hover:bg-gray-100 transition-colors">
                 Save Lead
               </button>
               <button className="h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[14px] shadow-md transition-colors">
                 Generate Email
               </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
