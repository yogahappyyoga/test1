import type { WindSpeedUnit } from "@/lib/units";

export function UnitToggle({
  unit,
  onToggle,
}: {
  unit: WindSpeedUnit;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="rounded-full border border-neutral-300 px-3 py-1 text-sm font-medium text-neutral-600 active:bg-neutral-100"
      aria-label="Toggle wind speed unit"
    >
      {unit === "mph" ? "mph" : "kn"}
    </button>
  );
}
