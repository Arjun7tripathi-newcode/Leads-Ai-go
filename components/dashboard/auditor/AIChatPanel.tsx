"use client";

import React, { useState } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  auditData: any | null;
}

export function AIChatPanel({ auditData }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I've analyzed your website. Ask me anything about your SEO score, performance, or how to improve conversions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/audit/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          auditData: auditData ? JSON.stringify(auditData).substring(0, 5000) : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "I encountered an error trying to process your request. Please ensure the API keys are configured." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to reach the AI service. Please check your connection or API keys." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-medium text-gray-900">AI Consultant</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-gray-100 text-gray-600" : "bg-blue-600 text-white"}`}>
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`text-sm p-3 rounded-2xl max-w-[85%] ${msg.role === "user" ? "bg-blue-50 text-blue-900 rounded-tr-sm" : "bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm"}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="text-sm p-3 rounded-2xl bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="relative flex items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your website..."
            className="pr-12 py-6 bg-gray-50 border-gray-200 focus-visible:ring-blue-500 rounded-xl"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["How do I improve rankings?", "Generate content strategy"].map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setInput(prompt);
                setTimeout(() => handleSend(), 10);
              }}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
