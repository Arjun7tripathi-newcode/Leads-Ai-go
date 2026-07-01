"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-black pt-32 pb-16 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8 mb-24">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <span className="text-[#0a0a0a] font-bold text-sm leading-none">L</span>
              </div>
              <span className="font-semibold text-lg tracking-tight text-white">LeadFlow AI</span>
            </Link>
            <p className="text-gray-400 mb-8 max-w-xs font-light leading-relaxed">
              Find your next 1,000 customers in minutes. The premier AI lead generation platform for modern growth teams.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Product</h4>
            <ul className="space-y-4">
              {["Features", "Pricing", "Integrations", "Changelog", "Use Cases"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[15px] text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-4">
              {["About", "Customers", "Careers", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[15px] text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Resources</h4>
            <ul className="space-y-4">
              {["Documentation", "API Reference", "Help Center", "Community", "Status"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[15px] text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
             <h4 className="font-semibold text-white mb-6">Newsletter</h4>
             <form className="flex flex-col gap-3">
               <input 
                 type="email" 
                 placeholder="Email address" 
                 className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[15px] text-white outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-gray-500"
               />
               <button className="bg-white hover:bg-gray-200 text-[#0a0a0a] text-[15px] font-semibold py-3 rounded-xl transition-colors">
                 Subscribe
               </button>
             </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[15px] text-gray-500">
            © {new Date().getFullYear()} LeadFlow AI Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
            <a href="#" className="text-[15px] text-gray-500 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-[15px] text-gray-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-[15px] text-gray-500 hover:text-white transition-colors">X (Twitter)</a>
            <a href="#" className="text-[15px] text-gray-500 hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
