"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle2, Star, Search, Download, BarChart3 } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      
      {/* Left Panel - Product Showcase (60%) */}
      <div className="hidden md:flex w-[60%] bg-[#fafafa] border-r border-black/[0.04] p-12 lg:p-20 flex-col relative overflow-hidden">
        
        {/* Background Subtle Glow */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,#6366f1_0%,transparent_50%)] blur-[120px]" />
        </div>

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 mb-16 relative z-10 group w-fit">
          <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <span className="text-white font-bold text-sm leading-none">L</span>
          </div>
          <span className="font-semibold text-lg tracking-tight text-[#0a0a0a]">LeadFlow AI</span>
        </Link>

        {/* Copy */}
        <div className="relative z-10 max-w-xl mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl lg:text-6xl font-semibold tracking-tighter text-[#0a0a0a] leading-[1.05] mb-6"
          >
            Generate Leads <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
              While You Sleep.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-xl text-gray-500 font-light leading-relaxed"
          >
            Find verified business leads, emails, phone numbers, and decision-makers using AI-powered prospecting.
          </motion.p>
        </div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="flex flex-wrap gap-8 mb-16 relative z-10"
        >
          <div>
            <div className="flex gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-sm font-medium text-gray-900">Trusted by 10,000+ marketers</p>
          </div>
          <div className="w-px h-10 bg-black/[0.08]" />
          <div>
            <p className="text-2xl font-bold text-gray-900 leading-none mb-1">10M+</p>
            <p className="text-sm font-medium text-gray-500">Leads Generated</p>
          </div>
          <div className="w-px h-10 bg-black/[0.08]" />
          <div>
            <p className="text-2xl font-bold text-gray-900 leading-none mb-1">99.9%</p>
            <p className="text-sm font-medium text-gray-500">Uptime</p>
          </div>
        </motion.div>

        {/* Floating Mockup (Absolute) */}
        <motion.div 
          initial={{ opacity: 0, y: 40, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="absolute right-[-10%] bottom-[-5%] w-[80%] rounded-tl-3xl border border-black/[0.08] bg-white shadow-[0_32px_64px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col z-20"
        >
          <div className="h-12 border-b border-black/[0.04] bg-gray-50/50 flex items-center px-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black/[0.08] rounded-md text-xs font-medium text-gray-700 shadow-sm w-64">
               <Search className="h-3 w-3 text-gray-400" /> SEO Agencies in Austin
             </div>
          </div>
          <div className="p-4 bg-white/50 backdrop-blur-xl">
             <div className="flex gap-4 mb-4">
               <div className="flex-1 bg-white p-3 rounded-xl border border-black/[0.04] shadow-sm">
                 <p className="text-[10px] text-gray-500 font-medium mb-1">Emails Verified</p>
                 <p className="text-lg font-semibold text-gray-900">1,204</p>
               </div>
               <div className="flex-1 bg-white p-3 rounded-xl border border-black/[0.04] shadow-sm">
                 <p className="text-[10px] text-gray-500 font-medium mb-1">Export Ready</p>
                 <button className="mt-1 flex items-center gap-1 px-2 py-1 bg-black text-white rounded text-[10px] font-medium">
                   <Download className="h-3 w-3" /> CSV
                 </button>
               </div>
             </div>
             
             <div className="space-y-2">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="bg-white p-3 rounded-xl border border-black/[0.04] flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-gray-100" />
                     <div>
                       <div className="h-3 w-24 bg-gray-200 rounded-full mb-1" />
                       <div className="h-2 w-16 bg-gray-100 rounded-full" />
                     </div>
                   </div>
                   <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                 </div>
               ))}
             </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Form Area (40%) */}
      <div className="w-full md:w-[40%] flex flex-col relative z-30 bg-white min-h-screen overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 py-12 max-w-[520px] mx-auto w-full">
          {/* Mobile Header (Only visible on small screens) */}
          <Link href="/" className="md:hidden flex items-center gap-2 mb-12 group w-fit">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none">L</span>
            </div>
            <span className="font-semibold text-lg tracking-tight text-[#0a0a0a]">LeadFlow AI</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </div>
      
    </div>
  )
}
