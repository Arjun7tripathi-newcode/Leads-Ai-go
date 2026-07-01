"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

const PLANS = [
  {
    name: "Starter",
    price: "$49",
    description: "Perfect for solo founders and freelancers.",
    features: [
      "1,000 verified leads / month",
      "Google Maps Scraper",
      "Email Finder",
      "CSV Export",
      "Standard Support"
    ],
    highlighted: false
  },
  {
    name: "Growth",
    price: "$99",
    description: "For scaling teams that need more volume.",
    features: [
      "5,000 verified leads / month",
      "Everything in Starter",
      "LinkedIn Lead Finder",
      "CRM Integration",
      "Priority Support"
    ],
    highlighted: true
  },
  {
    name: "Agency",
    price: "$199",
    description: "Built for marketing agencies managing clients.",
    features: [
      "25,000 verified leads / month",
      "Everything in Growth",
      "Website Contact Extractor",
      "API Access",
      "Custom Webhooks"
    ],
    highlighted: false
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Unlimited power for enterprise sales teams.",
    features: [
      "Unlimited leads",
      "Custom Data Extraction",
      "Dedicated Account Manager",
      "SLA Guarantee",
      "Custom Onboarding"
    ],
    highlighted: false
  }
]

export function Pricing() {
  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-[56px] font-semibold tracking-tight text-[#0a0a0a] mb-6"
          >
            Simple, transparent pricing.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-xl text-gray-500 font-light max-w-2xl mx-auto"
          >
            Start for free, upgrade when you need more leads.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-center">
          {PLANS.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
              className={`rounded-[32px] p-8 border ${plan.highlighted ? 'border-black bg-[#fafafa] shadow-xl lg:scale-105 relative z-10' : 'border-black/[0.04] bg-white shadow-sm'}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-6 h-10">{plan.description}</p>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tighter text-gray-900">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-gray-500">/mo</span>}
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                    <Check className={`h-5 w-5 ${plan.highlighted ? 'text-black' : 'text-gray-400'}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className={`w-full py-4 rounded-xl text-sm font-semibold transition-all duration-300 ${plan.highlighted ? 'bg-black text-white hover:bg-black/90 shadow-md hover:shadow-lg' : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-black/[0.04]'}`}
              >
                {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
