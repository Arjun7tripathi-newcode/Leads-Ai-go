"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Mail, WifiOff, Sparkles, RefreshCw, Filter } from "lucide-react";
import { InboxSidebar } from "@/components/inbox/InboxSidebar";
import { EmailList, EmailItem } from "@/components/inbox/EmailList";
import { EmailDetail } from "@/components/inbox/EmailDetail";
import { cn } from "@/lib/utils";

export default function InboxPage() {
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connected, setConnected] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [lastSyncAt, setLastSyncAt] = useState("");
  const [stats, setStats] = useState({ unread: 0, today: 0 });
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [syncStatus, setSyncStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchInbox = useCallback(async (page = 1, category = selectedCategory, search = searchQuery) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "25",
        ...(category !== "All" && { category }),
        ...(search && { search }),
      });
      const res = await fetch(`/api/email/inbox?${params}`);
      const data = await res.json();
      setEmails(data.emails || []);
      setConnected(data.connected ?? false);
      setTotalPages(data.totalPages || 1);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  const checkConnection = useCallback(async () => {
    try {
      const res = await fetch("/api/email/sync");
      const data = await res.json();
      setConnected(data.connected);
      setEmailAddress(data.emailAddress || "");
      setLastSyncAt(data.lastSyncAt || "");
    } catch {}
  }, []);

  const handleBackgroundSync = useCallback(async () => {
    try {
      const res = await fetch("/api/email/sync", { method: "POST" });
      if (res.ok) {
        await fetchInbox(currentPage, selectedCategory, searchQuery);
        
        // Update connection info
        const connRes = await fetch("/api/email/sync");
        const connData = await connRes.json();
        setConnected(connData.connected);
        setLastSyncAt(connData.lastSyncAt || "");
      }
    } catch (err) {
      // Background sync fail silently
    }
  }, [currentPage, selectedCategory, searchQuery, fetchInbox]);

  useEffect(() => {
    checkConnection().then(() => {
      handleBackgroundSync(); // initial sync
    });
    fetchInbox();
  }, [checkConnection, fetchInbox, handleBackgroundSync]);

  useEffect(() => {
    if (!connected) return;
    const intervalId = setInterval(() => {
      handleBackgroundSync();
    }, 30000);
    return () => clearInterval(intervalId);
  }, [connected, handleBackgroundSync]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    fetchInbox(1, cat, searchQuery);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    fetchInbox(1, selectedCategory, q);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch("/api/email/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSyncStatus({ message: `Synced ${data.synced} new emails, ${data.classified} classified`, type: "success" });
      await fetchInbox(1, selectedCategory, searchQuery);
      await checkConnection();
    } catch (err: any) {
      setSyncStatus({ message: err.message || "Sync failed", type: "error" });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  const handleSelectEmail = async (email: EmailItem) => {
    // Show email immediately with snippet, then fetch full body
    setSelectedEmail(email);
    try {
      const res = await fetch(`/api/email/${email.messageId}`);
      if (res.ok) {
        const full = await res.json();
        setSelectedEmail(full);
        // Update read status in list
        setEmails(prev => prev.map(e => e._id === email._id ? { ...e, isRead: true } : e));
      }
    } catch {
      // keep showing the selected email with snippet
    }
  };

  const handleSendReply = async (data: { to: string; subject: string; bodyHtml: string; draftId?: string }) => {
    const res = await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailId: selectedEmail._id,
        ...data,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to send");
    }
    setSyncStatus({ message: "Reply sent successfully!", type: "success" });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // Count emails per category (from loaded emails, approximate)
  const emailCounts: Record<string, number> = {};
  emails.forEach((e) => {
    if (e.category) emailCounts[e.category] = (emailCounts[e.category] || 0) + 1;
  });

  return (
    <div className="flex h-[calc(100vh-64px)] -m-8 overflow-hidden bg-[#FAFAFA]">
      {/* Sidebar */}
      <InboxSidebar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        unreadCount={stats.unread}
        onSync={handleSync}
        isSyncing={isSyncing}
        connected={connected}
        emailAddress={emailAddress}
        lastSyncAt={lastSyncAt}
        emailCounts={emailCounts}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by sender, subject, or content..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all">
            <Filter className="h-4 w-4" />
            Filter
          </button>

          {/* Stats Pills */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl">
              <span className="text-xs font-semibold text-blue-700">{stats.unread} Unread</span>
            </div>
            <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl">
              <span className="text-xs font-semibold text-gray-600">{stats.today} Today</span>
            </div>
          </div>
        </div>

        {/* Sync Status Toast */}
        {syncStatus && (
          <div className={cn(
            "px-4 py-2 text-xs font-medium text-center transition-all",
            syncStatus.type === "success" ? "bg-emerald-50 text-emerald-700 border-b border-emerald-100" : "bg-red-50 text-red-600 border-b border-red-100"
          )}>
            {syncStatus.message}
          </div>
        )}

        {/* Not Connected Banner */}
        {!connected && !isLoading && (
          <div className="mx-4 mt-4 px-5 py-4 bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200 rounded-2xl flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Connect your Gmail account</p>
              <p className="text-xs text-gray-500 mt-0.5">Sign in with Google to read and reply to emails with AI assistance</p>
            </div>
            <a
              href="/api/auth/signin?callbackUrl=/dashboard/inbox"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              Connect Gmail
            </a>
          </div>
        )}

        {/* Email Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email List */}
          <div className={cn(
            "flex flex-col border-r border-gray-100",
            selectedEmail ? "w-[360px] flex-shrink-0" : "flex-1"
          )}>
            {/* List Header */}
            <div className="px-4 py-2.5 border-b border-gray-50 flex items-center justify-between bg-white">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {selectedCategory === "All" ? "All Mail" : selectedCategory}
              </span>
              <span className="text-xs text-gray-400">{emails.length} emails</span>
            </div>
            <EmailList
              emails={emails}
              selectedId={selectedEmail?._id}
              onSelect={handleSelectEmail}
              isLoading={isLoading}
            />
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => { setCurrentPage(p => p - 1); fetchInbox(currentPage - 1); }}
                  className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-all"
                >
                  Prev
                </button>
                <span className="text-xs text-gray-500">{currentPage} / {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => { setCurrentPage(p => p + 1); fetchInbox(currentPage + 1); }}
                  className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Email Detail */}
          {selectedEmail ? (
            <EmailDetail
              email={selectedEmail}
              onSend={handleSendReply}
              onClose={() => setSelectedEmail(null)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50/50">
              <div className="text-center space-y-4 max-w-xs mx-auto p-8">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center mx-auto">
                  <Sparkles className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-base">AI Email Assistant</p>
                  <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                    Select an email to read it and generate an intelligent AI-powered reply in seconds.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {["Lead Inquiry", "Sales", "Support", "Meeting"].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-xs font-medium bg-white border border-gray-200 text-gray-600 rounded-full shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
