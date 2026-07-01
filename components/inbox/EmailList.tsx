"use client";

import { formatDistanceToNow } from "date-fns";
import { Paperclip, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS } from "./InboxSidebar";

export interface EmailItem {
  _id: string;
  messageId: string;
  threadId: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
  isRead: boolean;
  category?: string;
  attachments: { filename: string }[];
  labels: string[];
}

interface Props {
  emails: EmailItem[];
  selectedId?: string;
  onSelect: (email: EmailItem) => void;
  isLoading: boolean;
}

function parseSenderName(from: string): { name: string; email: string } {
  const match = from.match(/^"?(.+?)"?\s*<(.+)>$/);
  if (match) return { name: match[1].trim(), email: match[2] };
  return { name: from, email: from };
}

function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500",
  "bg-rose-500", "bg-cyan-500", "bg-pink-500", "bg-indigo-500",
];

function getAvatarColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function EmailList({ emails, selectedId, onSelect, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Loading emails...</p>
        </div>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3 p-8">
          <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
            <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="font-medium text-gray-700">No emails yet</p>
          <p className="text-sm text-gray-400">Click Sync to fetch your Gmail inbox</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {emails.map((email) => {
        const { name } = parseSenderName(email.from);
        const initials = getInitials(name);
        const avatarBg = getAvatarColor(name);
        const isSelected = email._id === selectedId;
        const categoryColor = email.category ? CATEGORY_COLORS[email.category] : "";

        return (
          <button
            key={email._id}
            onClick={() => onSelect(email)}
            className={cn(
              "w-full flex items-start gap-3 px-4 py-3.5 border-b border-gray-50 hover:bg-blue-50/40 transition-all text-left group",
              isSelected && "bg-blue-50 border-l-2 border-l-blue-600",
              !email.isRead && "bg-white"
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5",
              avatarBg
            )}>
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              {/* Row 1: Name + Time */}
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className={cn(
                  "text-sm truncate",
                  !email.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"
                )}>
                  {name}
                </span>
                <span className="text-[10px] text-gray-400 shrink-0">
                  {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
                </span>
              </div>

              {/* Row 2: Subject */}
              <p className={cn(
                "text-xs truncate mb-1",
                !email.isRead ? "text-gray-800 font-medium" : "text-gray-600"
              )}>
                {email.subject}
              </p>

              {/* Row 3: Snippet + badges */}
              <div className="flex items-center gap-2">
                <p className="text-[11px] text-gray-400 truncate flex-1">
                  {email.snippet}
                </p>
                <div className="flex items-center gap-1 shrink-0">
                  {email.attachments?.length > 0 && (
                    <Paperclip className="h-3 w-3 text-gray-300" />
                  )}
                  {email.category && (
                    <span className={cn(
                      "px-1.5 py-0.5 text-[9px] font-semibold rounded-full border hidden group-hover:inline-block",
                      categoryColor
                    )}>
                      {email.category.split(" ")[0]}
                    </span>
                  )}
                  {!email.isRead && (
                    <Circle className="h-2 w-2 fill-blue-600 text-blue-600" />
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
