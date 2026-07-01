"use client"

import { Building2, Phone, MapPin, ExternalLink, MoreHorizontal, Star, Globe } from "lucide-react"

export interface Lead {
  _id: string;
  name: string;
  category?: string;
  phone?: string | null;
  website?: string | null;
  location: string;
  rating?: number | null;
  reviewCount?: number;
  status: string;
  source?: string;
}

interface DiscoveryTableProps {
  leads: Lead[];
  selectedRows: string[];
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  onRowClick: (lead: Lead) => void;
}

export function DiscoveryTable({ leads, selectedRows, onToggleRow, onToggleAll, onRowClick }: DiscoveryTableProps) {
  return (
    <div className="bg-white rounded-[20px] border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="px-6 py-4 w-12">
                <input 
                  type="checkbox" 
                  checked={leads.length > 0 && selectedRows.length === leads.length}
                  onChange={onToggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600/20 cursor-pointer" 
                />
              </th>
              <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Business</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((row) => (
              <tr 
                key={row._id} 
                onClick={() => onRowClick(row)}
                className={`h-[80px] hover:bg-gray-50/80 transition-colors cursor-pointer group ${selectedRows.includes(row._id) ? 'bg-indigo-50/30' : ''}`}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    checked={selectedRows.includes(row._id)}
                    onChange={() => onToggleRow(row._id)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600/20 cursor-pointer" 
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
                        {row.name}
                        {row.website && (
                          <a
                            href={row.website}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={row.website}
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-500" />
                          </a>
                        )}
                      </div>
                      <div className="text-[13px] text-gray-500 font-medium truncate max-w-[200px]">
                        {row.category || row.source || "—"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {row.phone ? (
                      <div className="flex items-center gap-2 text-[14px] text-gray-900 font-medium">
                        <Phone className="h-3.5 w-3.5 text-gray-400" /> {row.phone}
                      </div>
                    ) : (
                      <span className="text-[13px] text-gray-400">No phone</span>
                    )}
                    {row.website && (
                      <div className="flex items-center gap-2 text-[13px] text-gray-500 truncate max-w-[200px]">
                        <Globe className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{row.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[14px] text-gray-700 font-medium max-w-[220px]">
                     <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                     <span className="truncate">{row.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {row.rating != null ? (
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="text-[15px] font-bold text-gray-900">{row.rating.toFixed(1)}</span>
                      {row.reviewCount ? (
                        <span className="text-[12px] text-gray-400">({row.reviewCount})</span>
                      ) : null}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-[13px]">No rating</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-[8px] text-[12px] font-semibold border ${
                    row.status === "Verified"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
               <tr>
                 <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                   <div className="flex flex-col items-center gap-2">
                     <Building2 className="h-10 w-10 text-gray-200" />
                     <p className="font-medium">No leads yet</p>
                     <p className="text-[13px]">Enter a search above and click <strong>Generate Leads</strong></p>
                   </div>
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {leads.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
           <span className="text-[13px] font-medium text-gray-500">Showing {leads.length} leads</span>
           <div className="flex gap-1">
             <button className="px-4 h-9 bg-white border border-gray-200 rounded-xl text-[13px] font-medium text-gray-600 shadow-sm hover:bg-gray-50">Previous</button>
             <button className="px-4 h-9 bg-white border border-gray-200 rounded-xl text-[13px] font-medium text-gray-600 shadow-sm hover:bg-gray-50">Next</button>
           </div>
        </div>
      )}
    </div>
  )
}
