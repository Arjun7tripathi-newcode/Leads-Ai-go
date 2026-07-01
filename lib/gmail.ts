import { google } from "googleapis";
import { connectToDatabase } from "./db";
import EmailAccount from "@/models/EmailAccount";

const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
];

export function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/email/callback`
  );
}

export function getGmailAuthUrl() {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GMAIL_SCOPES,
    prompt: "consent",
  });
}

export async function getGmailClient(accountId: string) {
  await connectToDatabase();
  const account = await EmailAccount.findById(accountId);
  if (!account) throw new Error("Email account not found");

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
  });

  // Auto-refresh token if expired
  oauth2Client.on("tokens", async (tokens) => {
    if (tokens.access_token) {
      account.accessToken = tokens.access_token;
      if (tokens.expiry_date) {
        account.tokenExpiry = new Date(tokens.expiry_date);
      }
      await account.save();
    }
  });

  return google.gmail({ version: "v1", auth: oauth2Client });
}

export interface ParsedEmail {
  messageId: string;
  threadId: string;
  subject: string;
  from: string;
  to: string[];
  cc: string[];
  date: Date;
  snippet: string;
  bodyText: string;
  bodyHtml: string;
  labels: string[];
  isRead: boolean;
  attachments: { filename: string; mimeType: string; size: number; attachmentId: string }[];
}

function decodeBase64(data: string): string {
  return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
}

function extractBody(payload: any): { text: string; html: string } {
  let text = "";
  let html = "";

  function walk(part: any) {
    if (!part) return;
    if (part.mimeType === "text/plain" && part.body?.data) {
      text = decodeBase64(part.body.data);
    } else if (part.mimeType === "text/html" && part.body?.data) {
      html = decodeBase64(part.body.data);
    } else if (part.parts) {
      part.parts.forEach(walk);
    }
  }

  walk(payload);
  return { text, html };
}

export function parseGmailMessage(msg: any): ParsedEmail {
  const headers: Record<string, string> = {};
  (msg.payload?.headers || []).forEach((h: any) => {
    headers[h.name.toLowerCase()] = h.value;
  });

  const { text, html } = extractBody(msg.payload);

  const attachments: ParsedEmail["attachments"] = [];
  function findAttachments(part: any) {
    if (!part) return;
    if (part.filename && part.body?.attachmentId) {
      attachments.push({
        filename: part.filename,
        mimeType: part.mimeType,
        size: part.body.size || 0,
        attachmentId: part.body.attachmentId,
      });
    }
    if (part.parts) part.parts.forEach(findAttachments);
  }
  findAttachments(msg.payload);

  const toHeader = headers["to"] || "";
  const ccHeader = headers["cc"] || "";

  return {
    messageId: msg.id,
    threadId: msg.threadId,
    subject: headers["subject"] || "(No Subject)",
    from: headers["from"] || "",
    to: toHeader ? toHeader.split(",").map((e: string) => e.trim()) : [],
    cc: ccHeader ? ccHeader.split(",").map((e: string) => e.trim()) : [],
    date: new Date(parseInt(msg.internalDate) || Date.now()),
    snippet: msg.snippet || "",
    bodyText: text,
    bodyHtml: html,
    labels: msg.labelIds || [],
    isRead: !(msg.labelIds || []).includes("UNREAD"),
    attachments,
  };
}

export async function fetchEmails(accountId: string, maxResults = 50) {
  const gmail = await getGmailClient(accountId);

  const listRes = await gmail.users.messages.list({
    userId: "me",
    maxResults,
    labelIds: ["INBOX"],
  });

  const messages = listRes.data.messages || [];
  const parsed: ParsedEmail[] = [];

  for (const msg of messages) {
    try {
      const full = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "full",
      });
      parsed.push(parseGmailMessage(full.data));
    } catch (err) {
      console.error(`Failed to fetch message ${msg.id}:`, err);
    }
  }

  return parsed;
}

export async function sendEmailViaGmail(
  accountId: string,
  to: string,
  subject: string,
  bodyHtml: string,
  inReplyTo?: string,
  threadId?: string
) {
  const gmail = await getGmailClient(accountId);

  const account = await EmailAccount.findById(accountId);
  const from = account?.emailAddress || "me";

  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
  ];

  if (inReplyTo) {
    headers.push(`In-Reply-To: ${inReplyTo}`);
    headers.push(`References: ${inReplyTo}`);
  }

  const raw = Buffer.from(headers.join("\r\n") + "\r\n\r\n" + bodyHtml)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const params: any = { userId: "me", requestBody: { raw } };
  if (threadId) params.requestBody.threadId = threadId;

  const res = await gmail.users.messages.send(params);
  return res.data;
}

export async function markAsRead(accountId: string, messageId: string) {
  const gmail = await getGmailClient(accountId);
  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: { removeLabelIds: ["UNREAD"] },
  });
}
