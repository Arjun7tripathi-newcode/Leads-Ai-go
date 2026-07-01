import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { ProspectList } from '@/models/ProspectList';

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: true, data: [] });
    }

    const lists = await ProspectList.find({}).sort({ createdAt: -1 });
    
    // We can also aggregate prospect count here if needed, 
    // or just rely on the length of prospectIds array
    const enrichedLists = lists.map(list => ({
      ...list.toObject(),
      leadCount: list.prospectIds.length
    }));

    return NextResponse.json({ success: true, data: enrichedLists });
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
    const list = await ProspectList.create(data);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
