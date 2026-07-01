import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Email from "@/models/Email";
import EmailAccount from "@/models/EmailAccount";
import DraftReply from "@/models/DraftReply";
import { sendEmailViaGmail } from "@/lib/gmail";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { emailId, to, subject, bodyHtml, draftId } = await request.json();

    await connectToDatabase();

    const account = await EmailAccount.findOne({ emailAddress: session.user.email });
    if (!account) {
      return NextResponse.json({ error: "No Gmail account connected" }, { status: 404 });
    }

    const originalEmail = await Email.findById(emailId);
    if (!originalEmail) {
      return NextResponse.json({ error: "Original email not found" }, { status: 404 });
    }

    await sendEmailViaGmail(
      account._id.toString(),
      to,
      subject,
      bodyHtml,
      originalEmail.messageId,
      originalEmail.threadId
    );

    // If sending from a draft, mark it as sent
    if (draftId) {
      await DraftReply.findByIdAndUpdate(draftId, { status: "sent" });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Send Email Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
