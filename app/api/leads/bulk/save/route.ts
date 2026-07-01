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

    // Upsert each lead by name+location to avoid duplicates
    const saved = await Promise.all(
      leads.map(async (lead: any) => {
        const doc = await Lead.findOneAndUpdate(
          { name: lead.name, location: lead.location },
          {
            $set: {
              name: lead.name,
              website: lead.website || null,
              phone: lead.phone || null,
              location: lead.location || null,
              rating: lead.rating || null,
              status: lead.status || "Unverified",
              source: lead.source || "Google Maps",
              category: lead.category || null,
            },
          },
          { upsert: true, new: true }
        );
        return doc;
      })
    );

    return NextResponse.json({ success: true, saved: saved.length, message: `${saved.length} leads saved to your account` });
  } catch (error: any) {
    console.error("Bulk save error:", error);
    return NextResponse.json({ error: error.message || "Failed to save leads" }, { status: 500 });
  }
}
