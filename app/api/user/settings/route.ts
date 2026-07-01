import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      apifyApiKey: user.apifyApiKey || "",
      openaiApiKey: user.openaiApiKey || "",
    });
  } catch (error: any) {
    console.error("Error fetching user settings:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { apifyApiKey, openaiApiKey } = await req.json();

    await connectToDatabase();
    await User.updateOne(
      { email: session.user.email },
      { $set: { apifyApiKey: apifyApiKey || "", openaiApiKey: openaiApiKey || "" } }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating user settings:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
