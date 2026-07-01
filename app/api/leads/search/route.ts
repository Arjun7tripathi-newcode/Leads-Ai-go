import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || !query.trim()) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    let apifyKey = process.env.APIFY_API_KEY;

    // Check if user has their own API key
    const session = await auth();
    if (session?.user?.email) {
      await connectToDatabase();
      const user = await User.findOne({ email: session.user.email });
      if (user && user.apifyApiKey) {
        apifyKey = user.apifyApiKey;
      }
    }

    if (!apifyKey) {
      return NextResponse.json({ error: "Missing APIFY_API_KEY in environment or user settings" }, { status: 500 });
    }

    // compass~crawler-google-places is the most popular Google Maps scraper on Apify
    const actorId = "compass~crawler-google-places";
    const apifyUrl = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apifyKey}`;

    const apifyResponse = await fetch(apifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchStringsArray: [query],
        maxCrawledPlaces: 10,
        language: "en",
      }),
    });

    if (!apifyResponse.ok) {
      const errText = await apifyResponse.text();
      console.error("Apify error:", errText);
      throw new Error(`Apify returned ${apifyResponse.status}: ${errText.slice(0, 200)}`);
    }

    const rawData = await apifyResponse.json();

    if (!Array.isArray(rawData)) {
      throw new Error("Unexpected Apify response format");
    }

    // Map Apify Google Maps format to our Lead format
    const data = rawData.map((item: any, idx: number) => ({
      _id: item.placeId || `place_${idx}`,
      id: item.placeId || `place_${idx}`,
      name: item.title || "Unknown Business",
      website: item.website || null,
      phone: item.phone || null,
      location: item.address || item.city || "Unknown Location",
      rating: typeof item.totalScore === "number" ? item.totalScore : null,
      reviewCount: item.reviewsCount || 0,
      category: item.categoryName || null,
      status: item.isClaimed ? "Verified" : "Unverified",
      source: "Google Maps",
      createdAt: new Date().toISOString(),
    }));

    return NextResponse.json({ success: true, data, count: data.length });
  } catch (error: any) {
    console.error("Lead Search Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
