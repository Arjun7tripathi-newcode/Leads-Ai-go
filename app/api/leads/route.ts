import { NextResponse } from "next/server";

// GET /api/leads - returns saved leads (empty initially)
export async function GET() {
  return NextResponse.json({ success: true, data: [] });
}

// POST /api/leads - not used; search is at /api/leads/search
export async function POST() {
  return NextResponse.json({ error: "Use POST /api/leads/search to search for leads" }, { status: 400 });
}
