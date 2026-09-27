import type { Spot, HourConditions, SpotConditions } from "./types";
import { classifySurfability } from "./surfable";

const WEATHER_BASE = "https://api.open-meteo.com/v1/forecast";
const MARINE_BASE = "https://marine-api.open-meteo.com/v1/marine";
const FORECAST_DAYS = 3;

type WeatherResponse = {
  utc_offset_seconds: number;
  hourly: {
    time: string[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
  };
};

type MarineResponse = {
  hourly: {
    time: string[];
    wave_height: number[];
    wave_period: number[];
    wave_direction: number[];
    swell_wave_height: number[];
    swell_wave_period: number[];
    swell_wave_direction: number[];
  };
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Open-Meteo request failed (${res.status}): ${url} ${body}`
    );
  }
  return res.json() as Promise<T>;
}

function buildWeatherUrl(spot: Spot): string {
  const params = new URLSearchParams({
    latitude: String(spot.lat),
    longitude: String(spot.lon),
    hourly: "wind_speed_10m,wind_direction_10m",
    wind_speed_unit: "kmh",
    timezone: "auto",
    forecast_days: String(FORECAST_DAYS),
  });
  return `${WEATHER_BASE}?${params.toString()}`;
}

function buildMarineUrl(spot: Spot): string {
  const params = new URLSearchParams({
    latitude: String(spot.lat),
    longitude: String(spot.lon),
    hourly:
      "wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_period,swell_wave_direction",
    timezone: "auto",
    forecast_days: String(FORECAST_DAYS),
  });
  return `${MARINE_BASE}?${params.toString()}`;
}

/** Fetches and merges live wind + marine forecasts for a spot into one hourly series. */
export async function fetchSpotConditions(spot: Spot): Promise<SpotConditions> {
  const [weather, marine] = await Promise.all([
    fetchJson<WeatherResponse>(buildWeatherUrl(spot)),
    fetchJson<MarineResponse>(buildMarineUrl(spot)),
  ]);

  const times = weather.hourly.time;
  const hours: HourConditions[] = times.map((time, i) => {
    const windSpeedKmh = weather.hourly.wind_speed_10m[i];
    const windDirectionDeg = weather.hourly.wind_direction_10m[i];
    const waveHeightM = marine.hourly.wave_height[i] ?? 0;
    const wavePeriodS = marine.hourly.wave_period[i] ?? 0;
    const swellDirectionDeg = marine.hourly.swell_wave_direction[i] ?? 0;
    const swellHeightM = marine.hourly.swell_wave_height[i] ?? 0;
    const swellPeriodS = marine.hourly.swell_wave_period[i] ?? 0;

    return {
      time,
      windSpeedKmh,
      windDirectionDeg,
      waveHeightM,
      wavePeriodS,
      swellDirectionDeg,
      swellHeightM,
      swellPeriodS,
      surfability: classifySurfability({ waveHeightM, wavePeriodS, windSpeedKmh }),
    };
  });

  return {
    spot,
    fetchedAt: new Date().toISOString(),
    utcOffsetSeconds: weather.utc_offset_seconds,
    hours,
  };
}
