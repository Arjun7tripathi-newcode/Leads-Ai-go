"use client"

import { motion } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative py-40 overflow-hidden bg-black text-white">
      
      {/* Premium Spotlight Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[800px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#ffffff_0%,transparent_70%)] blur-[120px]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl md:text-[96px] font-semibold tracking-tighter mb-8 leading-[1.05]"
        >
          Stop Searching. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-600">
            Start Selling.
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto mb-16 font-light"
        >
          Generate targeted business leads in minutes and grow faster with AI.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <a 
            href="/signup"
            className="inline-flex justify-center items-center gap-2 bg-white hover:bg-gray-100 text-[#0a0a0a] rounded-full px-8 h-14 text-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm w-full sm:w-auto group"
          >
            Start Free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href="#demo"
            className="inline-flex justify-center items-center gap-2 bg-transparent hover:bg-white/5 text-white border border-white/20 rounded-full px-8 h-14 text-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <Play className="h-4 w-4 fill-current" />
            Book Demo
          </a>
        </motion.div>
      </div>
    </section>
  )
}
