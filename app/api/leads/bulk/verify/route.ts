import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Lead } from "@/models/Lead";

export async function POST(req: Request) {
  try {
    const { leads } = await req.json();
    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: "No leads provided" }, { status: 400 });
    }

    await connectToDatabase();

    // Heuristically verify leads (e.g. check if they have a website and phone)
    const verifiedLeads = [];
    for (const lead of leads) {
      if (lead.website || lead.phone) {
        verifiedLeads.push(lead._id);
        if (lead._id) {
            await Lead.updateOne(
            { _id: lead._id },
            { $set: { status: "Verified" } }
            );
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      verifiedCount: verifiedLeads.length, 
      message: `${verifiedLeads.length} leads verified` 
    });
  } catch (error: any) {
    console.error("Bulk verify error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify leads" }, { status: 500 });
  }
}
