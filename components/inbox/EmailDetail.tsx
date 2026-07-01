"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Sparkles, Send, Edit3, Loader2, X, ChevronDown,
  Paperclip, Forward, Trash2, Archive, Star,
  AlertTriangle, ListChecks, FileText, UserPlus,
  CheckCircle2, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmailItem } from "./EmailList";
import { CATEGORY_COLORS } from "./InboxSidebar";

const TONES = ["Professional", "Friendly", "Formal", "Sales", "Support", "Concise"];

interface Props {
  email: EmailItem & {
    bodyText?: string;
    bodyHtml?: string;
    from: string;
    to: string[];
    cc?: string[];
  };
  onSend: (data: { to: string; subject: string; bodyHtml: string; draftId?: string }) => Promise<void>;
  onClose: () => void;
}

function parseSender(from: string) {
  const match = from.match(/^"?(.+?)"?\s*<(.+)>$/);
  if (match) return { name: match[1].trim(), email: match[2] };
  return { name: from, email: from };
}

interface AiAnalysis {
  type: string;
  result: any;
  loading: boolean;
}

export function EmailDetail({ email, onSend, onClose }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [replySubject, setReplySubject] = useState(`Re: ${email.subject}`);
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [draftId, setDraftId] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [analyses, setAnalyses] = useState<Record<string, AiAnalysis>>({});
  const [isClassifying, setIsClassifying] = useState(false);
  const [classifyResult, setClassifyResult] = useState<any>(null);

  const sender = parseSender(email.from);

  async function handleGenerateReply() {
    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/email/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId: email._id, tone: selectedTone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReplyBody(data.bodyHtml);
      setReplySubject(data.subject);
      setDraftId(data.draftId);
      setShowComposer(true);
    } catch (e: any) {
      setError(e.message || "Failed to generate reply");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSend() {
    setIsSending(true);
    setError("");
    try {
      await onSend({ to: sender.email, subject: replySubject, bodyHtml: replyBody, draftId });
      setShowComposer(false);
      setReplyBody("");
    } catch (e: any) {
      setError(e.message || "Failed to send email");
    } finally {
      setIsSending(false);
    }
  }

  async function runAnalysis(action: string) {
    setAnalyses((p) => ({ ...p, [action]: { type: action, result: null, loading: true } }));
    try {
      const res = await fetch("/api/email/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId: email._id, action }),
      });
      const data = await res.json();
      setAnalyses((p) => ({ ...p, [action]: { type: action, result: data.result, loading: false } }));
    } catch {
      setAnalyses((p) => ({ ...p, [action]: { type: action, result: "Failed", loading: false } }));
    }
  }

  async function handleClassifyToProspect() {
    setIsClassifying(true);
    try {
      const res = await fetch("/api/email/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId: email._id }),
      });
      const data = await res.json();
      setClassifyResult(data);
    } catch {
      setClassifyResult({ error: "Classification failed" });
    } finally {
      setIsClassifying(false);
    }
  }

  const categoryColor = email.category ? CATEGORY_COLORS[email.category] || "" : "";

  return (
    <div className="flex-1 flex overflow-hidden animate-slide-in">
      {/* Main Email View */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 leading-snug mb-2">{email.subject}</h2>
              <div className="flex flex-wrap items-center gap-2">
                {email.category && (
                  <span className={cn("px-2 py-0.5 text-xs font-semibold rounded-full border", categoryColor)}>
                    {email.category}
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {format(new Date(email.date), "MMMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => { setShowAiPanel(!showAiPanel); }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                  showAiPanel
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100"
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Tools
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
                <Star className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
                <Archive className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
                <Trash2 className="h-4 w-4" />
              </button>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sender */}
          <div className="mt-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {sender.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{sender.name}</p>
              <p className="text-xs text-gray-500">{sender.email}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">{error}</div>
          )}
          {email.bodyHtml ? (
            <div className="email-body" dangerouslySetInnerHTML={{ __html: email.bodyHtml }} />
          ) : (
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {email.bodyText || email.snippet || "No content"}
            </p>
          )}

          {/* Attachments */}
          {email.attachments?.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Attachments</p>
              <div className="flex flex-wrap gap-2">
                {email.attachments.map((att: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
                    <Paperclip className="h-3.5 w-3.5 text-gray-400" />
                    {att.filename}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Composer / Action Bar */}
        {showComposer ? (
          <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2">
                <span className="text-xs text-gray-500">To:</span>
                <span className="text-xs font-medium text-gray-800">{sender.email}</span>
              </div>
              <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2">
                <span className="text-xs text-gray-500">Subject:</span>
                <input
                  className="flex-1 text-xs text-gray-800 outline-none bg-transparent"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                />
              </div>
              <textarea
                className="w-full px-4 py-3 text-sm text-gray-800 outline-none resize-none bg-transparent min-h-[120px]"
                value={replyBody.replace(/<[^>]+>/g, "")}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Write your reply..."
              />
            </div>
            <div className="flex items-center justify-between">
              <button onClick={() => setShowComposer(false)} className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                Cancel
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateReply}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Regenerate
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending || !replyBody}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all disabled:opacity-50"
                >
                  {isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-100 px-6 py-4 bg-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg outline-none cursor-pointer hover:bg-gray-100 transition-all"
                >
                  {TONES.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={handleGenerateReply}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white text-xs font-semibold rounded-lg transition-all shadow-sm disabled:opacity-60"
              >
                {isGenerating ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Generating...</> : <><Sparkles className="h-3.5 w-3.5" />Generate AI Reply</>}
              </button>
              <button
                onClick={() => { setShowComposer(true); setReplyBody(""); }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-all"
              >
                <Edit3 className="h-3.5 w-3.5" />Write Reply
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-all">
                <Forward className="h-3.5 w-3.5" />Forward
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Analysis Side Panel */}
      {showAiPanel && (
        <div className="w-72 flex-shrink-0 bg-gray-50 border-l border-gray-100 flex flex-col overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-100 bg-white">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              AI Analysis
            </h3>
          </div>

          <div className="p-4 space-y-3 flex-1">
            {/* Quick Actions */}
            {[
              { action: "summarize", icon: FileText, label: "Summarize Email", color: "text-blue-600 bg-blue-50 border-blue-200" },
              { action: "detect_urgency", icon: AlertTriangle, label: "Detect Urgency", color: "text-amber-600 bg-amber-50 border-amber-200" },
              { action: "extract_actions", icon: ListChecks, label: "Extract Action Items", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
              { action: "suggest_followup", icon: ChevronRight, label: "Suggest Follow-ups", color: "text-violet-600 bg-violet-50 border-violet-200" },
            ].map(({ action, icon: Icon, label, color }) => (
              <div key={action} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => runAnalysis(action)}
                  disabled={analyses[action]?.loading}
                  className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-all text-left"
                >
                  <div className={cn("h-6 w-6 rounded-lg flex items-center justify-center border", color)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 flex-1">{label}</span>
                  {analyses[action]?.loading ? (
                    <Loader2 className="h-3.5 w-3.5 text-gray-400 animate-spin" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                  )}
                </button>
                {analyses[action]?.result && (
                  <div className="px-3 pb-3 pt-0 border-t border-gray-100">
                    <div className="text-[11px] text-gray-600 leading-relaxed mt-2">
                      {typeof analyses[action].result === "string" ? (
                        <p>{analyses[action].result}</p>
                      ) : action === "detect_urgency" ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Urgency:</span>
                            <span className={cn(
                              "px-1.5 py-0.5 rounded font-bold text-[10px]",
                              analyses[action].result.urgency >= 4 ? "bg-red-100 text-red-700" :
                              analyses[action].result.urgency >= 3 ? "bg-amber-100 text-amber-700" :
                              "bg-emerald-100 text-emerald-700"
                            )}>
                              {analyses[action].result.urgency}/5
                            </span>
                          </div>
                          <p>{analyses[action].result.reason}</p>
                        </div>
                      ) : Array.isArray(analyses[action].result) ? (
                        <ul className="space-y-1">
                          {analyses[action].result.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-gray-400 shrink-0">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>{JSON.stringify(analyses[action].result)}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Create Prospect */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={handleClassifyToProspect}
                disabled={isClassifying || !!classifyResult}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-all text-left disabled:opacity-60"
              >
                <div className="h-6 w-6 rounded-lg flex items-center justify-center border text-rose-600 bg-rose-50 border-rose-200">
                  <UserPlus className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-medium text-gray-700 flex-1">Create Prospect</span>
                {isClassifying ? (
                  <Loader2 className="h-3.5 w-3.5 text-gray-400 animate-spin" />
                ) : classifyResult?.prospectCreated ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                )}
              </button>
              {classifyResult && (
                <div className="px-3 pb-3 border-t border-gray-100">
                  <div className="mt-2 space-y-1">
                    {classifyResult.prospectCreated ? (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        Prospect created: {classifyResult.prospectCreated.name}
                      </div>
                    ) : classifyResult.isLead === false ? (
                      <p className="text-[11px] text-gray-500">Not detected as a lead inquiry</p>
                    ) : (
                      <p className="text-[11px] text-gray-500">Prospect already exists</p>
                    )}
                    {classifyResult.category && (
                      <p className="text-[11px] text-gray-500">Classified as: <span className="font-medium text-gray-700">{classifyResult.category}</span></p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
