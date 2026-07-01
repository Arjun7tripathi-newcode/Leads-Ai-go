'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Trash2, MoveRight, Mail, Tag, RefreshCw, Sparkles, X, CheckSquare
} from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onExport: () => void;
  onDelete: () => void;
  onAddTags: (tags: string[]) => void;
  leads: any[];
}

const QUICK_TAGS = ['Hot', 'Cold', 'Follow Up', 'Client', 'Enterprise', 'Do Not Contact'];

export function BulkActionsBar({
  selectedCount, totalCount,
  onSelectAll, onClearSelection,
  onExport, onDelete, onAddTags,
  leads,
}: BulkActionsBarProps) {
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [checkedTags, setCheckedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setCheckedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const applyTags = () => {
    if (checkedTags.length > 0) onAddTags(checkedTags);
    setShowTagMenu(false);
    setCheckedTags([]);
  };

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        >
          <div className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
            {/* Selection count */}
            <div className="flex items-center gap-2 pr-3 border-r border-gray-700">
              <CheckSquare className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold">
                {selectedCount} <span className="text-gray-400 font-normal">of {totalCount} selected</span>
              </span>
              <button
                onClick={onSelectAll}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors ml-1"
              >
                All
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onExport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Export
              </button>

              {/* Tag Action */}
              <div className="relative">
                <button
                  onClick={() => setShowTagMenu(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Tag className="w-3.5 h-3.5" /> Add Tags
                </button>
                <AnimatePresence>
                  {showTagMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-48 z-50"
                    >
                      <p className="text-xs font-semibold text-gray-700 mb-2">Select Tags</p>
                      <div className="space-y-1 mb-3">
                        {QUICK_TAGS.map(tag => (
                          <label key={tag} className="flex items-center gap-2 px-1 py-0.5 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checkedTags.includes(tag)}
                              onChange={() => toggleTag(tag)}
                              className="w-3.5 h-3.5 rounded accent-blue-600"
                            />
                            <span className="text-xs text-gray-700">{tag}</span>
                          </label>
                        ))}
                      </div>
                      <button
                        onClick={applyTags}
                        className="w-full text-xs font-semibold text-center py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Apply Tags
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <Mail className="w-3.5 h-3.5" /> Verify Emails
              </button>

              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> CRM Sync
              </button>

              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors">
                <Sparkles className="w-3.5 h-3.5" /> AI Analyze
              </button>

              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onClearSelection}
              className="ml-2 p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
