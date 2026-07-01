"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Trash2, Mail, List, Zap, X, Bot, Share2 } from "lucide-react"

interface ProspectBulkActionBarProps {
  selectedCount: number
  onClear: () => void
  onExport?: () => void
  onDelete?: () => void
  onVerify?: () => void
  onAddToList?: () => void
  onAIAnalyze?: () => void
}

export function ProspectBulkActionBar({ selectedCount, onClear, onExport, onDelete, onVerify, onAddToList, onAIAnalyze }: ProspectBulkActionBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
        >
          <div className="pointer-events-auto flex items-center gap-1 bg-gray-950 text-white rounded-2xl px-3 py-2.5 shadow-2xl border border-gray-800/50 backdrop-blur-md">
            {/* Selection count */}
            <div className="flex items-center gap-2 mr-2 pr-3 border-r border-gray-700">
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {selectedCount}
              </div>
              <span className="text-sm font-medium text-gray-300 whitespace-nowrap">selected</span>
            </div>

            {/* Actions */}
            {[
              { icon: Download, label: 'Export', onClick: onExport },
              { icon: Mail, label: 'Verify', onClick: onVerify },
              { icon: List, label: 'Add to List', onClick: onAddToList },
              { icon: Bot, label: 'AI Analyze', onClick: onAIAnalyze },
              { icon: Zap, label: 'Outreach', onClick: undefined },
              { icon: Share2, label: 'CRM Sync', onClick: undefined },
            ].map(({ icon: Icon, label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}

            {/* Divider + Delete */}
            <div className="mx-1 h-6 w-px bg-gray-700" />
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>

            {/* Close */}
            <button
              onClick={onClear}
              className="ml-2 pl-3 border-l border-gray-700 p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
