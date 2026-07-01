import { Sparkles, Bot, Zap, ArrowRight, MessageSquare, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiAssistantWidget } from '@/components/dashboard/AiAssistantWidget';

export default function AssistantPage() {
  const tools = [
    { title: 'Company Research', desc: 'Get deep insights on target accounts', icon: Briefcase },
    { title: 'Outreach Generator', desc: 'Draft hyper-personalized emails', icon: MessageSquare },
    { title: 'Ideal Profile Matcher', desc: 'Find lookalike companies', icon: Zap },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Sales Copilot</h1>
          <p className="text-sm text-gray-500">Your intelligent assistant for research and outreach.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {tools.map((tool, i) => (
          <div key={i} className="bg-white border border-gray-200/60 rounded-xl p-5 hover:border-blue-500/30 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                <tool.icon className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mt-4 mb-1">{tool.title}</h3>
            <p className="text-xs text-gray-500">{tool.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200/60 flex items-center gap-2">
          <Bot className="w-5 h-5 text-gray-500" />
          <h2 className="text-sm font-medium text-gray-900">Ask the Copilot</h2>
        </div>
        <div className="p-6 h-[400px]">
          <AiAssistantWidget />
        </div>
      </div>
    </div>
  );
}
