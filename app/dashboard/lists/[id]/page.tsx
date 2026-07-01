'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit3, Copy, Archive, Trash2, Download, RefreshCw, Mail, Folder, Users, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/lists/FilterBar';
import { LeadsTable } from '@/components/lists/LeadsTable';
import { AIInsights } from '@/components/lists/AIInsights';

export default function ListDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [list, setList] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const res = await fetch(`/api/lists/${id}`);
        const json = await res.json();
        if (json.success) {
          setList(json.data);
        } else {
          router.push('/dashboard/lists');
        }
      } catch (error) {
        console.error('Failed to fetch list:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListDetails();
  }, [id, router]);

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!list) return null;

  const prospects = list.prospectIds || [];
  
  // Basic filtering for demo
  const filteredProspects = prospects.filter((p: any) => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const verifiedEmailsCount = prospects.filter((p: any) => p.isEmailVerified).length;
  const avgScore = prospects.length > 0 
    ? Math.round(prospects.reduce((sum: number, p: any) => sum + (p.leadScore || 0), 0) / prospects.length) 
    : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200/60 shadow-sm px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard/lists')}
              className="p-2 -ml-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded flex items-center justify-center text-xs"
                style={{ backgroundColor: `${list.color}20`, color: list.color }}
              >
                <Folder className="w-3.5 h-3.5" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">{list.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 uppercase">
                {list.visibility}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex text-gray-600">
              <Edit3 className="w-4 h-4 mr-2" /> Rename
            </Button>
            <Button variant="outline" size="sm" className="text-gray-600">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <RefreshCw className="w-4 h-4 mr-2" /> CRM Sync
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Workspace Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200/60 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{prospects.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200/60 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Verified Emails</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{verifiedEmailsCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200/60 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Avg Lead Score</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{avgScore}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200/60 shadow-sm flex flex-col justify-center">
            <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
            <p className="text-sm text-gray-900 line-clamp-2">{list.description || 'No description provided.'}</p>
          </div>
        </div>

        {/* AI Insights Section */}
        {prospects.length > 0 && <AIInsights />}

        {/* Leads Table Section */}
        <div className="space-y-4">
          <FilterBar onSearch={setSearchQuery} />
          
          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-gray-500 font-medium">
              Showing {filteredProspects.length} of {prospects.length} leads
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs h-8">Verify Emails</Button>
              <Button variant="outline" size="sm" className="text-xs h-8">Add Tags</Button>
            </div>
          </div>

          <LeadsTable leads={filteredProspects} />
        </div>
      </div>
    </div>
  );
}
