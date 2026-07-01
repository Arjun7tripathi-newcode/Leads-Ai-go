"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Play, ArrowRight, Search, Download, Star, MapPin, CheckCircle2 } from "lucide-react"

export function HeroSection() {
  const { scrollY } = useScroll()
  
  const y1 = useTransform(scrollY, [0, 1000], [0, 150])
  const y2 = useTransform(scrollY, [0, 1000], [0, -100])
  const opacity = useTransform(scrollY, [0, 600], [1, 0])

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-white pt-32 pb-20">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] opacity-[0.15] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#6366f1_0%,transparent_50%)] blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* Main Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto flex flex-col items-center text-center mb-16"
          style={{ opacity }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/[0.08] bg-white/50 backdrop-blur-md text-sm font-medium mb-8 shadow-sm">
            <div className="flex gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
            </div>
            <span className="text-gray-600">Trusted by 10,000+ marketers and agencies</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-[88px] font-semibold tracking-tighter text-[#0a0a0a] leading-[1.05] mb-8">
            Find Verified Business <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
              Leads In Seconds.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-500 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Generate targeted leads from Google Maps, LinkedIn, company websites, and public business directories using AI-powered search.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a 
              href="/signup" 
              className="inline-flex justify-center items-center gap-2 bg-black hover:bg-black/90 text-white rounded-full px-8 h-14 text-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_8px_16px_rgba(0,0,0,0.1)] group"
            >
              Start Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#demo" 
              className="inline-flex justify-center items-center gap-2 bg-white hover:bg-gray-50 text-[#0a0a0a] border border-black/[0.08] rounded-full px-8 h-14 text-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm group"
            >
              <Play className="h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
              Watch Demo
            </a>
          </div>
        </motion.div>

        {/* Dashboard Visual Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="w-full max-w-5xl relative"
        >
          <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_32px_64px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col relative z-20">
            {/* Top Bar */}
            <div className="h-16 border-b border-black/[0.04] flex items-center justify-between px-6 bg-gray-50/50">
              <div className="flex items-center gap-3 w-full max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    readOnly 
                    value="Restaurants in New York" 
                    className="w-full bg-white border border-black/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 shadow-sm focus:outline-none font-medium"
                  />
                </div>
              </div>
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-black/[0.08] rounded-lg text-sm font-medium text-gray-700 shadow-sm">
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>

            {/* Table Area */}
            <div className="p-6 bg-white overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.04] text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 font-medium">Business Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Phone Number</th>
                    <th className="pb-3 font-medium">Location</th>
                    <th className="pb-3 font-medium">Rating</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { name: "Lombardi's Pizza", email: "contact@lombardis.com", phone: "+1 212-941-7994", loc: "Spring St, NY", rating: "4.8", status: "Verified" },
                    { name: "Katz's Delicatessen", email: "info@katzs.com", phone: "+1 212-254-2246", loc: "E Houston St, NY", rating: "4.9", status: "Verified" },
                    { name: "Le Bernardin", email: "reservations@le-bernardin.com", phone: "+1 212-554-1515", loc: "W 51st St, NY", rating: "4.9", status: "Verified" },
                    { name: "Joe's Pizza", email: "hello@joespizzanyc.com", phone: "+1 212-366-1182", loc: "Carmine St, NY", rating: "4.7", status: "Verified" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-black/[0.02] hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-medium text-gray-900">{row.name}</td>
                      <td className="py-4 text-gray-500">{row.email}</td>
                      <td className="py-4 text-gray-500">{row.phone}</td>
                      <td className="py-4 text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" />{row.loc}</td>
                      <td className="py-4 text-gray-900 font-medium flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{row.rating}</td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-xs font-medium">
                          <CheckCircle2 className="h-3 w-3" />{row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Floating Glass Element */}
          <motion.div 
            style={{ y: y1 }}
            className="hidden lg:flex absolute -right-12 top-20 z-30 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-black/[0.08] shadow-[0_16px_32px_rgba(0,0,0,0.06)] flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">428 Leads Found</p>
                <p className="text-xs text-gray-500">Extraction complete</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            style={{ y: y2 }}
            className="hidden lg:flex absolute -left-16 bottom-16 z-30 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-black/[0.08] shadow-[0_16px_32px_rgba(0,0,0,0.06)] flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Deep Search Active</p>
                <p className="text-xs text-gray-500">Scanning 5 data sources</p>
              </div>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  )
}
