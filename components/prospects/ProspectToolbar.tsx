"use client"
import { Search, Filter, Plus, Download, LayoutList, LayoutGrid } from "lucide-react"

interface ProspectToolbarProps {
  viewMode: 'table' | 'pipeline'
  setViewMode: (mode: 'table' | 'pipeline') => void
}

export function ProspectToolbar({ viewMode, setViewMode }: ProspectToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-6 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search prospects..." 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200">
          <button 
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setViewMode('pipeline')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'pipeline' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
        
        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          <Download className="h-4 w-4" />
          Export
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-600/20">
          <Plus className="h-4 w-4" />
          Add Prospect
        </button>
      </div>
    </div>
  )
}
