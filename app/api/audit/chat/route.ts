import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, history, auditData } = await req.json();

    const openAiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;

    if (!openAiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY. Please add to .env.local to use the chat." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert AI Business Growth Consultant. 
You are advising a client about their website based on a recent audit.
Here is the audit data:
${auditData ? auditData : "No audit data provided."}

Keep your answers concise, highly actionable, and professional. Use markdown formatting if necessary.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: message }
    ];

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
      }),
    });

    if (!aiRes.ok) {
      throw new Error("Failed to reach AI provider.");
    }

    const aiData = await aiRes.json();
    return NextResponse.json({ reply: aiData.choices[0].message.content });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to generate reply" }, { status: 500 });
  }
}
