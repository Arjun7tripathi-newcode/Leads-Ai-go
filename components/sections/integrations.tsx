"use client"

import { motion } from "framer-motion"

// Simplified array of 12 integrations
const INTEGRATIONS = [
  "GitHub", "Slack", "Discord", "Google Drive", 
  "Zapier", "Notion", "Airtable", "HubSpot",
  "Salesforce", "Jira", "Linear", "Figma"
]

export function Integrations() {
  return (
    <section className="py-32 bg-gray-50 relative overflow-hidden border-y border-black/[0.04]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-[56px] font-semibold tracking-tight text-[#0a0a0a] mb-6 leading-[1.1]"
          >
            Connects with your stack.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-xl text-gray-500 font-light"
          >
            WorkflowAI integrates seamlessly with the tools you already use every day.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {INTEGRATIONS.map((integration, index) => (
            <motion.div 
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/60 backdrop-blur-md rounded-[24px] p-8 flex flex-col items-center justify-center gap-4 border border-black/[0.04] shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-black/[0.08] transition-all duration-300 cursor-pointer aspect-square"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl font-bold text-gray-300 border border-black/[0.02]">
                {integration.charAt(0)}
              </div>
              <span className="font-medium text-gray-900 tracking-tight">{integration}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
