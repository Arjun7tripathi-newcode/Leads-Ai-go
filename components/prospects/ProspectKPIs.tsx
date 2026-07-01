"use client"
import { Globe, AlertTriangle, TrendingDown, Flame, DollarSign, CheckCircle } from "lucide-react"

interface Stats {
  total?: number
  noWebsite?: number
  poorSeo?: number
  highOpportunity?: number
  potentialRevenueLow?: number
  potentialRevenueHigh?: number
  qualified?: number
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 60, h = 24, pts = data.length
  const coords = data.map((v, i) => `${(i / (pts - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`)
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={coords.join(' ')} />
      <circle cx={coords[coords.length - 1].split(',')[0]} cy={coords[coords.length - 1].split(',')[1]} r="2.5" fill={color} />
    </svg>
  )
}

function formatRevenue(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
}

export function ProspectKPIs({ stats }: { stats?: Stats }) {
  const total        = (stats?.total        ?? 0)
  const noWebsite    = (stats?.noWebsite    ?? 0)
  const poorSeo      = (stats?.poorSeo      ?? 0)
  const highOpp      = (stats?.highOpportunity ?? 0)
  const revLow       = (stats?.potentialRevenueLow  ?? 0)
  const revHigh      = (stats?.potentialRevenueHigh ?? 0)
  const qualified    = (stats?.qualified    ?? 0)

  const cards = [
    {
      label: "Total Prospects", value: total.toLocaleString(), sublabel: "in pipeline",
      icon: Globe, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100",
      sparkColor: "#6366f1", data: [20, 35, 28, 48, 40, 60, total || 1],
    },
    {
      label: "No Website", value: noWebsite.toLocaleString(), sublabel: "ready to pitch",
      icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100",
      sparkColor: "#ef4444", data: [5, 12, 9, 18, 14, 24, noWebsite || 1],
    },
    {
      label: "Poor SEO Score", value: poorSeo.toLocaleString(), sublabel: "score below 40",
      icon: TrendingDown, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100",
      sparkColor: "#f97316", data: [8, 14, 11, 20, 16, 26, poorSeo || 1],
    },
    {
      label: "High Opportunity", value: highOpp.toLocaleString(), sublabel: "score 70+",
      icon: Flame, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100",
      sparkColor: "#f59e0b", data: [3, 8, 6, 12, 9, 18, highOpp || 1],
    },
    {
      label: "Potential Revenue",
      value: revHigh > 0 ? `${formatRevenue(revLow)}–${formatRevenue(revHigh)}` : "—",
      sublabel: "estimated deals",
      icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100",
      sparkColor: "#10b981", data: [40, 70, 55, 90, 72, 110, (revHigh / 1000) || 1],
    },
    {
      label: "Qualified", value: qualified.toLocaleString(), sublabel: "ready to close",
      icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100",
      sparkColor: "#3b82f6", data: [10, 18, 14, 24, 20, 32, qualified || 1],
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((kpi, i) => (
        <div key={i}
          className={`bg-white p-5 rounded-2xl border ${kpi.border} shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all group`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform`}>
              <kpi.icon className="h-[18px] w-[18px]" />
            </div>
            <Sparkline data={kpi.data} color={kpi.sparkColor} />
          </div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide leading-none mb-1.5">{kpi.label}</p>
          <span className="text-2xl font-bold text-gray-900 leading-none">{kpi.value}</span>
          <p className="text-[11px] text-gray-400 mt-1">{kpi.sublabel}</p>
        </div>
      ))}
    </div>
  )
}
