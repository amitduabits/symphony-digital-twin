# Operator runbook

## Run locally

```
cd 09_Industry_Demo/symphony-industry
npm install
npm test
npm run dev
```

Open http://localhost:5188/#/app and switch city.

## Add a city (L16)

1. Add a pack in `src/cities/packs.ts` (id, tz, bbox, junctions, adapters).
2. Append it to `CITY_PACKS`.
3. Reuse osm + google/tomtom or a city open-data adapter.
4. Cameras only if a catalogue URL exists.
5. Tests: pack loads, timezone correct, bbox contains junctions.

## Keys

- `.env` local only. `VITE_GOOGLE_MAPS_API_KEY`, `VITE_TOMTOM_API_KEY` are never required for Observe.
- GitHub Pages stays Observe: OSM seed geometry, Open-Meteo, public city APIs when CORS allows.
- Actuate is blocked in the UI unless a licensed controller adapter is added later.

## Cameras

Set `adapters.cameras` to `catalogue` and supply a GET catalogue. Browser wall uses HLS or WHEP. RTSP is TCP-only on the capture side and never serialised to the page.
