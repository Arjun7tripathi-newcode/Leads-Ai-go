"use client"

import { motion } from "framer-motion"
import { Search, Download, Sparkles } from "lucide-react"

const STEPS = [
  {
    number: "01",
    title: "Enter Search Query",
    description: "Tell AI what you're looking for.",
    example: '"Digital Marketing Agencies in London"',
    icon: <Search className="h-6 w-6" />
  },
  {
    number: "02",
    title: "AI Collects Data",
    description: "Extracts Emails, Phones, Websites, and Social Profiles in real-time.",
    example: "Scanning 5+ data sources...",
    icon: <Sparkles className="h-6 w-6" />
  },
  {
    number: "03",
    title: "Export Leads",
    description: "Download ready-to-use lists directly to your CRM or spreadsheet.",
    example: "CSV, Excel, Google Sheets, CRM",
    icon: <Download className="h-6 w-6" />
  }
]

export function HowItWorks() {
  return (
    <section className="py-32 bg-[#fafafa] relative border-t border-black/[0.04]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-[56px] font-semibold tracking-tight text-[#0a0a0a]"
          >
            How It Works
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 relative">
          
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

          {STEPS.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.2 }}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Step Number Badge */}
              <div className="w-24 h-24 rounded-full bg-white border border-black/[0.04] shadow-[0_8px_16px_rgba(0,0,0,0.04)] flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500">
                <span className="text-2xl font-bold text-gray-900 tracking-tighter">
                  {step.number}
                </span>
                <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-black/[0.04]">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-500 mb-8 text-lg font-light leading-relaxed max-w-sm">
                {step.description}
              </p>

              {/* Example Box */}
              <div className="w-full bg-white rounded-2xl p-6 border border-black/[0.04] shadow-sm group-hover:border-black/[0.08] transition-colors">
                <p className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Example</p>
                <p className="font-mono text-sm text-gray-800 break-words">{step.example}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
