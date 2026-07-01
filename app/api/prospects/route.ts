import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Prospect } from '@/models/Prospect';

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: true, data: [] });
    }

    const prospects = await Prospect.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: prospects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 503 });
    }

    const data = await request.json();
    const prospect = await Prospect.create(data);
    return NextResponse.json({ success: true, data: prospect });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
