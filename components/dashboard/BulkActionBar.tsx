"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Save, Trash2, MailCheck, Sparkles, X, Plus, Users,
  Loader2, CheckCircle2, AlertCircle, FileText,
} from "lucide-react";

// ─── Toast ───────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "loading";
interface Toast { id: string; message: string; type: ToastType }

// ─── Export helpers ──────────────────────────────────────────────────────────
function leadsToCSV(leads: any[]): string {
  const headers = ["Name", "Category", "Phone", "Website", "Location", "Rating", "Reviews", "Status"];
  const rows = leads.map(l => [
    `"${(l.name || "").replace(/"/g, '""')}"`,
    `"${(l.category || "").replace(/"/g, '""')}"`,
    `"${l.phone || ""}"`,
    `"${l.website || ""}"`,
    `"${(l.location || "").replace(/"/g, '""')}"`,
    l.rating ?? "",
    l.reviewCount ?? "",
    l.status || "",
  ].join(","));
  return [headers.join(","), ...rows].join("\n");
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface BulkActionBarProps {
  selectedLeads: any[];
  onClear: () => void;
  onDelete: (ids: string[]) => void;
  onAnalysisComplete?: (enriched: any[]) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function BulkActionBar({
  selectedLeads,
  onClear,
  onDelete,
  onAnalysisComplete,
}: BulkActionBarProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const selectedCount = selectedLeads.length;

  // Toast helpers
  const addToast = (message: string, type: ToastType): string => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    if (type !== "loading") setTimeout(() => removeToast(id), 4000);
    return id;
  };
  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));
  const updateToast = (id: string, message: string, type: ToastType) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, message, type } : t));
    if (type !== "loading") setTimeout(() => removeToast(id), 4000);
  };

  // ── EXPORT ──────────────────────────────────────────────────────────────────
  const handleExport = (format: "csv" | "json") => {
    setShowExportMenu(false);
    const tid = addToast(`Preparing ${format.toUpperCase()} export...`, "loading");

    try {
      if (format === "csv") {
        const csv = leadsToCSV(selectedLeads);
        downloadFile(csv, `leadflow-export-${Date.now()}.csv`, "text/csv;charset=utf-8;");
      } else {
        const json = JSON.stringify(selectedLeads, null, 2);
        downloadFile(json, `leadflow-export-${Date.now()}.json`, "application/json");
      }
      updateToast(tid, `${selectedCount} leads exported as ${format.toUpperCase()}`, "success");
    } catch {
      updateToast(tid, "Export failed. Please try again.", "error");
    }
  };

  // ── SAVE ─────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setLoadingAction("save");
    const tid = addToast("Saving leads to your account...", "loading");
    try {
      const res = await fetch("/api/leads/bulk/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: selectedLeads }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      updateToast(tid, json.message || `${selectedCount} leads saved!`, "success");
    } catch (e: any) {
      updateToast(tid, e.message || "Failed to save leads.", "error");
    } finally {
      setLoadingAction(null);
    }
  };

  // ── VERIFY ───────────────────────────────────────────────────────────────────
  const handleVerify = async () => {
    setLoadingAction("verify");
    const tid = addToast("Verifying leads...", "loading");
    try {
      const res = await fetch("/api/leads/bulk/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: selectedLeads }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      updateToast(tid, json.message || `${json.verifiedCount} leads verified`, "success");
    } catch (e: any) {
      updateToast(tid, e.message || "Failed to verify leads.", "error");
    } finally {
      setLoadingAction(null);
    }
  };

  // ── AI ANALYZE ───────────────────────────────────────────────────────────────
  const handleAIAnalyze = async () => {
    setLoadingAction("analyze");
    const tid = addToast(`Analyzing ${selectedCount} leads with AI...`, "loading");
    try {
      const res = await fetch("/api/leads/bulk/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: selectedLeads }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      updateToast(tid, `AI analysis complete for ${selectedCount} leads!`, "success");
      if (onAnalysisComplete && json.enriched) onAnalysisComplete(json.enriched);
    } catch (e: any) {
      updateToast(tid, e.message || "AI analysis failed.", "error");
    } finally {
      setLoadingAction(null);
    }
  };

  // ── ADD TO CAMPAIGN ──────────────────────────────────────────────────────────
  const handleAddToCampaign = async () => {
    setLoadingAction("campaign");
    const tid = addToast("Adding leads to campaign...", "loading");
    try {
      const res = await fetch("/api/leads/bulk/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: selectedLeads }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      updateToast(tid, json.message || `${json.addedCount} leads added to Campaign!`, "success");
    } catch (e: any) {
      updateToast(tid, e.message || "Failed to add to campaign.", "error");
    } finally {
      setLoadingAction(null);
    }
  };

  // ── ADD TO PROSPECTS ──────────────────────────────────────────────────────────
  const handleAddToProspects = async () => {
    setLoadingAction("prospects");
    const tid = addToast("Saving leads as prospects...", "loading");
    
    try {
      const res = await fetch("/api/prospects/bulk/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: selectedLeads }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      updateToast(tid, json.message || `${selectedCount} leads added to Prospects!`, "success");
      
      // Redirect to prospects page
      setTimeout(() => {
        router.push("/dashboard/prospects");
      }, 500);
    } catch (e: any) {
      updateToast(tid, e.message || "Failed to add to prospects.", "error");
      setLoadingAction(null);
    }
  };

  // ── DELETE ───────────────────────────────────────────────────────────────────
  const handleDelete = () => {
    const ids = selectedLeads.map(l => l._id);
    onDelete(ids);
    onClear();
    addToast(`${selectedCount} leads removed from results.`, "success");
    setShowDeleteConfirm(false);
  };

  if (selectedCount === 0) return null;

  const isLoading = (action: string) => loadingAction === action;
  const anyLoading = !!loadingAction;

  return (
    <>
      {/* ── Toast Container ───────────────────────────────────── */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md pointer-events-auto text-[14px] font-medium ${
                t.type === "success" ? "bg-emerald-950 border-emerald-800 text-emerald-200" :
                t.type === "error"   ? "bg-red-950 border-red-800 text-red-200" :
                                       "bg-gray-950 border-gray-800 text-gray-200"
              }`}
            >
              {t.type === "loading" && <Loader2 className="h-4 w-4 animate-spin text-blue-400" />}
              {t.type === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              {t.type === "error"   && <AlertCircle className="h-4 w-4 text-red-400" />}
              {t.message}
              <button onClick={() => removeToast(t.id)} className="ml-2 opacity-60 hover:opacity-100">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Delete Confirm Modal ────────────────────────────────── */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Remove {selectedCount} leads?</h3>
                  <p className="text-[13px] text-gray-500">They will be removed from the current results.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 h-11 rounded-xl border border-gray-200 text-[14px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-[14px] font-semibold text-white transition-colors"
                >
                  Remove Leads
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Bar ───────────────────────────────────────────── */}
      <motion.div
        initial={{ y: 100, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        exit={{ y: 100, opacity: 0, x: "-50%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-10 left-[calc(50%+130px)] z-50 flex items-center gap-2 p-2 bg-[#0F172A] rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-xl"
      >
        {/* Count + Clear */}
        <div className="flex items-center gap-2 pl-3 pr-3 border-r border-gray-700">
          <span className="bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-lg text-[13px]">
            {selectedCount} Selected
          </span>
          <button onClick={onClear} className="p-1 text-gray-500 hover:text-white transition-colors" title="Clear selection">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 px-1">

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(v => !v)}
              disabled={anyLoading}
              className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-10 min-w-[160px]"
                >
                  <button onClick={() => handleExport("csv")} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50 text-left">
                    <FileText className="h-4 w-4 text-green-600" /> Export as CSV
                  </button>
                  <button onClick={() => handleExport("json")} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50 text-left border-t border-gray-100">
                    <FileText className="h-4 w-4 text-blue-600" /> Export as JSON
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={anyLoading}
            className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading("save") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </button>

          {/* Verify */}
          <button
            onClick={handleVerify}
            disabled={anyLoading}
            className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading("verify") ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4" />}
            Verify
          </button>

          {/* AI Analyze */}
          <button
            onClick={handleAIAnalyze}
            disabled={anyLoading}
            className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-indigo-300 hover:text-indigo-100 hover:bg-indigo-500/20 rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading("analyze") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            AI Analyze
          </button>

          {/* Add to Campaign */}
          <button
            onClick={handleAddToCampaign}
            disabled={anyLoading}
            className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading("campaign") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add to Campaign
          </button>

          {/* Add to Prospects */}
          <button
            onClick={handleAddToProspects}
            disabled={anyLoading}
            className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading("prospects") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
            Add to Prospects
          </button>
        </div>

        {/* Delete */}
        <div className="pl-2 pr-1 border-l border-gray-700">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={anyLoading}
            title="Remove from results"
            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </>
  );
}
