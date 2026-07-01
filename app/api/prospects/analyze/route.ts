import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Prospect } from "@/models/Prospect";

// ── Heuristic SEO & Website analyzer (no external deps) ─────────────────────
async function analyzeWebsite(url: string) {
  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  const hasSSL = fullUrl.startsWith("https://");

  let html = "";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(fullUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LeadFlowBot/1.0)" },
    });
    clearTimeout(timeout);
    html = await res.text();
  } catch {
    // Cannot reach website
    return null;
  }

  const lower = html.toLowerCase();

  // SEO markers
  const hasTitle = /<title[^>]*>[^<]+<\/title>/i.test(html);
  const hasMetaDescription = /meta[^>]+name=["']description["'][^>]+content=["'][^"']{10,}/i.test(html);
  const hasH1 = /<h1[^>]*>[^<]+<\/h1>/i.test(html);
  const hasSchema = lower.includes('"@context"') || lower.includes("schema.org");
  const hasMobileViewport = lower.includes("viewport");
  const hasContactForm = lower.includes("<form") && (lower.includes("contact") || lower.includes("email") || lower.includes("message"));
  const hasOpenGraph = lower.includes("og:title") || lower.includes("property=\"og:");
  const hasLiveChat = lower.includes("livechat") || lower.includes("tawk") || lower.includes("intercom") || lower.includes("crisp") || lower.includes("chat");
  const hasBookingSystem = lower.includes("calendly") || lower.includes("booking") || lower.includes("appointment") || lower.includes("schedule");
  const hasTrustSignals = lower.includes("trustpilot") || lower.includes("ssl") || lower.includes("secure") || lower.includes("guaranteed") || lower.includes("testimonial");
  const hasSocialMedia = lower.includes("facebook") || lower.includes("instagram") || lower.includes("twitter") || lower.includes("linkedin");
  const imageCount = (html.match(/<img /gi) || []).length;
  const wordCount = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const isResponsive = hasMobileViewport && (lower.includes("max-width") || lower.includes("media query") || lower.includes("@media"));

  // SEO Score (0-100)
  const seoSignals = [
    hasTitle, hasMetaDescription, hasH1, hasSchema, hasSSL,
    hasMobileViewport, hasContactForm, hasOpenGraph,
    imageCount > 0, wordCount > 200,
  ];
  const seoScore = Math.round((seoSignals.filter(Boolean).length / seoSignals.length) * 100);

  // Design quality heuristic
  const hasBootstrap = lower.includes("bootstrap");
  const hasTailwind = lower.includes("tailwind");
  const hasReact = lower.includes("_next") || lower.includes("react");
  let designQuality: "Poor" | "Average" | "Good" | "Excellent" = "Poor";
  if (hasReact || hasTailwind) designQuality = "Excellent";
  else if (hasBootstrap || (hasMobileViewport && hasContactForm)) designQuality = "Good";
  else if (hasMobileViewport) designQuality = "Average";

  // Website status
  let websiteStatus: "Poor Website" | "Outdated Website" | "Good Website" | "Excellent Website" = "Poor Website";
  if (seoScore >= 80 && (designQuality === "Good" || designQuality === "Excellent")) websiteStatus = "Excellent Website";
  else if (seoScore >= 60) websiteStatus = "Good Website";
  else if (seoScore >= 40) websiteStatus = "Outdated Website";

  return {
    seoAnalysis: { hasTitle, hasMetaDescription, hasH1, hasSchema, hasSSL, hasMobileViewport, hasContactForm, hasOpenGraph, imageCount, wordCount, lastAnalyzed: new Date() },
    websiteAnalysis: { isResponsive, hasLiveChat, hasBookingSystem, hasTrustSignals, hasSocialMedia, designQuality },
    seoScore,
    websiteStatus,
  };
}

// ── Opportunity Engine ───────────────────────────────────────────────────────
function computeOpportunity(prospect: any, analysis: any | null) {
  let score = 0;
  let service = "Website Development";
  let dealValue = "₹15,000 – ₹50,000";
  const hasWebsite = !!prospect.company?.website && analysis !== null;

  if (!hasWebsite) {
    score += 50;
    service = "Website Development";
    dealValue = "₹15,000 – ₹50,000";
  } else {
    const seoScore = analysis?.seoScore ?? 50;
    if (seoScore < 40) { score += 30; service = "Technical SEO"; dealValue = "₹12,000 – ₹30,000/month"; }
    else if (seoScore < 60) { score += 20; service = "Local SEO & Google Business Optimization"; dealValue = "₹8,000 – ₹20,000/month"; }
    else { score += 10; service = "SEO & Content Marketing"; dealValue = "₹10,000 – ₹25,000/month"; }

    if (!analysis?.seoAnalysis?.hasContactForm) score += 15;
    if (!analysis?.websiteAnalysis?.hasSocialMedia) score += 15;
    if (!analysis?.websiteAnalysis?.hasLiveChat) score += 5;
    if (!analysis?.websiteAnalysis?.hasTrustSignals) score += 10;
  }

  // Low reviews factor
  const reviews = prospect.reviewCount || 0;
  const rating = prospect.googleRating || 0;
  if (reviews < 20) score += 10;
  if (rating < 3.5 && rating > 0) score += 10;

  if (!analysis?.websiteAnalysis?.hasSocialMedia) {
    service = hasWebsite ? service : "Website + Social Media Marketing";
    if (!hasWebsite) { score += 15; dealValue = "₹25,000 – ₹80,000"; }
  }

  score = Math.min(score, 100);

  // High score adjustments
  if (score >= 80) { service = "Full Digital Marketing Package"; dealValue = "₹30,000 – ₹1,00,000"; }
  else if (!hasWebsite && score >= 65) { service = "Website Development + Local SEO"; dealValue = "₹25,000 – ₹60,000"; }

  return { opportunityScore: score, recommendedService: service, estimatedDealValue: dealValue };
}

export async function POST(req: Request) {
  try {
    const { prospectId } = await req.json();
    if (!prospectId) return NextResponse.json({ error: "No prospectId provided" }, { status: 400 });

    await connectToDatabase();
    const prospect = await Prospect.findById(prospectId);
    if (!prospect) return NextResponse.json({ error: "Prospect not found" }, { status: 404 });

    const website = prospect.company?.website || null;
    let analysis = null;

    if (website) {
      analysis = await analyzeWebsite(website);
    }

    const { opportunityScore, recommendedService, estimatedDealValue } = computeOpportunity(prospect, analysis);

    const update: any = {
      opportunityScore,
      recommendedService,
      estimatedDealValue,
      websiteStatus: analysis ? analysis.websiteStatus : "No Website",
      seoScore: analysis ? analysis.seoScore : null,
      isAnalyzed: true,
    };

    if (analysis) {
      update.seoAnalysis = analysis.seoAnalysis;
      update.websiteAnalysis = analysis.websiteAnalysis;
    }

    // Generate AI summary, intent and outreach angle
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      const prompt = `You are an AI sales intelligence assistant for a digital marketing agency in India.
Analyze this business prospect and return a JSON object with exactly these fields:

Business: ${prospect.name}
Category: ${prospect.category || prospect.company?.industry || 'Local Business'}
Location: ${prospect.location || 'India'}
Website: ${website || 'None'}
Website Status: ${update.websiteStatus}
SEO Score: ${update.seoScore ?? 'N/A'} / 100
Google Rating: ${prospect.googleRating || 'N/A'} (${prospect.reviewCount || 0} reviews)
Recommended Service: ${recommendedService}
Opportunity Score: ${opportunityScore}/100
Has Contact Form: ${analysis?.seoAnalysis?.hasContactForm ?? false}
Has Social Media: ${analysis?.websiteAnalysis?.hasSocialMedia ?? false}
Has Live Chat: ${analysis?.websiteAnalysis?.hasLiveChat ?? false}
Has Trust Signals: ${analysis?.websiteAnalysis?.hasTrustSignals ?? false}

Return ONLY a raw JSON object (no markdown, no code fences) with exactly these keys:
{
  "summary": "2 sentences — specific insight for a sales rep about this prospect's biggest pain and best opportunity",
  "intent": "Low" | "Medium" | "High",
  "outreachAngle": "1 concise sentence describing the best angle to use when pitching this prospect (e.g., 'Lead with their missing website and low visibility to local customers')"
}`;

      try {
        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.4,
            max_tokens: 300,
          }),
        });
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const parsed = JSON.parse(aiData.choices?.[0]?.message?.content || '{}');
          if (parsed.summary) update['aiAnalysis.summary'] = parsed.summary;
          if (parsed.intent && ['Low', 'Medium', 'High'].includes(parsed.intent)) {
            update['aiAnalysis.intent'] = parsed.intent;
          }
          if (parsed.outreachAngle) update['aiAnalysis.outreachAngle'] = parsed.outreachAngle;
        }
      } catch { /* silent */ }
    } else {
      // Fallback summary
      if (!website) {
        update['aiAnalysis.summary'] = `${prospect.name} has no website — a prime candidate for website development services. With ${prospect.reviewCount || 0} Google reviews, a strong digital presence could significantly boost their visibility.`;
      } else {
        update['aiAnalysis.summary'] = `${prospect.name} has a website but with an SEO score of ${update.seoScore ?? 'unknown'}, there is clear room for improvement. Pitching ${recommendedService} could deliver strong ROI.`;
      }
      update['aiAnalysis.intent'] = opportunityScore >= 70 ? 'High' : opportunityScore >= 40 ? 'Medium' : 'Low';
      update['aiAnalysis.outreachAngle'] = !website
        ? 'Lead with their missing website and lost local customers'
        : `Focus on improving their SEO score and capturing more local search traffic`;
    }


    update["aiAnalysis.growthOpportunities"] = [
      !website ? "Build a professional website from scratch" : null,
      (update.seoScore ?? 0) < 60 ? "Improve on-page SEO to rank higher locally" : null,
      !analysis?.seoAnalysis?.hasContactForm ? "Add a lead-capture contact form" : null,
      !analysis?.websiteAnalysis?.hasSocialMedia ? "Set up social media profiles and run ads" : null,
      !analysis?.websiteAnalysis?.hasTrustSignals ? "Add reviews, testimonials, and trust signals" : null,
      (prospect.reviewCount || 0) < 20 ? "Launch a Google review generation campaign" : null,
    ].filter(Boolean);

    const updated = await Prospect.findByIdAndUpdate(prospectId, { $set: update }, { new: true });

    return NextResponse.json({ success: true, prospect: updated });
  } catch (error: any) {
    console.error("Analyze error:", error);
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 });
  }
}
