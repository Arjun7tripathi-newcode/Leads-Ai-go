import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Email from "@/models/Email";
import EmailAccount from "@/models/EmailAccount";
import { markAsRead } from "@/lib/gmail";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messageId } = await params;

  try {
    await connectToDatabase();

    const account = await EmailAccount.findOne({ emailAddress: session.user.email });
    if (!account) {
      return NextResponse.json({ error: "No account found" }, { status: 404 });
    }

    const email = await Email.findOne({ messageId, accountId: account._id }).lean();
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // Mark as read if unread
    if (!(email as any).isRead) {
      await Email.findByIdAndUpdate((email as any)._id, { isRead: true });
      try {
        await markAsRead(account._id.toString(), messageId);
      } catch {}
    }

    return NextResponse.json(email);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
