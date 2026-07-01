'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Users, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PRESET_COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
  '#f59e0b', '#10b981', '#ef4444', '#0ea5e9',
  '#14b8a6', '#f97316', '#84cc16', '#6b7280',
];

const PRESET_ICONS = ['📋', '🔥', '🚀', '🎯', '💼', '👑', '🏥', '🦷', '🍕', '🏪', '⭐', '🤖'];

const PRESET_TAGS = ['Hot', 'Cold', 'Follow Up', 'Client', 'Agency', 'Enterprise'];

export function CreateListModal({
  isOpen, onClose, onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility]   = useState<'Private' | 'Team' | 'Public'>('Private');
  const [color, setColor]             = useState(PRESET_COLORS[0]);
  const [icon, setIcon]               = useState(PRESET_ICONS[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag]     = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const t = customTag.trim();
    if (t && !selectedTags.includes(t)) {
      setSelectedTags(prev => [...prev, t]);
    }
    setCustomTag('');
  };

  const reset = () => {
    setName(''); setDescription(''); setVisibility('Private');
    setColor(PRESET_COLORS[0]); setIcon(PRESET_ICONS[0]);
    setSelectedTags([]); setCustomTag(''); setError('');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${icon} ${name.trim()}`, description, visibility, color, icon, tags: selectedTags }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to create list');
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            className="relative w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">Create New List</h2>
              </div>
              <button onClick={handleClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">

              {/* Icon + Name Row */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">List Name</label>
                <div className="flex items-center gap-2">
                  {/* Icon picker popover (simplified) */}
                  <div className="relative group">
                    <button
                      type="button"
                      className="w-11 h-11 flex items-center justify-center text-xl rounded-xl border border-gray-200 hover:border-blue-400 transition-colors bg-gray-50"
                    >
                      {icon}
                    </button>
                    {/* Icon grid tooltip */}
                    <div className="absolute left-0 top-full mt-1 hidden group-focus-within:grid grid-cols-6 gap-1 p-2 bg-white border border-gray-200 rounded-xl shadow-xl z-30 w-48">
                      {PRESET_ICONS.map(ic => (
                        <button
                          key={ic} type="button"
                          onClick={() => setIcon(ic)}
                          className={`w-7 h-7 flex items-center justify-center text-base rounded-lg hover:bg-gray-100 transition-colors ${icon === ic ? 'bg-blue-50 ring-1 ring-blue-400' : ''}`}
                        >
                          {ic}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Q3 SaaS Prospects"
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-400">Preview: <span className="font-medium text-gray-600">{icon} {name || 'My List'}</span></p>
              </div>

              {/* Color Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Color</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c} type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What kind of leads are in this list?"
                  rows={2}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-all"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_TAGS.map(tag => (
                    <button
                      key={tag} type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTag}
                    onChange={e => setCustomTag(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag(); } }}
                    placeholder="Add custom tag…"
                    className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:border-blue-400 outline-none transition-all"
                  />
                  <button
                    type="button" onClick={addCustomTag}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedTags.map(t => (
                      <span key={t} className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-blue-50 text-blue-700 rounded-full">
                        {t}
                        <button type="button" onClick={() => toggleTag(t)} className="text-blue-400 hover:text-blue-700">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Visibility</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Private', 'Team', 'Public'] as const).map((v) => (
                    <button
                      key={v} type="button" onClick={() => setVisibility(v)}
                      className={`flex flex-col items-center justify-center p-3 gap-1.5 border rounded-xl text-xs font-medium transition-all ${
                        visibility === v
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {v === 'Private' && <Lock className="w-4 h-4" />}
                      {v === 'Team'    && <Users className="w-4 h-4" />}
                      {v === 'Public'  && <Globe className="w-4 h-4" />}
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{error}</p>}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={handleClose} className="rounded-xl">Cancel</Button>
                <Button
                  type="submit"
                  disabled={!name.trim() || isLoading}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isLoading ? 'Creating…' : 'Create List'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
