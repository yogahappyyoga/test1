import type { HourConditions } from "@/lib/types";
import type { WindSpeedUnit } from "@/lib/units";
import { convertWindSpeed, metersToFeet } from "@/lib/units";
import { dayLabel, datePart, hourLabel } from "@/lib/formatHour";
import { CompassArrow } from "./CompassArrow";

const SURFABILITY_STYLES: Record<HourConditions["surfability"], string> = {
  green: "bg-emerald-50 border-emerald-200",
  yellow: "bg-amber-50 border-amber-200",
  red: "bg-rose-50 border-rose-200",
};

const SURFABILITY_DOT: Record<HourConditions["surfability"], string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-rose-500",
};

export function HourlyTimeline({
  hours,
  unit,
}: {
  hours: HourConditions[];
  unit: WindSpeedUnit;
}) {
  if (hours.length === 0) return null;
  const todayDatePart = datePart(hours[0].time);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
      {hours.map((h, i) => {
        const isNewDay = i === 0 || datePart(h.time) !== datePart(hours[i - 1].time);
        const windSpeed = Math.round(convertWindSpeed(h.windSpeedKmh, unit));
        const waveHeightFt = metersToFeet(h.waveHeightM);

        return (
          <div
            key={h.time}
            className={`flex w-[4.5rem] shrink-0 flex-col items-center gap-1 rounded-xl border p-2 ${SURFABILITY_STYLES[h.surfability]}`}
          >
            <span className="h-3 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
              {isNewDay ? dayLabel(h.time, todayDatePart) : ""}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-neutral-700">
              <span className={`h-1.5 w-1.5 rounded-full ${SURFABILITY_DOT[h.surfability]}`} />
              {hourLabel(h.time)}
            </span>
            <CompassArrow degrees={h.windDirectionDeg} size={18} showLabel={false} />
            <span className="text-xs font-semibold tabular-nums">
              {windSpeed}
              <span className="text-[10px] font-normal text-neutral-400">{unit}</span>
            </span>
            <div className="mt-0.5 border-t border-neutral-200 w-full" />
            <span className="text-xs font-semibold tabular-nums">
              {waveHeightFt.toFixed(1)}
              <span className="text-[10px] font-normal text-neutral-400">ft</span>
            </span>
            <span className="text-[10px] text-neutral-400">
              {Math.round(h.wavePeriodS)}s
            </span>
          </div>
        );
      })}
    </div>
  );
}
