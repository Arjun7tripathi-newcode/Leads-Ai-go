import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Email from "@/models/Email";
import EmailAccount from "@/models/EmailAccount";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { emailId, action } = await request.json();
    // action: 'summarize' | 'extract_actions' | 'detect_urgency' | 'suggest_followup'

    await connectToDatabase();
    const account = await EmailAccount.findOne({ emailAddress: session.user.email });
    if (!account) return NextResponse.json({ error: "No account" }, { status: 404 });

    const email = await Email.findById(emailId);
    if (!email) return NextResponse.json({ error: "Email not found" }, { status: 404 });

    const content = email.bodyText || email.snippet || email.subject;

    const prompts: Record<string, string> = {
      summarize: `Summarize this email in 2-3 concise sentences. Focus on the main ask or information:\n\n${content}`,
      extract_actions: `Extract all action items from this email. Return a JSON array of strings:\n\n${content}`,
      detect_urgency: `Rate the urgency of this email from 1-5 (1=low, 5=critical) and explain why in one sentence. Return JSON: {"urgency": 1-5, "reason": "..."}\n\n${content}`,
      suggest_followup: `Suggest 3 follow-up actions or questions based on this email. Return a JSON array:\n\n${content}`,
    };

    const prompt = prompts[action];
    if (!prompt) return NextResponse.json({ error: "Unknown action" }, { status: 400 });

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
    });

    // Try to parse JSON for structured responses
    let result: any = text;
    if (["extract_actions", "detect_urgency", "suggest_followup"].includes(action)) {
      try {
        result = JSON.parse(text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
      } catch { result = text; }
    }

    return NextResponse.json({ result, action });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
