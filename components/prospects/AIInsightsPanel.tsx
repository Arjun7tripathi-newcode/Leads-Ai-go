"use client"
import { Sparkles, Zap, Target, Globe, ArrowRight } from "lucide-react"

interface AIInsightsPanelProps {
  total?: number
  hot?: number
}

const INSIGHTS = [
  { icon: Zap, label: "High Purchase Intent", value: 54, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", desc: "prospects match" },
  { icon: Globe, label: "No Website Found", value: 214, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100", desc: "missing online presence" },
  { icon: Target, label: "Match Ideal ICP", value: 89, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", desc: "prospects qualified" },
]

export function AIInsightsPanel({ total = 0, hot = 0 }: AIInsightsPanelProps) {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 left-1/3 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex items-center justify-between gap-6">
        {/* Main headline */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-indigo-300" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-0.5">AI Prospect Intelligence</p>
            <p className="text-[14px] font-semibold text-white leading-snug">
              {hot > 0
                ? <>{hot} prospect{hot !== 1 ? 's are' : ' is'} showing <span className="text-amber-400">hot lead signals</span> — ready for immediate outreach.</>
                : <>Your pipeline is analyzed. Add prospects to unlock AI-powered insights and scoring.</>
              }
            </p>
          </div>
        </div>

        {/* Insight chips */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {INSIGHTS.map(({ icon: Icon, label, value, color, bg, border, desc }) => (
            <div key={label} className={`flex items-center gap-2 px-3 py-2 ${bg} ${border} border rounded-xl`}>
              <Icon className={`h-3.5 w-3.5 ${color} flex-shrink-0`} />
              <div>
                <span className={`text-sm font-bold ${color}`}>{value}</span>
                <span className="text-[11px] text-gray-500 ml-1">{desc}</span>
              </div>
            </div>
          ))}

          <button className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[13px] font-medium text-white transition-colors ml-1">
            View Insights <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
