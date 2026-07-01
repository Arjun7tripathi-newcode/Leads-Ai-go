import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Prospect } from "@/models/Prospect";

export async function POST(req: Request) {
  try {
    const { leads, duplicateAction = "skip" } = await req.json();

    if (!Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: "No leads provided" }, { status: 400 });
    }

    await connectToDatabase();

    let saved = 0;
    let duplicates = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const lead of leads) {
      try {
        const name = (lead.name || "").trim();
        if (!name) { failed++; continue; }

        const website = (lead.website || lead.url || "").trim();
        const email   = (lead.email || "").trim().toLowerCase();
        const phone   = (lead.phone || "").trim();

        // Compute opportunity score and recommended service
        const hasWebsite = !!website;
        let opportunityScore = hasWebsite ? 30 : 80;
        let recommendedService = hasWebsite ? "SEO & Digital Marketing" : "Website Development";
        let estimatedDealValue = hasWebsite ? "₹8,000 – ₹25,000/month" : "₹15,000 – ₹50,000";
        let websiteStatus: string = hasWebsite ? "Poor Website" : "No Website";
        let seoScore: number | null = hasWebsite ? null : null; // Will be set by analysis

        if (!hasWebsite) {
          opportunityScore = 85;
          recommendedService = "Website Development";
          estimatedDealValue = "₹15,000 – ₹50,000";
          websiteStatus = "No Website";
        }

        // Build filter for duplicate detection
        const orConditions: any[] = [{ name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: "i" } }];
        if (email) orConditions.push({ email: email });
        if (phone) orConditions.push({ phone: phone });
        if (website) orConditions.push({ "company.website": website });

        const existing = await Prospect.findOne({ $or: orConditions });

        if (existing) {
          if (duplicateAction === "skip") {
            duplicates++;
            continue;
          } else if (duplicateAction === "update") {
            await Prospect.findByIdAndUpdate(existing._id, {
              $set: {
                email: email || existing.email,
                phone: phone || existing.phone,
                location: lead.location || existing.location,
                category: lead.category || existing.category,
                "company.website": website || existing.company?.website,
                opportunityScore,
                recommendedService,
                estimatedDealValue,
                websiteStatus,
              }
            });
            saved++;
            continue;
          }
          // "import" falls through — insert new anyway
          if (duplicateAction !== "import") { duplicates++; continue; }
        }

        await Prospect.create({
          name,
          email,
          phone,
          location:  lead.location || "",
          category:  lead.category || lead.industry || "",
          tags:      lead.notes ? [lead.notes] : [],
          status:    (['New','Qualified','Contacted','Interested','Meeting Scheduled','Proposal Sent','Won','Lost'].includes(lead.status))
                       ? lead.status : 'New',
          jobTitle:  lead.jobTitle || lead.contactName ? "Contact" : "Owner / Manager",
          company: {
            name:     name,
            website:  website,
            industry: lead.category || lead.industry || "",
          },
          opportunityScore,
          recommendedService,
          estimatedDealValue,
          websiteStatus,
          seoScore,
          isAnalyzed: false,
          leadScore:  hasWebsite ? 50 : 75,
        });
        saved++;
      } catch (e: any) {
        failed++;
        errors.push(e.message || "Unknown error");
      }
    }

    return NextResponse.json({
      success: true,
      saved,
      duplicates,
      failed,
      total: leads.length,
      errors: errors.slice(0, 10),
    });
  } catch (error: any) {
    console.error("Bulk save error:", error);
    return NextResponse.json({ error: error.message || "Bulk save failed" }, { status: 500 });
  }
}
