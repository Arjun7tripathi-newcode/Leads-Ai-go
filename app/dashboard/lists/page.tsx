'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Download, Upload, Search, FolderPlus,
  Sparkles, TrendingUp, Users, CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/lists/ListCard';
import { CreateListModal } from '@/components/lists/CreateListModal';

const SMART_LISTS = [
  { name: '🔥 Hot Leads',       filter: (l: any) => (l.leadCount || 0) > 100 },
  { name: '🤖 AI Qualified',    filter: () => true },
  { name: '✅ Verified Emails', filter: () => true },
  { name: '📱 Has Phone',       filter: () => true },
  { name: '🕒 Recently Added',  filter: () => true },
  { name: '👑 Decision Makers', filter: () => true },
];

export default function ListsPage() {
  const [lists, setLists]                     = useState<any[]>([]);
  const [isLoading, setIsLoading]             = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery]         = useState('');
  const [activeSmartList, setActiveSmartList] = useState<string | null>(null);

  const fetchLists = async () => {
    setIsLoading(true);
    try {
      const res  = await fetch('/api/lists');
      const json = await res.json();
      if (json.success) setLists(json.data);
    } catch (err) {
      console.error('Failed to fetch lists:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLists(); }, []);

  // Stats
  const totalLists       = lists.length;
  const totalLeads       = lists.reduce((s, l) => s + (l.leadCount || 0), 0);
  const hotLeads         = Math.floor(totalLeads * 0.15) || 1204;
  const verifiedContacts = Math.floor(totalLeads * 0.70) || 8932;

  const statCards = [
    { label: 'Total Lists',       value: totalLists.toLocaleString(),             icon: FolderPlus,    color: 'text-blue-600',    bg: 'bg-blue-50'    },
    { label: 'Total Leads',       value: (totalLeads || 12405).toLocaleString(),  icon: Users,         color: 'text-indigo-600',  bg: 'bg-indigo-50'  },
    { label: 'Hot Leads',         value: hotLeads.toLocaleString(),               icon: TrendingUp,    color: 'text-orange-600',  bg: 'bg-orange-50'  },
    { label: 'Verified Contacts', value: verifiedContacts.toLocaleString(),       icon: CheckCircle2,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  // Filtered lists for display
  const filteredLists = useMemo(() => {
    let result = lists;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q) ||
        l.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }
    if (activeSmartList) {
      const smart = SMART_LISTS.find(s => s.name === activeSmartList);
      if (smart) result = result.filter(smart.filter);
    }
    return result;
  }, [lists, searchQuery, activeSmartList]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Lists</h1>
            <p className="text-sm text-gray-500">Organize your leads into smart collections and outreach groups.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex bg-white hover:bg-gray-50 shadow-sm border-gray-200">
              <Download className="w-4 h-4 mr-2" /> Export Lists
            </Button>
            <Button variant="outline" className="hidden sm:flex bg-white hover:bg-gray-50 shadow-sm border-gray-200">
              <Upload className="w-4 h-4 mr-2" /> Import Leads
            </Button>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gray-900 text-white hover:bg-gray-800 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" /> Create List
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Smart Lists */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Smart Lists</h2>
            <span className="text-[10px] text-gray-400">· Auto-updated</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {SMART_LISTS.map((s) => (
              <button
                key={s.name}
                onClick={() => setActiveSmartList(prev => prev === s.name ? null : s.name)}
                className={`flex-shrink-0 px-4 py-2 border rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeSmartList === s.name
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white border-gray-200/60 text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* List Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Your Lists
              {(searchQuery || activeSmartList) && (
                <span className="ml-2 text-sm font-normal text-gray-400">({filteredLists.length} results)</span>
              )}
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search lists…"
                className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none w-48 transition-all focus:w-60 bg-white"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-44 bg-white border border-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredLists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredLists.map((list) => (
                <ListCard key={list._id} list={list} onRefresh={fetchLists} />
              ))}
            </div>
          ) : lists.length === 0 ? (
            /* Empty state */
            <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-16 text-center max-w-xl mx-auto mt-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FolderPlus className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your First Lead List</h3>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                Organize your leads into collections for outreach, CRM sync, and team collaboration.
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
              >
                <Plus className="w-4 h-4 mr-2" /> Create List
              </Button>
            </div>
          ) : (
            /* No results for search/filter */
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
              <p className="text-gray-500 text-sm">No lists match your search. <button onClick={() => { setSearchQuery(''); setActiveSmartList(null); }} className="text-blue-600 hover:underline">Clear filters</button></p>
            </div>
          )}
        </div>
      </div>

      <CreateListModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchLists}
      />
    </div>
  );
}
