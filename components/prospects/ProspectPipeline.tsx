"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { IProspect } from "@/models/Prospect"

const STAGES = [
  { id: 'New', label: 'New', color: 'bg-gray-50', headerBg: 'bg-gray-100', dot: 'bg-gray-400', text: 'text-gray-600', border: 'border-gray-200' },
  { id: 'Qualified', label: 'Qualified', color: 'bg-blue-50/50', headerBg: 'bg-blue-50', dot: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-100' },
  { id: 'Contacted', label: 'Contacted', color: 'bg-purple-50/50', headerBg: 'bg-purple-50', dot: 'bg-purple-500', text: 'text-purple-700', border: 'border-purple-100' },
  { id: 'Interested', label: 'Interested', color: 'bg-amber-50/50', headerBg: 'bg-amber-50', dot: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-100' },
  { id: 'Meeting Scheduled', label: 'Meeting', color: 'bg-cyan-50/50', headerBg: 'bg-cyan-50', dot: 'bg-cyan-500', text: 'text-cyan-700', border: 'border-cyan-100' },
  { id: 'Proposal Sent', label: 'Proposal', color: 'bg-orange-50/50', headerBg: 'bg-orange-50', dot: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-100' },
  { id: 'Won', label: 'Won', color: 'bg-emerald-50/50', headerBg: 'bg-emerald-50', dot: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-100' },
  { id: 'Lost', label: 'Lost', color: 'bg-red-50/30', headerBg: 'bg-red-50', dot: 'bg-red-400', text: 'text-red-600', border: 'border-red-100' },
]

interface ProspectPipelineProps {
  prospects: any[]
  onProspectClick: (prospect: any) => void
  onStatusChange: (id: string, status: string) => Promise<void>
}

export function ProspectPipeline({ prospects, onProspectClick, onStatusChange }: ProspectPipelineProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverCol, setDragOverCol] = useState<string | null>(null)

  const byStatus = (status: string) => prospects.filter(p => p.status === status)

  const handleDrop = async (status: string) => {
    if (draggedId) {
      await onStatusChange(draggedId, status)
    }
    setDraggedId(null)
    setDragOverCol(null)
  }

  return (
    <div className="overflow-x-auto pb-4 -mx-1 px-1">
      <div className="flex gap-3 min-w-max">
        {STAGES.map(stage => {
          const items = byStatus(stage.id)
          const isOver = dragOverCol === stage.id
          return (
            <div
              key={stage.id}
              className={`w-[220px] flex flex-col rounded-2xl border transition-all duration-150 ${isOver ? 'border-indigo-300 shadow-lg shadow-indigo-100/50 scale-[1.01]' : stage.border} ${stage.color}`}
              onDragOver={e => { e.preventDefault(); setDragOverCol(stage.id) }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={() => handleDrop(stage.id)}
            >
              <div className={`${stage.headerBg} px-3 py-2.5 rounded-t-2xl border-b ${stage.border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${stage.dot}`} />
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${stage.text}`}>{stage.label}</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 bg-white/80 px-2 py-0.5 rounded-full border border-gray-200/50">
                    {items.length}
                  </span>
                </div>
              </div>

              <div className="p-2 flex-1 space-y-2 min-h-[220px]">
                {items.map(prospect => {
                  const initials = (prospect.name || '').split(' ').map((n: string) => n[0] || '').join('').toUpperCase().slice(0, 2) || 'P'
                  const hue = (prospect.name?.charCodeAt(0) || 0) % 360
                  const isBeingDragged = draggedId === prospect._id?.toString()

                  return (
                    <motion.div
                    key={prospect._id?.toString()}
                      draggable
                      onDragStart={() => setDraggedId(prospect._id?.toString() ?? '')}
                      onDragEnd={() => { setDraggedId(null); setDragOverCol(null) }}
                      onClick={() => onProspectClick(prospect)}
                      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                      className={`bg-white rounded-xl p-3 border border-gray-100 cursor-grab active:cursor-grabbing shadow-sm transition-opacity ${isBeingDragged ? 'opacity-40' : 'opacity-100'}`}
                    >
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
                          style={{ background: `hsl(${hue},60%,55%)` }}>
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-gray-900 truncate leading-tight">{prospect.name}</p>
                          <p className="text-[10px] text-gray-400 truncate leading-tight mt-0.5">{prospect.company?.name || prospect.jobTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <div className="flex-1 bg-gray-100 rounded-full h-1 max-w-[50px]">
                            <div className="bg-indigo-500 h-1 rounded-full" style={{ width: `${prospect.leadScore}%` }} />
                          </div>
                          <span className="text-[10px] font-semibold text-gray-500">{prospect.leadScore}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {prospect.email && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Has email" />}
                          {prospect.phone && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Has phone" />}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}

                {items.length === 0 && (
                  <div className={`h-20 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${isOver ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-200/60'}`}>
                    <p className="text-[11px] text-gray-400">{isOver ? '✦ Drop here' : 'Drop leads here'}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
