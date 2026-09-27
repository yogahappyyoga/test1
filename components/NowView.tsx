"use client";

import { useSpotConditions } from "@/hooks/useSpotConditions";
import { useWindUnit } from "@/hooks/useWindUnit";
import { convertWindSpeed, metersToFeet } from "@/lib/units";
import { CompassArrow } from "./CompassArrow";
import { UnitToggle } from "./UnitToggle";
import { HourlyTimeline } from "./HourlyTimeline";
import { FavoriteButton } from "./FavoriteButton";
import type { Spot } from "@/lib/types";

export function NowView({
  spot,
  isFavorite,
  onToggleFavorite,
}: {
  spot: Spot;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const { data, error, loading } = useSpotConditions(spot.id);
  const { unit, toggle } = useWindUnit();

  if (loading && !data) {
    return (
      <div className="flex h-64 items-center justify-center text-neutral-400">
        Loading…
      </div>
    );
  }

  if (error || !data || data.hours.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-center text-neutral-500">
        Couldn&apos;t load conditions for {spot.name}. Pull to refresh.
      </div>
    );
  }

  const now = data.hours[0];
  const windSpeed = Math.round(convertWindSpeed(now.windSpeedKmh, unit));
  const waveHeightFt = metersToFeet(now.waveHeightM);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <div>
            <h1 className="text-2xl font-bold leading-tight">{spot.name}</h1>
            <p className="text-sm text-neutral-500">{spot.region}</p>
          </div>
          <FavoriteButton active={isFavorite} onClick={onToggleFavorite} />
        </div>
        <UnitToggle unit={unit} onToggle={toggle} />
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-neutral-50 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Wind
          </p>
          <p className="text-5xl font-bold tabular-nums">
            {windSpeed}
            <span className="ml-1 text-xl font-medium text-neutral-400">
              {unit}
            </span>
          </p>
        </div>
        <CompassArrow degrees={now.windDirectionDeg} size={56} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-neutral-50 p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Wave height
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums">
            {waveHeightFt.toFixed(1)}
            <span className="ml-0.5 text-base font-medium text-neutral-400">
              ft
            </span>
          </p>
        </div>
        <div className="rounded-2xl bg-neutral-50 p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Period
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums">
            {Math.round(now.wavePeriodS)}
            <span className="ml-0.5 text-base font-medium text-neutral-400">
              s
            </span>
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-neutral-50 p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Swell
          </p>
          <CompassArrow degrees={now.swellDirectionDeg} size={40} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
          Next 3 days
        </p>
        <HourlyTimeline hours={data.hours} unit={unit} />
      </div>
    </div>
  );
}
