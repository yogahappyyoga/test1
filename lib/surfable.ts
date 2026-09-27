import type { Surfability } from "./types";

/**
 * Configurable thresholds for the "is it worth paddling out" heuristic.
 * Tune these to taste — they are the only knob on the whole heuristic.
 */
export const SURFABLE_THRESHOLDS = {
  /** Below this wave height (m), it's basically flat. */
  minWaveHeightM: 0.3,
  /** Wave height (m) at/above which conditions are considered good, given enough period. */
  goodWaveHeightM: 0.6,
  /** Wave period (s) at/above which swell is considered "organized" groundswell. */
  goodPeriodS: 9,
  /** Wind speed (km/h) at/below which wind isn't a problem. */
  calmWindKmh: 14,
  /** Wind speed (km/h) at/above which wind blows it out. */
  strongWindKmh: 28,
};

type SurfabilityInput = {
  waveHeightM: number;
  wavePeriodS: number;
  windSpeedKmh: number;
};

export function classifySurfability({
  waveHeightM,
  wavePeriodS,
  windSpeedKmh,
}: SurfabilityInput): Surfability {
  const t = SURFABLE_THRESHOLDS;

  if (waveHeightM < t.minWaveHeightM || windSpeedKmh >= t.strongWindKmh) {
    return "red";
  }

  const goodSize = waveHeightM >= t.goodWaveHeightM;
  const goodShape = wavePeriodS >= t.goodPeriodS;
  const calmWind = windSpeedKmh <= t.calmWindKmh;

  if (goodSize && goodShape && calmWind) {
    return "green";
  }

  if (goodSize || goodShape) {
    return calmWind ? "green" : "yellow";
  }

  return "yellow";
}
