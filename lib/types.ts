export type Spot = {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
};

export type Surfability = "green" | "yellow" | "red";

export type HourConditions = {
  /** ISO timestamp, local to the spot's timezone */
  time: string;
  windSpeedKmh: number;
  windDirectionDeg: number;
  waveHeightM: number;
  wavePeriodS: number;
  swellDirectionDeg: number;
  swellHeightM: number;
  swellPeriodS: number;
  surfability: Surfability;
};

export type SpotConditions = {
  spot: Spot;
  fetchedAt: string;
  /** Seconds offset from UTC for the spot's local timezone, per Open-Meteo. */
  utcOffsetSeconds: number;
  hours: HourConditions[];
};
