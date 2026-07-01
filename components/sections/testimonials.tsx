"use client"

import { motion } from "framer-motion"

const TESTIMONIALS = [
  {
    name: "David Park",
    company: "Apex Digital",
    role: "Agency Owner",
    content: "LeadFlow AI entirely replaced our outbound SDR team. The ability to pull targeted local business data from Maps and cross-reference it with LinkedIn is a superpower.",
    avatar: "https://i.pravatar.cc/150?u=david"
  },
  {
    name: "Sarah Jenkins",
    company: "Nova Dynamics",
    role: "Sales Manager",
    content: "Our connect rate doubled in the first month. The email verification accuracy is the best I've seen in the industry. We don't waste time on bounced emails anymore.",
    avatar: "https://i.pravatar.cc/150?u=sarahj"
  },
  {
    name: "Michael Chang",
    company: "FinServe SaaS",
    role: "Founder",
    content: "The easiest ROI we've ever had from a software product. We generated over 1,000 qualified leads in our first week just by automating the Google Maps scraper.",
    avatar: "https://i.pravatar.cc/150?u=michaelc"
  },
  {
    name: "Emily Watson",
    company: "GrowthTech Talent",
    role: "Head of Recruitment",
    content: "Finding passive candidates used to take hours of manual LinkedIn searching. Now I just type a query and LeadFlow builds a verified spreadsheet instantly.",
    avatar: "https://i.pravatar.cc/150?u=emilyw"
  }
]

export function Testimonials() {
  return (
    <section className="py-32 bg-[#fafafa] border-t border-black/[0.04]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-[56px] font-semibold tracking-tight text-[#0a0a0a] mb-6 leading-[1.1]"
          >
            Loved by the best.
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
              className="flex flex-col bg-white rounded-[32px] p-10 border border-black/[0.04] shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <p className="text-[20px] leading-relaxed text-gray-900 font-light mb-12 flex-grow">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto pt-8 border-t border-black/[0.04]">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 font-medium">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
