"use client"

import { useState } from "react"
import { Sparkles, X, Send, MessageSquare } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const newMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message.content }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error || 'Failed to get response'}` }]);
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Network error occurred." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-[380px] overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <Sparkles className="h-5 w-5" />
                 <h3 className="font-semibold text-[15px]">LeadFlow AI Assistant</h3>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                 <X className="h-5 w-5" />
               </button>
            </div>

            {/* Content Area */}
            <div className="p-5 h-[320px] overflow-y-auto bg-gray-50/50 flex flex-col gap-4">
              <div className="flex gap-3 mt-auto">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm text-[14px] text-gray-700 leading-relaxed">
                  Hi there! I can help you find leads, build outreach sequences, or analyze your current lists. What would you like to do?
                </div>
              </div>

              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {m.role === 'assistant' && (
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                    </div>
                  )}
                  <div className={`p-3.5 rounded-2xl border shadow-sm text-[14px] leading-relaxed max-w-[85%] whitespace-pre-wrap ${m.role === 'user' ? 'bg-indigo-600 text-white border-indigo-700 rounded-tr-sm' : 'bg-white text-gray-700 border-gray-100 rounded-tl-sm'}`}>
                    {m.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm text-[14px] text-gray-500">
                    Typing...
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {messages.length === 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  <button onClick={() => sendMessage("Find dentists in Miami")} className="text-left px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                    Find dentists in Miami
                  </button>
                  <button onClick={() => sendMessage("Generate an outreach strategy")} className="text-left px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                    Generate an outreach strategy
                  </button>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
               <div className="relative">
                 <input 
                   type="text" 
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                   placeholder="Ask AI anything..."
                   className="w-full h-12 pl-4 pr-12 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all text-[14px]"
                 />
                 <button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50">
                   <Send className="h-4 w-4 ml-0.5" />
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  )
}
