import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Email from "@/models/Email";
import EmailAccount from "@/models/EmailAccount";
import DraftReply from "@/models/DraftReply";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const TONE_PROMPTS: Record<string, string> = {
  Professional: "Write in a professional, polished tone. Use clear and concise language.",
  Friendly: "Write in a warm, friendly tone. Be approachable and personable.",
  Formal: "Write in a formal, corporate tone. Use proper grammar and professional language.",
  Sales: "Write in a persuasive sales tone. Be enthusiastic, highlight value, and include a clear CTA.",
  Support: "Write in a helpful, empathetic tone. Acknowledge the issue and provide clear assistance.",
  Concise: "Write a very short, direct reply. Maximum 3 sentences. Get to the point immediately.",
};

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { emailId, tone = "Professional", customVoice } = await request.json();
    await connectToDatabase();

    const account = await EmailAccount.findOne({ emailAddress: session.user.email });
    if (!account) {
      return NextResponse.json({ error: "No Gmail account connected" }, { status: 404 });
    }

    const email = await Email.findById(emailId);
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const toneInstruction = customVoice || TONE_PROMPTS[tone] || TONE_PROMPTS["Professional"];
    const signature = account.signature
      ? `\n\nBest regards,\n${account.signature}`
      : "";

    const systemPrompt = `You are an AI email assistant helping a business respond to emails. 
${toneInstruction}
Generate a reply to the following email. The reply should be in HTML format suitable for email.
Include <p> tags for paragraphs. Do NOT include <html>, <head>, or <body> tags.
End with a polite sign-off.`;

    const emailContext = `
Original Email:
From: ${email.from}
Subject: ${email.subject}
Content: ${email.bodyText || email.snippet}
`;

    const { text: bodyHtml } = await generateText({
      model: google("gemini-2.0-flash"),
      system: systemPrompt,
      prompt: emailContext,
    });

    const replySubject = email.subject.startsWith("Re:")
      ? email.subject
      : `Re: ${email.subject}`;

    // Save as draft
    const draft = await DraftReply.create({
      emailId: email._id,
      accountId: account._id,
      subject: replySubject,
      bodyHtml: bodyHtml + signature,
      bodyText: bodyHtml.replace(/<[^>]+>/g, ""),
      status: "draft",
      generatedByAi: true,
      toneUsed: tone,
    });

    return NextResponse.json({
      draftId: draft._id,
      subject: replySubject,
      bodyHtml: bodyHtml + signature,
      tone,
    });
  } catch (error: any) {
    console.error("[Generate Reply Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
