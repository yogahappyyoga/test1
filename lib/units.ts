export type WindSpeedUnit = "mph" | "kn";

export function kmhToMph(kmh: number): number {
  return kmh * 0.621371;
}

export function kmhToKnots(kmh: number): number {
  return kmh * 0.539957;
}

export function convertWindSpeed(kmh: number, unit: WindSpeedUnit): number {
  return unit === "mph" ? kmhToMph(kmh) : kmhToKnots(kmh);
}

export function metersToFeet(m: number): number {
  return m * 3.28084;
}

const COMPASS_LABELS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
];

/** Converts a compass degree (0-360, meteorological "from" direction) to a short label like "NW". */
export function degToCompassLabel(deg: number): string {
  const idx = Math.round((((deg % 360) + 360) % 360) / 22.5) % 16;
  return COMPASS_LABELS[idx];
}
