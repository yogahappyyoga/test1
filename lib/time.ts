import type { HourConditions } from "./types";

/**
 * Open-Meteo returns hourly "time" as spot-local wall-clock strings
 * (e.g. "2026-09-27T14:00", no offset). To find "now" in that same frame,
 * shift the current UTC instant by the spot's utc offset.
 */
export function currentSpotLocalHourStart(utcOffsetSeconds: number): string {
  const localMs = Date.now() + utcOffsetSeconds * 1000;
  const local = new Date(localMs);
  local.setUTCMinutes(0, 0, 0);
  return local.toISOString().slice(0, 16);
}

/** Drops hours before the spot's current local hour, so index 0 is "now". */
export function fromNow(
  hours: HourConditions[],
  utcOffsetSeconds: number
): HourConditions[] {
  const nowKey = currentSpotLocalHourStart(utcOffsetSeconds);
  const startIdx = hours.findIndex((h) => h.time >= nowKey);
  return startIdx === -1 ? hours : hours.slice(startIdx);
}
