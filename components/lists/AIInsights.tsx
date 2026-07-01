import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function AIInsights() {
  const insights = [
    { text: "87 leads have no website listed.", action: "Enrich Data", type: "warning" },
    { text: "54 leads have high buying intent signals this week.", action: "View Leads", type: "positive" },
    { text: "23 companies match your ideal customer profile.", action: "Create Campaign", type: "info" }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100/50 rounded-xl p-5 shadow-inner">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-indigo-500" />
        <h3 className="text-sm font-semibold text-indigo-900 tracking-wide uppercase">AI List Insights</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-lg p-4 flex flex-col justify-between hover:bg-white transition-colors cursor-pointer group"
          >
            <p className="text-sm text-gray-700 font-medium mb-3">{insight.text}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold ${
                insight.type === 'warning' ? 'text-orange-600' :
                insight.type === 'positive' ? 'text-emerald-600' : 'text-blue-600'
              }`}>
                {insight.action}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors group-hover:translate-x-0.5" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
