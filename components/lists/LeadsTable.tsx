'use client';

import { useState } from 'react';
import { MoreHorizontal, Mail, Phone, ExternalLink, Star, CheckSquare, Square } from 'lucide-react';
import { BulkActionsBar } from './BulkActionsBar';

interface LeadsTableProps {
  leads: any[];
}

function exportLeadsToCSV(leads: any[], filename = 'leads.csv') {
  const headers = ['Name', 'Job Title', 'Company', 'Industry', 'Email', 'Phone', 'Location', 'Lead Score', 'Status'];
  const rows = leads.map(l => [
    l.name || '', l.jobTitle || '', l.company?.name || '', l.company?.industry || '',
    l.email || '', l.phone || '', l.location || '',
    l.leadScore || 0, l.status || 'New'
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

const STATUS_STYLES: Record<string, string> = {
  New:        'bg-blue-50 text-blue-700 border-blue-100',
  Contacted:  'bg-amber-50 text-amber-700 border-amber-100',
  Qualified:  'bg-emerald-50 text-emerald-700 border-emerald-100',
  Lost:       'bg-gray-100 text-gray-500 border-gray-200',
};

export function LeadsTable({ leads }: LeadsTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === leads.length) setSelected(new Set());
    else setSelected(new Set(leads.map(l => l._id)));
  };

  const selectedLeads = leads.filter(l => selected.has(l._id));

  const handleExport = () => {
    exportLeadsToCSV(selectedLeads.length > 0 ? selectedLeads : leads);
  };

  const handleDelete = () => {
    if (confirm(`Delete ${selected.size} lead(s) from this list? This removes them from the list only.`)) {
      // Would call API — for now just clear selection
      setSelected(new Set());
    }
  };

  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white border border-gray-200/60 rounded-xl p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
          <Mail className="w-6 h-6 text-gray-300" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No leads found</h3>
        <p className="text-sm text-gray-500">Add prospects to this list to see them here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-gray-200/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200/60">
                {/* Select all checkbox */}
                <th className="px-4 py-3.5 w-10">
                  <button onClick={toggleAll} className="text-gray-400 hover:text-gray-700 transition-colors">
                    {selected.size === leads.length && leads.length > 0
                      ? <CheckSquare className="w-4 h-4 text-blue-600" />
                      : <Square className="w-4 h-4" />
                    }
                  </button>
                </th>
                {['Contact', 'Company', 'Contact Info', 'Location', 'Score', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => {
                const isSelected = selected.has(lead._id);
                const statusStyle = STATUS_STYLES[lead.status] || STATUS_STYLES.New;
                return (
                  <tr
                    key={lead._id}
                    className={`transition-colors group ${isSelected ? 'bg-blue-50/40' : 'hover:bg-gray-50/60'}`}
                  >
                    <td className="px-4 py-3.5">
                      <button onClick={() => toggleOne(lead._id)} className="text-gray-300 hover:text-blue-600 transition-colors">
                        {isSelected
                          ? <CheckSquare className="w-4 h-4 text-blue-600" />
                          : <Square className="w-4 h-4" />
                        }
                      </button>
                    </td>

                    {/* Name + Title */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 border border-blue-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
                          {(lead.name?.charAt(0) || '?').toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 leading-tight">{lead.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{lead.jobTitle || '—'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-gray-800">{lead.company?.name || '—'}</p>
                      <p className="text-xs text-gray-400">{lead.company?.industry || '—'}</p>
                    </td>

                    {/* Contact Info */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate max-w-[160px]">{lead.email || '—'}</span>
                          {lead.isEmailVerified && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Verified" />}
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                            {lead.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                      {lead.location || '—'}
                    </td>

                    {/* Lead Score */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Star className={`w-3.5 h-3.5 ${lead.leadScore > 70 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                        <span className={`text-sm font-bold ${lead.leadScore > 70 ? 'text-amber-700' : lead.leadScore > 40 ? 'text-gray-700' : 'text-gray-400'}`}>
                          {lead.leadScore || 0}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${statusStyle}`}>
                        {lead.status || 'New'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {selected.size > 0 ? `${selected.size} selected · ` : ''}{leads.length} total leads
          </p>
          <button
            onClick={handleExport}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Export All as CSV
          </button>
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selected.size}
        totalCount={leads.length}
        onSelectAll={toggleAll}
        onClearSelection={() => setSelected(new Set())}
        onExport={handleExport}
        onDelete={handleDelete}
        onAddTags={() => {}}
        leads={selectedLeads}
      />
    </>
  );
}
