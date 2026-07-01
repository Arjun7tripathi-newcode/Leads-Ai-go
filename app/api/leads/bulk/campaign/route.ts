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

    const updatedLeads = [];
    for (const lead of leads) {
      if (lead._id) {
        updatedLeads.push(lead._id);
        await Lead.updateOne(
          { _id: lead._id },
          { $set: { campaignStatus: "Active" } }
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      addedCount: updatedLeads.length, 
      message: `${updatedLeads.length} leads added to campaign` 
    });
  } catch (error: any) {
    console.error("Bulk campaign error:", error);
    return NextResponse.json({ error: error.message || "Failed to add leads to campaign" }, { status: 500 });
  }
}
