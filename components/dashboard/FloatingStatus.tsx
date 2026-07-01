"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Search, Globe, Mail, Phone, Sparkles } from "lucide-react"

const searchStatuses = [
  { icon: Search, text: "Searching Google Maps..." },
  { icon: Globe, text: "Extracting Websites..." },
  { icon: Mail, text: "Finding Emails..." },
  { icon: Phone, text: "Verifying Contacts..." },
  { icon: Sparkles, text: "AI Scoring Leads..." },
]

export function FloatingStatus({ isSearching, step }: { isSearching: boolean, step: number }) {
  return (
    <AnimatePresence>
      {isSearching && (
        <div className="fixed bottom-8 right-8 z-50">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white/90 backdrop-blur-xl border border-indigo-100 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] w-80 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-50">
               <motion.div 
                 className="h-full bg-indigo-600"
                 initial={{ width: "0%" }}
                 animate={{ width: `${((step + 1) / searchStatuses.length) * 100}%` }}
                 transition={{ duration: 0.5 }}
               />
            </div>
            <div className="flex items-center gap-4">
               <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center animate-pulse">
                 {searchStatuses[step] && (() => {
                   const Icon = searchStatuses[step].icon
                   return <Icon className="h-5 w-5 text-indigo-600" />
                 })()}
               </div>
               <div>
                 <h3 className="text-[14px] font-semibold text-gray-900">
                   {searchStatuses[step]?.text}
                 </h3>
                 <p className="text-[12px] text-gray-500 mt-0.5">Live extraction in progress</p>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
