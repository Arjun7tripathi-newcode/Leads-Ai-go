"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

const FAQS = [
  {
    question: "How accurate are the leads?",
    answer: "Our AI agents cross-reference data from multiple live sources (Google Maps, LinkedIn, company websites) to ensure maximum accuracy. We automatically discard inactive businesses and ping emails in real-time to verify they won't bounce."
  },
  {
    question: "Can I export data?",
    answer: "Yes. You can export your generated lead lists instantly to CSV, Excel, Google Sheets, or directly push them to your CRM (HubSpot, Salesforce, Pipedrive) via our native integrations."
  },
  {
    question: "Do you verify emails?",
    answer: "Yes, every email address is verified in real-time before you export it. We use deep SMTP pinging to ensure the inbox exists and can receive mail, protecting your domain sender reputation."
  },
  {
    question: "Do I need technical skills?",
    answer: "Not at all. LeadFlow AI is designed to be as simple as using Google Search. Just type what you're looking for (e.g., 'Plumbers in Chicago') and our AI handles the complex scraping and data extraction."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a 14-day free trial on all plans. You get 100 free lead credits to test the accuracy of our data and the power of our search engine. No credit card required to start."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-32 bg-[#fafafa] border-t border-black/[0.04]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-semibold tracking-tight text-[#0a0a0a]"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white border rounded-[20px] overflow-hidden transition-colors duration-300 ${isOpen ? 'border-black/[0.08] shadow-sm' : 'border-black/[0.04]'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-lg font-medium text-gray-900 pr-8">{faq.question}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-gray-100' : 'bg-gray-50'}`}>
                    {isOpen ? <Minus className="h-4 w-4 text-gray-600" /> : <Plus className="h-4 w-4 text-gray-600" />}
                  </div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 pb-6 text-gray-500 font-light leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
