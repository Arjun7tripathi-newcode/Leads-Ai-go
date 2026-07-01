import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Prospect } from "@/models/Prospect";

export async function DELETE(req: Request) {
  try {
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No prospect IDs provided" }, { status: 400 });
    }

    await connectToDatabase();

    const result = await Prospect.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.deletedCount, 
      message: `${result.deletedCount} prospects deleted` 
    });
  } catch (error: any) {
    console.error("Bulk delete prospect error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete prospects" }, { status: 500 });
  }
}
