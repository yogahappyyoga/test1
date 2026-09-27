"use client";

import { useEffect, useState } from "react";
import type { SpotConditions } from "@/lib/types";

const POLL_MS = 5 * 60 * 1000;

export function useSpotConditions(spotId: string) {
  const [data, setData] = useState<SpotConditions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Reset request state when spotId changes, before kicking off the fetch below.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const res = await fetch(`/api/conditions/${spotId}`);
        if (!res.ok) throw new Error("Failed to load conditions");
        const json = (await res.json()) as SpotConditions;
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [spotId]);

  return { data, error, loading };
}
