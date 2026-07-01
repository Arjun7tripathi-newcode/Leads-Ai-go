import { Search, Filter, SlidersHorizontal, Download, Calendar, Mail, Phone, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FilterBar({ onSearch }: { onSearch?: (q: string) => void }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-gray-200/60 rounded-xl">
      <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search name, company, email..." 
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        
        {/* Quick Filters */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="h-4 w-px bg-gray-200 mx-2" />
          <Button variant="outline" size="sm" className="h-9 text-gray-600 border-gray-200 hover:bg-gray-50">
            Industry <Filter className="w-3 h-3 ml-1.5" />
          </Button>
          <Button variant="outline" size="sm" className="h-9 text-gray-600 border-gray-200 hover:bg-gray-50">
            Location <Filter className="w-3 h-3 ml-1.5" />
          </Button>
          <Button variant="outline" size="sm" className="h-9 text-gray-600 border-gray-200 hover:bg-gray-50">
            Score <Filter className="w-3 h-3 ml-1.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button variant="outline" size="sm" className="h-9 text-gray-700 bg-gray-50 border-gray-200">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Advanced Filters
        </Button>
      </div>
    </div>
  );
}
