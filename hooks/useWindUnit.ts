"use client";

import { useEffect, useState } from "react";
import type { WindSpeedUnit } from "@/lib/units";

const STORAGE_KEY = "swellsnap:wind-unit";

export function useWindUnit() {
  const [unit, setUnit] = useState<WindSpeedUnit>("mph");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // localStorage isn't available during SSR, so hydrate on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "mph" || stored === "kn") setUnit(stored);
  }, []);

  const toggle = () => {
    const next: WindSpeedUnit = unit === "mph" ? "kn" : "mph";
    setUnit(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  return { unit, toggle };
}
