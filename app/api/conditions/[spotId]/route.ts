import { NextResponse } from "next/server";
import { getSpotById } from "@/lib/spots";
import { fetchSpotConditions } from "@/lib/openMeteo";
import { getOrSet } from "@/lib/cache";
import { fromNow } from "@/lib/time";

const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes, within the 15-30min budget

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ spotId: string }> }
) {
  const { spotId } = await params;
  const spot = getSpotById(spotId);

  if (!spot) {
    return NextResponse.json({ error: "Unknown spot" }, { status: 404 });
  }

  try {
    const conditions = await getOrSet(spotId, CACHE_TTL_MS, () =>
      fetchSpotConditions(spot)
    );

    return NextResponse.json({
      ...conditions,
      hours: fromNow(conditions.hours, conditions.utcOffsetSeconds),
    });
  } catch (err) {
    console.error(`Failed to fetch conditions for ${spotId}`, err);
    return NextResponse.json(
      { error: "Failed to fetch conditions" },
      { status: 502 }
    );
  }
}
