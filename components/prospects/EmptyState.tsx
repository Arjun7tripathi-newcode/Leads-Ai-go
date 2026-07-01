"use client"
import { Users, ArrowRight } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[400px]">
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
        <Users className="h-10 w-10 text-indigo-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No Prospects Yet</h3>
      <p className="text-gray-500 text-center max-w-md mb-8">
        Your CRM is looking a little empty. Start by importing leads from a CSV or use the Discovery tool to find new highly qualified prospects.
      </p>
      <div className="flex items-center gap-4">
        <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Import CSV
        </button>
        <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-indigo-600/20 flex items-center gap-2">
          Go to Discovery <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
