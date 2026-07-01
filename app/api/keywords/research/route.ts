import { NextResponse } from 'next/server';

const INTENTS = ['Informational', 'Navigational', 'Commercial', 'Transactional'] as const;

export async function POST(request: Request) {
  try {
    const { keyword } = await request.json();

    if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'A keyword is required.' },
        { status: 400 }
      );
    }

    const openaiKey = process.env.OPENAI_API_KEY;

    if (!openaiKey) {
       return NextResponse.json(
        { success: false, error: 'Missing OPENAI_API_KEY. Please add it to .env.local.' },
        { status: 500 }
      );
    }

    const prompt = `You are an expert SEO data analyst. A user wants keyword research data for the seed keyword: "${keyword.trim()}".

Return a single valid JSON object (no markdown, no code fences, just raw JSON) with exactly this structure:

{
  "mainKeyword": {
    "keyword": "${keyword.trim()}",
    "volume": <integer monthly search volume, realistic>,
    "cpc": <float USD cost-per-click, 2 decimal places>,
    "difficulty": <integer 0-100, keyword difficulty>,
    "intent": <one of: "Informational" | "Navigational" | "Commercial" | "Transactional">,
    "trend": [<6 integers 10-100 representing 6-month search trend>]
  },
  "relatedKeywords": [<10 keyword objects with same shape minus id>],
  "longTailKeywords": [<10 long-tail keyword objects (4+ words) with same shape minus id>],
  "aiInsights": "<2-3 sentence analysis of the opportunity, competition, and recommended strategy>"
}

Rules:
- relatedKeywords and longTailKeywords must each have exactly 10 items
- All data should be realistic and SEO-accurate for 2025
- Long-tail keywords must be 4+ word phrases
- Return ONLY the raw JSON object, no explanations`;

    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiRes.ok) {
      const errData = await aiRes.json().catch(() => ({}));
      throw new Error(errData?.error?.message || 'OpenAI request failed');
    }

    const aiData = await aiRes.json();
    const rawContent = aiData.choices?.[0]?.message?.content?.trim() || '{}';
    const parsed = JSON.parse(rawContent);

    const sanitizeKw = (item: any, index: number, prefix = 'kw') => ({
      id: `${prefix}-${index}`,
      keyword: String(item.keyword || ''),
      volume: Math.max(0, parseInt(item.volume) || 0),
      cpc: Math.max(0, parseFloat(item.cpc) || 0),
      difficulty: Math.min(100, Math.max(0, parseInt(item.difficulty) || 0)),
      intent: (item.intent && INTENTS.includes(item.intent)) ? item.intent : 'Informational',
      trend: Array.isArray(item.trend)
        ? item.trend.slice(0, 6).map((v: any) => Math.min(100, Math.max(10, parseInt(v) || 50)))
        : [50, 55, 48, 60, 58, 65],
    });

    return NextResponse.json({
      success: true,
      data: {
        mainKeyword: sanitizeKw(parsed.mainKeyword || {}, 0),
        relatedKeywords: (parsed.relatedKeywords || []).slice(0, 10).map((k: any, i: number) => sanitizeKw(k, i)),
        longTailKeywords: (parsed.longTailKeywords || []).slice(0, 10).map((k: any, i: number) => sanitizeKw(k, i, 'lt')),
        aiInsights: String(parsed.aiInsights || 'No insights available.'),
        source: 'ai',
      },
    });

  } catch (error: any) {
    console.error('Keyword research error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
