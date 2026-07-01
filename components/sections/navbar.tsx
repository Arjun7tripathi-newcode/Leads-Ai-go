"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { Menu, X } from "lucide-react"

const NAV_LINKS = ["Product", "Solutions", "Pricing", "Resources"]

export function Navbar() {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20)
  })

  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-apple ${
        isScrolled 
          ? "bg-white/70 backdrop-blur-xl border-b border-black/[0.08]" 
          : "bg-transparent border-b border-transparent pt-4"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className={`flex items-center justify-between transition-all duration-500 ease-apple ${isScrolled ? 'h-14' : 'h-16'}`}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-sm leading-none">L</span>
            </div>
            <span className="font-semibold text-lg tracking-tight text-[#0a0a0a]">LeadFlow AI</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-4 py-2 text-[15px] font-medium text-gray-500 hover:text-black hover:bg-gray-100/50 rounded-full transition-colors duration-300"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-[15px] font-medium text-gray-500 hover:text-black transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 text-[15px] font-medium text-white bg-black hover:bg-black/90 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)]"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-xl border-b border-black/[0.08]"
        >
          <div className="px-4 py-6 space-y-2">
            {NAV_LINKS.map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-50 rounded-2xl"
              >
                {item}
              </Link>
            ))}
            <div className="pt-6 mt-4 border-t border-gray-100 flex flex-col gap-3">
              <Link href="/login" className="block text-center px-4 py-3 text-lg font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="block text-center px-4 py-3 text-lg font-medium text-white bg-black hover:bg-black/90 rounded-2xl transition-colors">
                Start Free
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
