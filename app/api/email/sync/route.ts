import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import EmailAccount from "@/models/EmailAccount";
import Email from "@/models/Email";
import { fetchEmails } from "@/lib/gmail";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const EMAIL_CATEGORIES = [
  "Lead Inquiry", "Support Request", "Sales Question", "Meeting Request",
  "Invoice", "Spam", "Newsletter", "Job Application", "Partnership", "General Inquiry"
];

async function classifyEmail(subject: string, snippet: string): Promise<{ category: string; confidence: number }> {
  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: `You are an email classifier. Classify the email into exactly one of these categories: ${EMAIL_CATEGORIES.join(", ")}. 
               Respond with JSON only: {"category": "...", "confidence": 0.0-1.0}`,
      prompt: `Subject: ${subject}\nPreview: ${snippet}`,
    });
    return JSON.parse(text);
  } catch {
    return { category: "General Inquiry", confidence: 0.5 };
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // Find the user's email account
    const account = await EmailAccount.findOne({ emailAddress: session.user.email });
    if (!account) {
      return NextResponse.json({ error: "No Gmail account connected. Please sign in with Gmail." }, { status: 404 });
    }

    // Fetch emails from Gmail API
    const emails = await fetchEmails(account._id.toString(), 50);
    let synced = 0;
    let classified = 0;
    let updated = 0;

    for (const parsed of emails) {
      // Check if already stored
      const exists = await Email.findOne({ messageId: parsed.messageId });
      
      if (exists) {
        // Update existing email's read status and labels
        await Email.updateOne(
          { _id: exists._id },
          { $set: { isRead: parsed.isRead, labels: parsed.labels } }
        );
        updated++;
        continue;
      }

      // Classify via AI
      const { category, confidence } = await classifyEmail(parsed.subject, parsed.snippet);
      classified++;

      // Create Email
      const emailDoc = await Email.create({
        accountId: account._id,
        messageId: parsed.messageId,
        threadId: parsed.threadId,
        subject: parsed.subject,
        from: parsed.from,
        to: parsed.to,
        cc: parsed.cc,
        date: parsed.date,
        snippet: parsed.snippet,
        bodyText: parsed.bodyText,
        bodyHtml: parsed.bodyHtml,
        labels: parsed.labels,
        isRead: parsed.isRead,
        attachments: parsed.attachments,
        category,
        classificationConfidence: confidence,
      });

      // CRM Integration for Lead Inquiry
      if (category === "Lead Inquiry") {
        const { Prospect } = await import("@/models/Prospect");
        const match = parsed.from.match(/^"?(.+?)"?\s*<(.+)>$/);
        const name = match ? match[1].trim() : parsed.from;
        const emailAddr = match ? match[2].trim() : parsed.from;
        
        let prospect = await Prospect.findOne({ email: emailAddr });
        if (!prospect) {
          prospect = await Prospect.create({
            name: name,
            email: emailAddr,
            category: "Lead Inquiry",
            opportunityScore: 70, // Default for inbound
            status: "New"
          });
        }
        
        emailDoc.prospectId = prospect._id;
        await emailDoc.save();
      }

      synced++;
    }

    // Update last sync time
    account.lastSyncAt = new Date();
    await account.save();

    return NextResponse.json({ synced, updated, classified, total: emails.length });
  } catch (error: any) {
    console.error("[Email Sync Error]", error);
    return NextResponse.json({ error: error.message || "Sync failed" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const account = await EmailAccount.findOne({ emailAddress: session.user.email });
    return NextResponse.json({ 
      connected: !!account,
      lastSyncAt: account?.lastSyncAt || null,
      emailAddress: account?.emailAddress || null
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
