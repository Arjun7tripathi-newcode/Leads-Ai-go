"use client"

import { motion } from "framer-motion"
import { Search, Filter, Download, ChevronDown, CheckCircle2, UserPlus, Users, BarChart3, TrendingUp, Moon } from "lucide-react"

export function ProductDemo() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-[56px] font-semibold tracking-tight text-[#0a0a0a] mb-6 leading-[1.1]"
          >
            Powerful. Inside and out.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-xl text-gray-500 font-light"
          >
            A dashboard designed to give you complete control over your lead generation pipeline.
          </motion.p>
        </div>

        {/* Massive Apple-Style Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Main App Window */}
          <div className="rounded-[24px] border border-black/[0.08] bg-white shadow-[0_32px_64px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col relative z-20">
            
            {/* Sidebar & Content Layout */}
            <div className="flex h-[700px]">
              
              {/* Sidebar */}
              <div className="w-64 bg-gray-50/50 border-r border-black/[0.04] p-6 hidden md:flex flex-col">
                <div className="flex items-center gap-2 mb-10">
                  <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">L</span>
                  </div>
                  <span className="font-semibold text-sm">LeadFlow Workspace</span>
                </div>
                
                <nav className="space-y-1">
                  <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg border border-black/[0.04] shadow-sm text-sm font-medium text-gray-900">
                    <Search className="h-4 w-4" /> Discovery
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    <Users className="h-4 w-4" /> Lists
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    <BarChart3 className="h-4 w-4" /> Analytics
                  </div>
                </nav>

                <div className="mt-auto">
                  <div className="bg-white p-4 rounded-xl border border-black/[0.04] shadow-sm">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Usage</p>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mb-1">
                      <div className="w-[70%] h-full bg-black rounded-full" />
                    </div>
                    <p className="text-[10px] text-gray-500">7,000 / 10,000 credits</p>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col bg-white">
                
                {/* Header Actions */}
                <div className="h-16 border-b border-black/[0.04] flex items-center justify-between px-6">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-medium text-gray-700 transition-colors">
                      <Filter className="h-3 w-3" /> Filters
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-medium text-gray-700 transition-colors">
                      Status: Verified <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-black/[0.08] hover:bg-gray-50 rounded-md text-xs font-medium text-gray-700 transition-colors">
                      <Moon className="h-3 w-3" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-black hover:bg-black/90 text-white rounded-md text-xs font-medium transition-colors shadow-sm">
                      <Download className="h-3 w-3" /> Export to CRM
                    </button>
                  </div>
                </div>

                {/* Dashboard Stats Row */}
                <div className="grid grid-cols-3 gap-4 p-6 pb-0">
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-black/[0.04]">
                    <p className="text-xs text-gray-500 font-medium mb-1">Total Leads Found</p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-semibold text-gray-900">12,405</p>
                      <p className="text-xs text-emerald-600 font-medium mb-1 flex items-center"><TrendingUp className="h-3 w-3 mr-0.5"/>+14%</p>
                    </div>
                  </div>
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-black/[0.04]">
                    <p className="text-xs text-gray-500 font-medium mb-1">Verified Emails</p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-semibold text-gray-900">8,932</p>
                      <p className="text-xs text-emerald-600 font-medium mb-1 flex items-center"><TrendingUp className="h-3 w-3 mr-0.5"/>+8%</p>
                    </div>
                  </div>
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-black/[0.04]">
                    <p className="text-xs text-gray-500 font-medium mb-1">Decision Makers</p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-semibold text-gray-900">4,150</p>
                      <p className="text-xs text-emerald-600 font-medium mb-1 flex items-center"><TrendingUp className="h-3 w-3 mr-0.5"/>+22%</p>
                    </div>
                  </div>
                </div>

                {/* Lead Table */}
                <div className="p-6 flex-1 overflow-hidden flex flex-col">
                  <div className="border border-black/[0.04] rounded-xl overflow-hidden flex-1 flex flex-col">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50/50">
                        <tr className="border-b border-black/[0.04] text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                          <th className="px-4 py-3">Prospect</th>
                          <th className="px-4 py-3">Title</th>
                          <th className="px-4 py-3">Company</th>
                          <th className="px-4 py-3">Contact</th>
                          <th className="px-4 py-3">AI Score</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-black/[0.02]">
                        {[
                          { name: "Alex Mercer", title: "VP of Marketing", comp: "TechFlow Inc", email: "alex@techflow.io", score: "98" },
                          { name: "Sarah Jenkins", title: "Head of Growth", comp: "Nova Dynamics", email: "s.jenkins@nova.co", score: "95" },
                          { name: "Marcus Chen", title: "CEO", comp: "Elevate Partners", email: "marcus@elevate.vc", score: "91" },
                          { name: "Elena Rodriguez", title: "Sales Director", comp: "CloudSync", email: "elena.r@cloudsync.com", score: "88" },
                          { name: "James Wilson", title: "Founder", comp: "Nexus AI", email: "james@nexus.ai", score: "85" },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600">{row.name.charAt(0)}</div>
                              {row.name}
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-xs">{row.title}</td>
                            <td className="px-4 py-3 text-gray-900 font-medium text-xs">{row.comp}</td>
                            <td className="px-4 py-3 text-gray-500 text-xs flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {row.email}
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                                {row.score}/100
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
          {/* Glass floating card - dark mode preview snippet */}
          <motion.div 
             initial={{ opacity: 0, x: 40 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
             className="hidden lg:flex absolute -right-16 top-1/2 -translate-y-1/2 z-30 bg-[#1a1a1a]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.3)] flex-col gap-4 w-64"
          >
             <div className="flex items-center justify-between">
               <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Dark Mode</span>
               <Moon className="h-4 w-4 text-white/50" />
             </div>
             <div className="space-y-3">
               <div className="h-2 w-full bg-white/10 rounded-full" />
               <div className="h-2 w-3/4 bg-white/10 rounded-full" />
               <div className="h-2 w-5/6 bg-white/10 rounded-full" />
             </div>
             <button className="w-full mt-2 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors border border-white/5">
               Preview Theme
             </button>
          </motion.div>

        </motion.div>

      </div>
    </section>
  )
}
