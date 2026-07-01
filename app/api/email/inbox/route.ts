import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import Email from "@/models/Email";
import EmailAccount from "@/models/EmailAccount";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const unreadOnly = searchParams.get("unreadOnly") === "true";

  try {
    await connectToDatabase();

    const account = await EmailAccount.findOne({ emailAddress: session.user.email });
    if (!account) {
      return NextResponse.json({ emails: [], total: 0, connected: false });
    }

    const query: any = { accountId: account._id };
    if (category && category !== "All") query.category = category;
    if (unreadOnly) query.isRead = false;
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { from: { $regex: search, $options: "i" } },
        { snippet: { $regex: search, $options: "i" } },
        { to: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { labels: { $regex: search, $options: "i" } },
        { 'attachments.filename': { $regex: search, $options: "i" } },
      ];
    }

    const total = await Email.countDocuments(query);
    const emails = await Email.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Dashboard stats
    const unreadCount = await Email.countDocuments({ accountId: account._id, isRead: false });
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayCount = await Email.countDocuments({ accountId: account._id, date: { $gte: todayStart } });

    return NextResponse.json({
      emails,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      connected: true,
      stats: { unread: unreadCount, today: todayCount }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
