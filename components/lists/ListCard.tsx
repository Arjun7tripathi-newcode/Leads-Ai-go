'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Clock, MoreVertical, ExternalLink, Edit3, Copy,
  Archive, Trash2, Download, RefreshCw, Tag
} from 'lucide-react';

interface ListCardProps {
  list: any;
  onRefresh: () => void;
}

const EMOJI_MAP: Record<string, string> = {
  '🔥': '🔥', '🍕': '🍕', '🚀': '🚀', '🦷': '🦷',
  '💼': '💼', '🎯': '🎯', '🏥': '🏥', '🏪': '🏪',
};

function getEmoji(name: string): string {
  for (const key of Object.keys(EMOJI_MAP)) {
    if (name.startsWith(key)) return key;
  }
  return '';
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

const MENU_ITEMS = [
  { label: 'Open', icon: ExternalLink, href: true },
  { label: 'Rename', icon: Edit3, action: 'rename' },
  { label: 'Duplicate', icon: Copy, action: 'duplicate' },
  { label: 'Export CSV', icon: Download, action: 'export' },
  { label: 'CRM Sync', icon: RefreshCw, action: 'sync' },
  { label: 'Archive', icon: Archive, action: 'archive', danger: false },
  { label: 'Delete', icon: Trash2, action: 'delete', danger: true },
];

export function ListCard({ list, onRefresh }: ListCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const emoji = getEmoji(list.name);
  const leadCount = list.leadCount ?? list.prospectIds?.length ?? 0;

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAction = async (action: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);

    if (action === 'delete') {
      if (!confirm(`Delete "${list.name}"? This cannot be undone.`)) return;
      setIsDeleting(true);
      try {
        await fetch(`/api/lists/${list._id}`, { method: 'DELETE' });
        onRefresh();
      } catch (err) {
        console.error('Delete failed', err);
      } finally {
        setIsDeleting(false);
      }
    }

    if (action === 'duplicate') {
      try {
        await fetch('/api/lists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${list.name} (Copy)`,
            description: list.description,
            color: list.color,
            icon: list.icon,
            visibility: list.visibility,
            tags: list.tags,
          }),
        });
        onRefresh();
      } catch (err) {
        console.error('Duplicate failed', err);
      }
    }

    if (action === 'export') {
      const rows = [['List Name', 'Lead Count', 'Tags', 'Visibility', 'Created']];
      rows.push([list.name, leadCount, (list.tags || []).join('; '), list.visibility, new Date(list.createdAt).toLocaleDateString()]);
      const csv = rows.map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), { href: url, download: `${list.name}.csv` });
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    }

    if (action === 'archive') {
      await fetch(`/api/lists/${list._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true }),
      });
      onRefresh();
    }
  };

  return (
    <Link href={`/dashboard/lists/${list._id}`}>
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`group relative flex flex-col h-full bg-white border border-gray-200/70 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-blue-300/60 transition-all duration-300 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl shadow-sm text-lg shrink-0"
              style={{ backgroundColor: `${list.color || '#3b82f6'}18`, color: list.color || '#3b82f6' }}
            >
              {emoji || <Users className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">{list.name}</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 shrink-0" />
                {timeAgo(list.updatedAt)}
              </p>
            </div>
          </div>

          {/* Dropdown Menu */}
          <div ref={menuRef} className="relative shrink-0">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(v => !v); }}
              className="p-1.5 text-gray-400 rounded-lg hover:bg-gray-100 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden py-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    if (item.href) {
                      return (
                        <Link
                          key={item.label}
                          href={`/dashboard/lists/${list._id}`}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Icon className="w-4 h-4 text-gray-400" />
                          {item.label}
                        </Link>
                      );
                    }
                    return (
                      <button
                        key={item.label}
                        onClick={(e) => handleAction(item.action!, e)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                          item.danger
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${item.danger ? 'text-rose-400' : 'text-gray-400'}`} />
                        {item.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Description */}
        {list.description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-1">{list.description}</p>
        )}

        {/* Lead Count */}
        <div className="mt-auto">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">{leadCount.toLocaleString()}</span>
              <p className="text-xs font-medium text-gray-400 mt-0.5">Total Leads</p>
            </div>

            {/* Visibility badge */}
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              list.visibility === 'Public'  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
              list.visibility === 'Team'    ? 'bg-blue-50 text-blue-700 border-blue-100' :
              'bg-gray-50 text-gray-500 border-gray-100'
            }`}>
              {list.visibility || 'Private'}
            </span>
          </div>
        </div>

        {/* Tags */}
        {list.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
            <Tag className="w-3 h-3 text-gray-300 mt-0.5 shrink-0" />
            {list.tags.slice(0, 3).map((tag: string, i: number) => (
              <span key={i} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                {tag}
              </span>
            ))}
            {list.tags.length > 3 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-50 text-gray-400">
                +{list.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </motion.div>
    </Link>
  );
}
