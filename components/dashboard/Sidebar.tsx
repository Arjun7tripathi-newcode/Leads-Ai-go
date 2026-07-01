"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Search, Users, Folder, Sparkles, BarChart3, Settings, User, Target, Mail
} from "lucide-react"

const navItems = [
  { name: "Discovery", href: "/dashboard", icon: Search },
  { name: "Prospects", href: "/dashboard/prospects", icon: Users },
  { name: "Keywords", href: "/dashboard/keywords", icon: Target },
  { name: "Lists", href: "/dashboard/lists", icon: Folder },
  { name: "AI Inbox", href: "/dashboard/inbox", icon: Mail },
  { name: "AI Assistant", href: "/dashboard/assistant", icon: Sparkles },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed top-0 left-0 h-full w-[260px] bg-[#F9FAFB] border-r border-gray-200/60 flex flex-col z-40">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200/60 bg-white">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="tracking-tight">LeadFlow AI</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? "bg-white text-blue-700 shadow-sm border border-gray-200/60" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 border border-transparent"
              }`}
            >
              <Icon className={`h-[18px] w-[18px] ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* Bottom Profile Section */}
      <div className="p-4 bg-white border-t border-gray-200/60 space-y-4">
        <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-3.5 border border-gray-200/60 shadow-sm">
          <div className="flex justify-between items-center mb-2.5">
             <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Credits Remaining</span>
             <span className="text-xs font-bold text-gray-900">850 / 1000</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
             <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }} />
          </div>
          <button className="w-full py-2 bg-white border border-gray-200/80 shadow-sm rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
            Upgrade Plan
          </button>
        </div>

        <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded-xl transition-all text-left group border border-transparent hover:border-gray-200/60">
          <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 overflow-hidden flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900 truncate tracking-tight">Alex Developer</p>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">Pro</span>
            </div>
            <p className="text-[11px] text-gray-500 truncate mt-0.5">alex@leadflow.io</p>
          </div>
        </button>
      </div>
    </div>
  )
}
