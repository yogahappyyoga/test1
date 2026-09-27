import spotsData from "@/data/spots.json";
import type { Spot } from "./types";

export const spots: Spot[] = spotsData;

export function getSpotById(id: string): Spot | undefined {
  return spots.find((s) => s.id === id);
}

export function searchSpots(query: string): Spot[] {
  const q = query.trim().toLowerCase();
  if (!q) return spots;
  return spots.filter(
    (s) =>
      s.name.toLowerCase().includes(q) || s.region.toLowerCase().includes(q)
  );
}
