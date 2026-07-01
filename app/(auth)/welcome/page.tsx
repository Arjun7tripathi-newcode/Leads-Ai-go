"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center text-center py-12">
      <motion.div 
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
        className="relative mb-10"
      >
        <div className="absolute inset-0 bg-yellow-400 blur-[50px] opacity-20 rounded-full" />
        <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center border border-black/[0.08] shadow-[0_16px_32px_rgba(0,0,0,0.1)] relative z-10">
          <span className="text-4xl">🎉</span>
        </div>
        
        {/* Decorative Sparkles */}
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-0"
        >
          <Sparkles className="absolute -top-4 -right-4 h-6 w-6 text-yellow-400" />
          <Sparkles className="absolute -bottom-2 -left-6 h-5 w-5 text-indigo-400" />
        </motion.div>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl font-semibold tracking-tight text-[#0a0a0a] mb-4"
      >
        Welcome to LeadFlow AI
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-lg text-gray-500 font-light mb-12 max-w-[340px] leading-relaxed"
      >
        Your account is ready. Let's find your first 1,000 customers.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full"
      >
        <Link 
          href="/dashboard"
          className="w-full h-14 bg-black text-white rounded-xl text-[15px] font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] group"
        >
          Start Finding Leads
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  )
}
