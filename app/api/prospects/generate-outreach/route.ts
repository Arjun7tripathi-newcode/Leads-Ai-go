import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Prospect } from '@/models/Prospect';

export async function POST(request: Request) {
  try {
    const { prospectId, type } = await request.json();

    if (!prospectId) {
      return NextResponse.json({ success: false, error: 'prospectId is required' }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json(
        { success: false, error: 'Missing OPENAI_API_KEY. Please add it to .env.local.' },
        { status: 500 }
      );
    }

    await connectToDatabase();
    const prospect = await Prospect.findById(prospectId);

    if (!prospect) {
      return NextResponse.json({ success: false, error: 'Prospect not found' }, { status: 404 });
    }

    // Build rich context from real prospect data
    const businessName = prospect.name || 'the business';
    const category = prospect.category || prospect.company?.industry || 'local business';
    const website = prospect.company?.website;
    const rating = prospect.googleRating;
    const reviewCount = prospect.reviewCount || 0;
    const websiteStatus = prospect.websiteStatus || 'No Website';
    const seoScore = prospect.seoScore;
    const recommendedService = prospect.recommendedService || 'Digital Marketing';
    const estimatedDeal = prospect.estimatedDealValue || '';
    const location = prospect.location || '';
    const opportunityScore = prospect.opportunityScore || 50;
    const aiSummary = prospect.aiAnalysis?.summary || '';
    const growthOpportunities = prospect.aiAnalysis?.growthOpportunities?.join(', ') || '';

    const outreachType = (type as string) || 'cold';

    const prompts: Record<string, string> = {
      cold: `You are an expert B2B sales copywriter working for a digital marketing agency in India.
Write a personalized cold outreach email to the owner/manager of "${businessName}", a ${category} located in ${location || 'India'}.

Context about this prospect:
- Website: ${website || 'None (no website found)'}
- Website Status: ${websiteStatus}
- SEO Score: ${seoScore != null ? seoScore + '/100' : 'N/A'}
- Google Rating: ${rating != null ? rating + ' ⭐ (' + reviewCount + ' reviews)' : 'Not rated'}
- Recommended Service: ${recommendedService}
- Opportunity Score: ${opportunityScore}/100
${aiSummary ? '- AI Insight: ' + aiSummary : ''}
${growthOpportunities ? '- Growth Opportunities: ' + growthOpportunities : ''}

Write a compelling, personalized cold email that:
1. Opens with a specific observation about their business (not generic)
2. Identifies their biggest pain point based on the data
3. Proposes ${recommendedService} as the solution
4. Has a clear, low-pressure CTA for a quick call
5. Feels human, not salesy
6. Is 150-200 words max
7. Ends with a professional sign-off from "the LeadFlow team"

Return ONLY the email text, no labels or markdown.`,

      followup: `You are an expert B2B sales copywriter working for a digital marketing agency in India.
Write a personalized follow-up email to the owner/manager of "${businessName}", a ${category} ${location ? 'in ' + location : ''}, who did not reply to a previous cold email.

Context:
- Website: ${website || 'None'}
- Recommended Service: ${recommendedService}
- Opportunity Score: ${opportunityScore}/100
${aiSummary ? '- AI Insight: ' + aiSummary : ''}

Write a short, friendly follow-up that:
1. References the previous email briefly
2. Adds a new piece of value or insight (e.g., a quick tip or industry fact)
3. Is direct and not pushy
4. Is 80-120 words max
5. Ends with a professional sign-off from "the LeadFlow team"

Return ONLY the email text, no labels or markdown.`,

      linkedin: `You are an expert B2B sales copywriter working for a digital marketing agency in India.
Write a personalized LinkedIn connection request message for the owner/manager of "${businessName}", a ${category} ${location ? 'in ' + location : ''}.

Context:
- Recommended Service: ${recommendedService}
${aiSummary ? '- AI Insight: ' + aiSummary : ''}

Write a LinkedIn message that:
1. Is friendly and personal, not salesy
2. Mentions something specific about their business
3. States your value proposition in one sentence
4. Is under 300 characters (LinkedIn limit)

Return ONLY the message text, no labels or markdown.`,

      whatsapp: `You are an expert B2B sales copywriter working for a digital marketing agency in India.
Write a short WhatsApp message to the owner/manager of "${businessName}", a ${category} ${location ? 'in ' + location : ''}.

Context:
- Website: ${website || 'None'}
- Recommended Service: ${recommendedService}
- Google Rating: ${rating != null ? rating + ' ⭐' : 'N/A'}
${aiSummary ? '- AI Insight: ' + aiSummary : ''}

Write a WhatsApp outreach message that:
1. Starts with a greeting and their business name
2. Mentions 1 specific observation (no website, low SEO, etc.)
3. Offers a quick win or free audit
4. Has a simple CTA (reply YES or call to action)
5. Is conversational, brief (max 100 words), uses emojis sparingly

Return ONLY the message text, no labels or markdown.`,
    };

    const prompt = prompts[outreachType] || prompts.cold;

    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.75,
        max_tokens: 400,
      }),
    });

    if (!aiRes.ok) {
      const errData = await aiRes.json();
      throw new Error(errData.error?.message || 'OpenAI request failed');
    }

    const aiData = await aiRes.json();
    const content = aiData.choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    console.error('Generate outreach error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
