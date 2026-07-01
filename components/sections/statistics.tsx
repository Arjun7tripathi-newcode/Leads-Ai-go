"use client"

import { motion } from "framer-motion"

const STATS = [
  { value: "10M+", label: "Leads Generated" },
  { value: "100K+", label: "Businesses Served" },
  { value: "50+", label: "Countries" },
  { value: "99.9%", label: "Uptime" }
]

export function Statistics() {
  return (
    <section className="py-32 bg-white relative border-t border-black/[0.04]">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-8 divide-x divide-black/[0.04]">
          {STATS.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 text-[#0a0a0a]">
                {stat.value}
              </div>
              <div className="text-gray-500 font-medium text-lg lg:text-xl tracking-tight">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
