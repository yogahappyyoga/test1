"use client";

import { useEffect, useState } from "react";
import { spots, getSpotById } from "@/lib/spots";
import { useFavorites } from "@/hooks/useFavorites";
import { NowView } from "./NowView";
import { SpotSearch } from "./SpotSearch";

const LAST_SPOT_KEY = "swellsnap:last-spot";

export function Home() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [spotId, setSpotId] = useState(spots[0].id);

  useEffect(() => {
    const last = window.localStorage.getItem(LAST_SPOT_KEY);
    // localStorage isn't available during SSR, so hydrate on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (last && getSpotById(last)) setSpotId(last);
  }, []);

  const selectSpot = (id: string) => {
    setSpotId(id);
    try {
      window.localStorage.setItem(LAST_SPOT_KEY, id);
    } catch {
      // ignore
    }
  };

  const spot = getSpotById(spotId) ?? spots[0];

  return (
    <main className="mx-auto max-w-md space-y-4 p-4">
      <SpotSearch
        favorites={favorites}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        onSelect={selectSpot}
      />

      <NowView
        spot={spot}
        isFavorite={isFavorite(spot.id)}
        onToggleFavorite={() => toggleFavorite(spot.id)}
      />
    </main>
  );
}
