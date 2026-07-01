import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { ProspectList } from '@/models/ProspectList';
import { Prospect } from '@/models/Prospect';

// Need to register Prospect model if it hasn't been already
// (importing it usually does this, but good to be safe)

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 503 });
    }

    const list = await ProspectList.findById(id).populate('prospectIds');
    if (!list) {
      return NextResponse.json({ success: false, error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 503 });
    }

    const data = await request.json();
    const updatedList = await ProspectList.findByIdAndUpdate(id, data, { new: true });
    
    if (!updatedList) {
      return NextResponse.json({ success: false, error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 503 });
    }

    const deletedList = await ProspectList.findByIdAndDelete(id);
    
    if (!deletedList) {
      return NextResponse.json({ success: false, error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
