/**
 * Open-Meteo's hourly "time" strings are spot-local wall-clock values
 * with no offset (e.g. "2026-09-27T14:00"). We only ever need the
 * calendar/hour parts for display, so parse them as plain components
 * rather than through Date/timezone conversion.
 */
function parseParts(iso: string) {
  const [datePart, timePart] = iso.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour] = timePart.split(":").map(Number);
  return { year, month, day, hour };
}

export function hourLabel(iso: string): string {
  const { hour } = parseParts(iso);
  if (hour === 0) return "12a";
  if (hour === 12) return "12p";
  return hour < 12 ? `${hour}a` : `${hour - 12}p`;
}

export function datePart(iso: string): string {
  return iso.split("T")[0];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function dayLabel(iso: string, todayDatePart: string): string {
  const d = datePart(iso);
  if (d === todayDatePart) return "Today";

  const { year, month, day } = parseParts(iso);
  const { year: ty, month: tm, day: td } = parseParts(`${todayDatePart}T00:00`);
  const tomorrow = new Date(ty, tm - 1, td + 1);
  const thisDate = new Date(year, month - 1, day);

  if (thisDate.getTime() === tomorrow.getTime()) return "Tomorrow";
  return WEEKDAYS[thisDate.getDay()];
}
