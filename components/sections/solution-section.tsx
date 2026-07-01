"use client"

import { motion } from "framer-motion"

export function SolutionSection() {
  return (
    <section className="py-40 bg-black text-white overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff_0%,transparent_50%)] blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 text-center">
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[13px] font-medium text-gray-400 tracking-[0.2em] uppercase mb-8"
        >
          The Solution
        </motion.p>

        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-[80px] font-semibold tracking-tighter leading-[1.05] mb-12"
        >
          AI-Powered <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">
            Lead Discovery.
          </span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="text-xl sm:text-3xl text-gray-400 leading-relaxed max-w-4xl mx-auto font-light"
        >
          LeadFlow AI automatically finds and verifies business information from multiple public sources. <span className="text-white font-medium">No manual research. No spreadsheets. No wasted time.</span>
        </motion.p>
        
      </div>
    </section>
  )
}
