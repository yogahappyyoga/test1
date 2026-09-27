# swellsnap

A minimalist surf-conditions site. One question, answered fast: is it worth
paddling out, and when today? No login, no crowd cams, no clutter — just
wind and swell.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- [Open-Meteo](https://open-meteo.com) Marine + Weather APIs (free, keyless)
- No database — spots are a static JSON file, favorites live in the browser's
  `localStorage`

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. There's nothing to configure — no API keys, no
env vars, no database.

Other useful commands:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## How it works

- `data/spots.json` — the hardcoded list of surf spots (name, region, lat/lon).
- `app/api/conditions/[spotId]/route.ts` — server route that fetches wind
  (Open-Meteo weather API) and swell/wave (Open-Meteo marine API) for a spot,
  merges them into one hourly series, and classifies each hour as
  green/yellow/red. Responses are cached in-memory per spot for 20 minutes
  (`lib/cache.ts`) so we don't hammer Open-Meteo.
- `lib/surfable.ts` — the "is it worth it" heuristic. It's a handful of
  configurable thresholds (`SURFABLE_THRESHOLDS`) on wave height, period, and
  wind speed — tune those to change what counts as green/yellow/red.
- `components/NowView.tsx` — the glanceable "right now" view: wind
  speed/direction, wave height, period, swell direction.
- `components/HourlyTimeline.tsx` — horizontally-scrolling hour-by-hour
  timeline for today + the next 2 days, color-coded by the heuristic above.
- `components/SpotSearch.tsx` + `hooks/useFavorites.ts` — spot search and
  favorites, entirely client-side via `localStorage`.

## Adding a new spot

Add an entry to `data/spots.json`:

```json
{ "id": "some-unique-slug", "name": "Spot Name", "region": "City, ST", "lat": 12.34, "lon": -56.78 }
```

That's it — it'll show up in search immediately, no other code changes
needed. `id` just needs to be unique and URL-safe (it's used directly in the
`/api/conditions/[spotId]` route).

## A note on this environment

This project was built in a sandboxed environment whose network policy
blocks outbound requests to `open-meteo.com`, so live data fetching couldn't
be tested end-to-end here. The Open-Meteo request/response handling in
`lib/openMeteo.ts` was instead verified against fixture data matching
Open-Meteo's documented API schema (parsing, merging, unit conversion, and
the surfability heuristic all check out). It will fetch normally on Vercel
or any machine with unrestricted internet access — there's no code path
here that depends on this sandbox.
