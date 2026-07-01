"use client"

import { motion } from "framer-motion"
import { MapPin, Mail, Phone, Network, Globe, ShieldCheck } from "lucide-react"

const FEATURES = [
  {
    title: "Google Maps Lead Scraper",
    description: "Extract Business Name, Email, Phone, Website, and Reviews directly from Maps.",
    icon: <MapPin className="h-6 w-6" />,
  },
  {
    title: "Email Finder",
    description: "Find verified professional emails associated with any domain or company name.",
    icon: <Mail className="h-6 w-6" />,
  },
  {
    title: "Phone Number Extractor",
    description: "Get business contact numbers instantly to power your cold calling campaigns.",
    icon: <Phone className="h-6 w-6" />,
  },
  {
    title: "LinkedIn Lead Finder",
    description: "Discover decision makers, their roles, and direct contact information.",
    icon: <Network className="h-6 w-6" />,
  },
  {
    title: "Website Contact Extractor",
    description: "Scan company websites automatically to uncover hidden contact details.",
    icon: <Globe className="h-6 w-6" />,
  },
  {
    title: "AI Lead Qualification",
    description: "Score leads automatically based on your ideal customer profile.",
    icon: <ShieldCheck className="h-6 w-6" />,
  }
]

export function FeatureShowcase() {
  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
              className="bg-gray-50/50 rounded-[32px] p-8 border border-black/[0.04] hover:bg-gray-50 hover:border-black/[0.08] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-black/[0.04] shadow-sm mb-8 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
