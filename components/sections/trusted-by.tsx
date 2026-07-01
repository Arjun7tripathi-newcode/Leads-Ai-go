"use client"

import { motion } from "framer-motion"

const LOGOS = [
  "Google", "HubSpot", "Shopify", "Slack", "Notion", "Stripe", "Vercel", "Linear"
]

export function TrustedBy() {
  return (
    <section className="py-20 bg-white overflow-hidden relative">
      <div className="container mx-auto px-4 mb-12">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-[13px] font-medium text-gray-400 tracking-[0.2em] uppercase"
        >
          Trusted By Growth Teams Worldwide
        </motion.p>
      </div>

      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10"
          style={{ background: "linear-gradient(to right, #fff 0%, transparent 100%)" }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10"
          style={{ background: "linear-gradient(to left, #fff 0%, transparent 100%)" }} />

        <div
          className="flex items-center gap-20"
          style={{
            animation: "marquee-track 40s linear infinite",
            width: "max-content",
          }}
        >
          {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
            <span
              key={i}
              className="text-2xl sm:text-3xl font-bold text-gray-300 whitespace-nowrap tracking-tight px-4 hover:text-gray-900 transition-colors duration-500 cursor-default"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-track {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  )
}
