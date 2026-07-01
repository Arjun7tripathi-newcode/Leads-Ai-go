import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Email from "@/models/Email";
import EmailAccount from "@/models/EmailAccount";
import Prospect from "@/models/Prospect";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const EMAIL_CATEGORIES = [
  "Lead Inquiry", "Support Request", "Sales Question", "Meeting Request",
  "Invoice", "Spam", "Newsletter", "Job Application", "Partnership", "General Inquiry"
];

function parseSender(from: string) {
  const match = from.match(/^"?(.+?)"?\s*<(.+)>$/);
  if (match) return { name: match[1].trim(), email: match[2] };
  return { name: from, email: from };
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { emailId } = await request.json();
    await connectToDatabase();

    const account = await EmailAccount.findOne({ emailAddress: session.user.email });
    if (!account) return NextResponse.json({ error: "No account" }, { status: 404 });

    const email = await Email.findById(emailId);
    if (!email) return NextResponse.json({ error: "Email not found" }, { status: 404 });

    const content = email.bodyText || email.snippet;

    // Classify + extract lead info
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are an email classifier and lead extractor. 
               Classify the email and if it looks like a lead inquiry, extract contact info.
               Respond ONLY with JSON matching this exact schema:
               {
                 "category": "<one of: ${EMAIL_CATEGORIES.join(", ")}>",
                 "confidence": <0.0-1.0>,
                 "isLead": <true|false>,
                 "leadData": {
                   "name": "<sender name or null>",
                   "email": "<sender email>",
                   "company": "<company name or null>",
                   "phone": "<phone or null>",
                   "summary": "<1 sentence about their inquiry>"
                 }
               }`,
      prompt: `From: ${email.from}\nSubject: ${email.subject}\nContent: ${content}`,
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
    } catch {
      parsed = { category: "General Inquiry", confidence: 0.5, isLead: false };
    }

    // Update email classification
    await Email.findByIdAndUpdate(emailId, {
      category: parsed.category,
      classificationConfidence: parsed.confidence,
    });

    let prospectCreated = null;

    // Auto-create Prospect for lead inquiries
    if (parsed.isLead && parsed.leadData) {
      const { name, email: senderEmail, company, phone, summary } = parsed.leadData;
      const sender = parseSender(email.from);

      const existingProspect = await Prospect.findOne({ email: senderEmail || sender.email });
      if (!existingProspect) {
        prospectCreated = await Prospect.create({
          name: name || sender.name,
          email: senderEmail || sender.email,
          phone: phone || "",
          jobTitle: "",
          company: { name: company || "" },
          category: "Lead",
          source: "Gmail",
          notes: summary || `Inbound email: ${email.subject}`,
          websiteStatus: "No Website",
          seoScore: null,
          opportunityScore: 50,
          recommendedService: "",
          estimatedDealValue: "",
          isEmailVerified: true,
          googleRating: 0,
          reviewCount: 0,
          location: "",
        });

        // Link prospect to email
        await Email.findByIdAndUpdate(emailId, { prospectId: prospectCreated._id });
      }
    }

    return NextResponse.json({
      category: parsed.category,
      confidence: parsed.confidence,
      isLead: parsed.isLead,
      prospectCreated: prospectCreated ? { id: prospectCreated._id, name: prospectCreated.name } : null,
    });
  } catch (error: any) {
    console.error("[Classify Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
