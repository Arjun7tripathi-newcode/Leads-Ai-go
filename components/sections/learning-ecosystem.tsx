"use client"

import { motion } from "framer-motion"

const ECOSYSTEM = [
  {
    title: "Learn",
    links: ["Academy", "Documentation", "Tutorials", "Webinars"],
  },
  {
    title: "Build",
    links: ["Templates", "SDKs", "API Reference", "Component Library"],
  },
  {
    title: "Connect",
    links: ["Discord Community", "Support Forum", "Developer Events", "Partner Network"],
  },
]

export function LearningEcosystem() {
  return (
    <section className="py-32 bg-white border-t border-black/[0.04]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-semibold tracking-tight text-[#0a0a0a]"
          >
            A thriving ecosystem.
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-16">
          {ECOSYSTEM.map((column, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold text-[#0a0a0a] mb-8">{column.title}</h3>
              <ul className="space-y-4">
                {column.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-lg text-gray-500 hover:text-black transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
