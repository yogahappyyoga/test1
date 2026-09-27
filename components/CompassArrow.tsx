import { degToCompassLabel } from "@/lib/units";

/**
 * Meteorological "from" direction: an arrow pointing the way the
 * wind/swell is travelling *toward* (i.e. rotated 180° from where it's from),
 * which is the intuitive way surfers read a direction arrow.
 */
export function CompassArrow({
  degrees,
  size = 48,
  showLabel = true,
  className = "",
}: {
  degrees: number;
  size?: number;
  showLabel?: boolean;
  className?: string;
}) {
  const rotation = (degrees + 180) % 360;
  return (
    <div
      className={`inline-flex flex-col items-center gap-0.5 ${className}`}
      aria-label={`${Math.round(degrees)} degrees, ${degToCompassLabel(degrees)}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{ transform: `rotate(${rotation}deg)` }}
        className="text-neutral-900"
      >
        <path
          d="M12 2 L18 16 L12 12.5 L6 16 Z"
          fill="currentColor"
        />
      </svg>
      {showLabel && (
        <span className="text-xs font-semibold tracking-wide text-neutral-500">
          {degToCompassLabel(degrees)}
        </span>
      )}
    </div>
  );
}
