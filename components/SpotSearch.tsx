"use client";

import { useMemo, useRef, useState } from "react";
import type { Spot } from "@/lib/types";
import { searchSpots } from "@/lib/spots";
import { FavoriteButton } from "./FavoriteButton";

export function SpotSearch({
  favorites,
  isFavorite,
  onToggleFavorite,
  onSelect,
}: {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (query.trim()) return searchSpots(query);
    const favSpots = searchSpots("").filter((s) => favorites.includes(s.id));
    const rest = searchSpots("").filter((s) => !favorites.includes(s.id));
    return [...favSpots, ...rest];
  }, [query, favorites]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        inputMode="search"
        placeholder="Search spots…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm outline-none focus:border-neutral-500"
      />
      {open && (
        <ul className="absolute inset-x-0 top-full z-10 mt-1 max-h-80 overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-lg">
          {results.length === 0 && (
            <li className="px-4 py-3 text-sm text-neutral-400">No spots found</li>
          )}
          {results.map((s: Spot) => (
            <li
              key={s.id}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(s.id);
                setQuery("");
                setOpen(false);
                inputRef.current?.blur();
              }}
              className="flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-neutral-50 active:bg-neutral-100"
            >
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-neutral-400">{s.region}</p>
              </div>
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <FavoriteButton
                  active={isFavorite(s.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite(s.id);
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
