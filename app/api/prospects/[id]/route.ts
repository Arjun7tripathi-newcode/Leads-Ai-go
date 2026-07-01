import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Prospect } from '@/models/Prospect';

// Next.js 15: params is a Promise
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectToDatabase();
    const data = await request.json();
    const prospect = await Prospect.findByIdAndUpdate(id, data, { new: true });
    if (!prospect) {
      return NextResponse.json({ success: false, error: "Prospect not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: prospect });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectToDatabase();
    const prospect = await Prospect.findByIdAndDelete(id);
    if (!prospect) {
      return NextResponse.json({ success: false, error: "Prospect not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
