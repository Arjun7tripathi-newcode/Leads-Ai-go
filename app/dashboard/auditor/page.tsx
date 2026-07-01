"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, ShieldCheck, Zap, Activity, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuditorDashboard } from "@/components/dashboard/auditor/AuditorDashboard";

export default function AuditorPage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "complete" | "error">("idle");
  const [auditData, setAuditData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Basic URL validation
    let targetUrl = url;
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    setStatus("scanning");
    setErrorMessage("");

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete audit.");
      }

      setAuditData(data);
      setStatus("complete");
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col pt-12 px-4">
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div 
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full text-center pb-32"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
              <SparkleIcon /> LeadFlow AI Auditor
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              AI Website Auditor
            </h1>
            <p className="text-xl text-gray-500 mb-12 max-w-2xl">
              Analyze your website, discover SEO opportunities, and get AI-powered growth recommendations in seconds.
            </p>

            <form onSubmit={handleAudit} className="w-full relative max-w-2xl mx-auto group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <Input
                type="url"
                required
                placeholder="Enter website URL (e.g. example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-14 pr-40 py-8 text-lg rounded-2xl shadow-sm border-gray-200/80 focus-visible:ring-blue-500/50 bg-white/50 backdrop-blur-sm"
              />
              <Button 
                type="submit" 
                size="lg"
                className="absolute right-2 top-2 bottom-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-8 text-base shadow-sm"
              >
                Analyze <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-8 text-sm font-medium text-gray-400">
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Tech SEO</span>
              <span className="flex items-center gap-2"><Zap className="w-4 h-4"/> Core Web Vitals</span>
              <span className="flex items-center gap-2"><Activity className="w-4 h-4"/> Content Gap</span>
            </div>
          </motion.div>
        )}

        {status === "scanning" && (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center pb-32"
          >
            <div className="relative w-24 h-24 mb-8">
               <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
               <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Search className="w-8 h-8 text-blue-600 animate-pulse" />
               </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing {url || "Website"}</h2>
            <p className="text-gray-500">Crawling pages, checking technical SEO, and running AI models...</p>
            <div className="mt-8 max-w-sm w-full space-y-4">
               {["Fetching meta tags", "Running Lighthouse audit", "Generating growth plan"].map((step, i) => (
                 <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-500">
                   <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                     <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
                   </div>
                   {step}
                 </div>
               ))}
            </div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div 
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center pb-32 text-center"
          >
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Failed</h2>
            <p className="text-red-600 max-w-md mx-auto mb-8 font-medium">
              {errorMessage}
            </p>
            <Button onClick={() => setStatus("idle")} variant="outline" className="bg-white">
              Try Another URL
            </Button>
          </motion.div>
        )}

        {status === "complete" && auditData && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <AuditorDashboard data={auditData} onNewAudit={() => setStatus("idle")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.6447 9.35534L22 12L14.6447 14.6447L12 22L9.35534 14.6447L2 12L9.35534 9.35534L12 2Z" fill="currentColor"/>
    </svg>
  );
}
