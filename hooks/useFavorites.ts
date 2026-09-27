"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "swellsnap:favorites";

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // localStorage isn't available during SSR, so hydrate on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites(readFavorites());
  }, []);

  const persist = useCallback((next: string[]) => {
    setFavorites(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage unavailable (private mode, etc.) — favorites just won't persist
    }
  }, []);

  const toggleFavorite = useCallback(
    (spotId: string) => {
      persist(
        favorites.includes(spotId)
          ? favorites.filter((id) => id !== spotId)
          : [...favorites, spotId]
      );
    },
    [favorites, persist]
  );

  const isFavorite = useCallback(
    (spotId: string) => favorites.includes(spotId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
