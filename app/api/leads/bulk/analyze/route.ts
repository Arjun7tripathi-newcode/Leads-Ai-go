import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { leads } = await req.json();
    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: "No leads provided" }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;

    // Build a compact summary of each lead for the AI prompt
    const leadsText = leads.map((l: any, i: number) =>
      `${i + 1}. ${l.name} | Category: ${l.category || "Unknown"} | Website: ${l.website ? l.website : "NONE"} | Phone: ${l.phone || "No"} | Rating: ${l.rating ?? "?"} (${l.reviewCount ?? 0} reviews) | Location: ${l.location}`
    ).join("\n");

    let analysisResults: any[] = [];

    if (openaiKey) {
      // Call OpenAI for real AI analysis
      const prompt = `You are a B2B lead scoring AI for a digital marketing agency. Analyze the following business leads and for each return a JSON object.

Leads:
${leadsText}

For each lead return a JSON array item with these fields:
- index: (number, 1-based)
- score: (0-100, based on digital marketing opportunity — higher if no website, low reviews, high growth potential)
- businessType: (short description)
- websiteStatus: "Missing" | "Outdated likely" | "Has website"
- seoOpportunity: "High" | "Medium" | "Low"
- recommendedService: (main service to pitch, e.g. "Website Development", "SEO Services", "Google Ads", "Social Media Marketing")
- estimatedDealValue: (e.g. "$500–$2,000" or "$1,000–$5,000")
- summary: (1 sentence insight for a sales rep)

Respond with ONLY a valid JSON array. No markdown, no explanation.`;

      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const content = aiData.choices?.[0]?.message?.content || "[]";
        try {
          analysisResults = JSON.parse(content);
        } catch {
          // fallback to heuristic below
        }
      }
    }

    // Heuristic fallback (no OpenAI key or parse failed)
    if (analysisResults.length === 0) {
      analysisResults = leads.map((l: any, i: number) => {
        const hasWebsite = !!l.website;
        const lowRating = l.rating && l.rating < 3.5;
        const fewReviews = !l.reviewCount || l.reviewCount < 20;
        const score = Math.round(
          (hasWebsite ? 40 : 75) +
          (lowRating ? 10 : 0) +
          (fewReviews ? 10 : 0) +
          Math.random() * 10
        );
        return {
          index: i + 1,
          score: Math.min(score, 99),
          businessType: l.category || "Local Business",
          websiteStatus: hasWebsite ? "Has website" : "Missing",
          seoOpportunity: hasWebsite ? "Medium" : "High",
          recommendedService: hasWebsite ? "SEO Services" : "Website Development",
          estimatedDealValue: score > 75 ? "$1,000–$5,000" : "$500–$2,000",
          summary: hasWebsite
            ? `${l.name} has a web presence but may benefit from SEO or paid ads.`
            : `${l.name} has no website — strong candidate for web development services.`,
        };
      });
    }

    // Merge analysis back with lead data
    const enriched = leads.map((lead: any, i: number) => {
      const analysis = analysisResults.find((a: any) => a.index === i + 1) || analysisResults[i];
      return { ...lead, analysis };
    });

    return NextResponse.json({ success: true, enriched });
  } catch (error: any) {
    console.error("AI Analyze error:", error);
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 });
  }
}
