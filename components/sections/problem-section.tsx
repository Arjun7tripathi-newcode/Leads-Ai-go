"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"

const PAIN_POINTS = [
  "Hours spent manually searching for contacts.",
  "Outdated contact data leading to bounced emails.",
  "Low response rates from poor targeting.",
  "Expensive lead databases with recycled lists.",
  "Wasting time on unqualified prospects."
]

export function ProblemSection() {
  return (
    <section className="py-32 bg-[#fafafa] relative overflow-hidden border-t border-black/[0.04]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-[56px] font-semibold tracking-tight text-[#0a0a0a] mb-6 leading-[1.1]"
          >
            Manual Prospecting Is Broken.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-xl text-gray-500 font-light max-w-2xl mx-auto"
          >
            Your sales team should be selling, not acting as data researchers.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PAIN_POINTS.map((point, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
              className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-sm flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-2">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-lg font-medium text-gray-900 leading-relaxed">
                {point}
              </p>
            </motion.div>
          ))}
          
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: PAIN_POINTS.length * 0.1 }}
             className="bg-gray-100 rounded-[24px] p-8 border border-black/[0.04] shadow-inner flex flex-col justify-center items-center text-center gap-4 sm:col-span-2 lg:col-span-1"
          >
             <p className="text-lg font-medium text-gray-400 italic">
               There has to be a better way...
             </p>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
