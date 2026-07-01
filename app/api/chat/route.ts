import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    
    const apiKey = user?.openaiApiKey || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: "OpenAI API key is required. Please set it in Settings." 
      }, { status: 403 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are LeadFlow AI Assistant. You help users manage leads, write outreach, and analyze data."
          },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to fetch OpenAI");
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      message: data.choices[0].message 
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error.message || "Failed to process chat" }, { status: 500 });
  }
}
