import { Bell, Search, Sparkles } from "lucide-react"

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-8">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search leads, companies, or lists... (Press '/')"
            className="w-full h-10 pl-10 pr-4 bg-gray-50/50 hover:bg-gray-50 border border-transparent focus:border-indigo-100 focus:bg-white rounded-xl text-[14px] outline-none transition-all focus:ring-4 focus:ring-indigo-50/50 text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-50">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

        <button className="flex items-center gap-2 px-4 h-9 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-[13px] font-medium shadow-sm transition-all hover:shadow hover:-translate-y-[1px]">
          <Sparkles className="h-4 w-4" />
          Upgrade Plan
        </button>
      </div>
    </header>
  )
}
