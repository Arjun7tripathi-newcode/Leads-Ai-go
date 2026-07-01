"use client"

import { motion } from "framer-motion"
import { Building2, LineChart, Users2, Rocket, Briefcase, Glasses } from "lucide-react"

const BENEFITS = [
  {
    title: "Marketing Agencies",
    description: "Build targeted outreach lists for your clients in minutes instead of days.",
    icon: <LineChart className="h-6 w-6" />
  },
  {
    title: "B2B Sales Teams",
    description: "Fill your CRM with highly qualified decision makers and their direct contact info.",
    icon: <Building2 className="h-6 w-6" />
  },
  {
    title: "Recruiters",
    description: "Discover passive candidates by scraping specific job titles from company websites.",
    icon: <Users2 className="h-6 w-6" />
  },
  {
    title: "Startups",
    description: "Hustle smarter by automating your early customer acquisition research.",
    icon: <Rocket className="h-6 w-6" />
  },
  {
    title: "Freelancers",
    description: "Find local businesses that need your services and contact them directly.",
    icon: <Briefcase className="h-6 w-6" />
  },
  {
    title: "Business Consultants",
    description: "Analyze market segments and build comprehensive lists of potential partners.",
    icon: <Glasses className="h-6 w-6" />
  }
]

export function BenefitsSection() {
  return (
    <section className="py-32 bg-[#fafafa] relative border-t border-black/[0.04]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-[56px] font-semibold tracking-tight text-[#0a0a0a] mb-6"
          >
            Built For Modern Growth Teams
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-xl text-gray-500 font-light max-w-2xl mx-auto"
          >
            Whether you're a team of one or one hundred, LeadFlow scales with your ambition.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((benefit, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
              className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-black/[0.04] mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
