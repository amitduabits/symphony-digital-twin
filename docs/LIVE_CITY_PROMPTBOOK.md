# SYMPHONY live-city promptbook

Build a **live working traffic digital twin** that an operator can open for **any city they have access to** — Bengaluru first, then London, New York, Hong Kong, or the next city that hands over keys.

This file is the operating manual. Copy **one phase prompt per agent session**. Do not skip L00.

The industry site at https://amitduabits.github.io/symphony-digital-twin/ is **not** this system yet. It is a six-junction Outer Ring Road **simulation**. A partner in London or New York cannot select their city, cannot see live speeds, and cannot attach cameras. That is the gap this book closes.

Patent envelope: Indian application **202611024014**, amended claims 1–10 (FER response 31 August 2026). The live product must implement those claims on **real observations**, not synthetic queues. Physical write-back to signal controllers is a licensed pilot, not a public demo.

---

## 0. What “live working” means

A city is **live** only when all six are true:

| # | Bar | Fail if |
|---|---|---|
| 1 | Operator picks a city from a list. The map, junctions, timezone, and agencies change. | Bangalore ORR is hard-coded. |
| 2 | Speeds, travel times, or occupancies on the map come from a **network call in the last 120 seconds**, with source name, timestamp, and confidence on each junction. | Numbers are `Math.random` or a scenario slider. |
| 3 | If a source is down, the twin **keeps running** on remaining sources and fail-safe local logic (claims 1 and 7). | The page blanks or freezes. |
| 4 | Forecasts (5 / 15 / 30 min) are computed from the fused live series and shown to **junction, corridor, and city** agents (claim 1). | Forecasts ignore live history. |
| 5 | Optional cameras, if the city grants them, are listed from a **catalogue API**, not a hard-coded URL. Preview uses HLS or WHEP. Inference, if any, uses RTSP over TCP and PTS, never arrival time. | wget of a stream file; FPS used as time. |
| 6 | A second city can be added by a **city pack** (YAML + adapters) without rewriting the command centre. | New city requires a fork. |

Until 1–4 pass for at least two cities (Bengaluru + one overseas), do not tell industry this is a global live system.

### Three operating modes (label them in the UI)

| Mode | Data | Control output | Who may run it |
|---|---|---|---|
| **Observe** | Live APIs + OSM | Advisories only | Public industry site |
| **Recommend** | Live APIs + OSM + agents | Phase/offset **recommendations**, logged | Partner with API keys |
| **Actuate** | Live APIs + TraCI or field controller | Physical or SUMO signal commands | Licensed pilot only |

The GitHub Pages site stays in **Observe** until keys exist. Never silently pretend Actuate.

---

## 1. Product to build

Replace the single-corridor simulator with:

```
City pack (YAML)
    → OSM geometry (always)
    → Live adapters (whatever keys that city has)
    → Fusion engine (claim 3)
    → Rolling window store (claim 4)
    → T-GNN / spatiotemporal predictor (claim 5)
    → Hierarchical agents (claims 1, 6–9)
    → Fail-safe (claim 7)
    → Predicted vs observed (claim 10)
    → Command centre: city switcher + map + agents + cameras
```

### Command centre (must exist)

- City switcher: Bengaluru, London, New York, Hong Kong, **+ Add city pack**
- Live clock in **that city’s timezone**
- Source health: Google, TomTom, HERE, city open data, cameras — each green/amber/red, age in seconds
- Map of **this city’s** signalised corridor(s), not Silk Board–Marathahalli unless Bengaluru is selected
- Agent feed at three timescales
- Camera wall (hidden if the city pack has no catalogue)
- Mode badge: Observe / Recommend / Actuate

### Website (must say the truth)

- Home: “Live twin for any city you can grant access to. Bengaluru ORR is the reference deployment.”
- Technology: city-pack architecture + claims 1–10
- Cities: one card per pack (data sources, agencies, live/demo)
- IP: patent 202611024014, demo ≠ licence to actuate
- App: the live command centre

---

## 2. City pack (the contract)

One folder per city: `cities/<id>/pack.yaml`. The app must not import Bangalore constants in the live path.

```yaml
id: bengaluru
name: Bengaluru
country: IN
tz: Asia/Kolkata
bbox: [77.45, 12.80, 77.85, 13.15]   # west, south, east, north
center: [12.935, 77.66]
agencies: ["Bengaluru Traffic Police", "Greater Bengaluru Authority"]
corridors:
  - id: orr_silk_marathahalli
    name: Outer Ring Road Silk Board–Marathahalli
    junctions: [silk_board, hsr_layout, agara, bellandur, kadubeesanahalli, marathahalli]
adapters:
  geometry: osm
  speeds: [google, tomtom]          # use what keys exist
  events: []                        # optional: 511, TfL disruptions
  cameras: none                     # or: catalogue
  weather: open_meteo
fallback: shadow                    # if all speed adapters fail
mode_default: observe
```

Rules:

- Junction coordinates come from OSM or the pack, never from `data.ts` alone.
- Adapter list is ordered. Fusion uses whoever answers.
- `cameras: none` is valid. A city is still live without CCTV.
- Adding London must not touch Bengaluru code except the registry index.

---

## 3. Live data sources by city

Use **whatever the operator can actually get**. Do not require all rows.

### Always (no city key)

| Adapter | What | Notes |
|---|---|---|
| OpenStreetMap / Overpass | Roads, signalised nodes, names | Geometry only. Not live speed. |
| Open-Meteo | Rain, visibility | Used as a scenario modifier, not as speed. |

### Speed / travel time (pick ≥1 live)

| Adapter | Typical cities | Auth |
|---|---|---|
| Google Maps Roads / Distance Matrix | Global | API key, billed |
| TomTom Flow | Global | API key |
| HERE Traffic | Global | API key |
| Mapbox Directions traffic | Global | Token |
| City open data | See below | Often keyless or city token |

### City open feeds (first four target cities)

| City | Geometry | Live traffic | Cameras / extra |
|---|---|---|---|
| **Bengaluru** | OSM; ORR pack | Google + TomTom (research stack). Optional ITMS/BTP if granted. | Only if BTP/Safe City grants a catalogue. |
| **London** | OSM; TfL network | [TfL Unified API](https://api.tfl.gov.uk/) `Road/all/Disruption`, `Traffic/Speed`, `JourneyTimes`. Optional Google/TomTom. | TfL JamCams (`Place/Mode/jamcams`) as HLS/JPEG catalogue if permitted. |
| **New York** | OSM; NYC boroughs | [NYC 511 / DOT](https://511ny.org/) traffic, NYC Open Data real-time traffic speeds. Optional Google/TomTom. | NYC DOT traffic cameras as JPEG/HLS catalogue if permitted. |
| **Hong Kong** | OSM; HK island / KLN / NT | [data.gov.hk](https://data.gov.hk/) traffic speed / journey time, TD APIs. Optional Google/TomTom. | TD CCTV snapshots if the open licence covers the use. |

If a city gives a **Sentinel-style** catalogue (`GET /api/ingest` → RTSP + WHEP + HLS), use the camera adapter in L10. Do not hard-code `/stream/<id>`.

### Camera ingest laws (when cameras exist)

Copy these into every capture client:

1. Force RTSP over **TCP**. HLS if 8554 is blocked. WHEP for browser preview only.
2. Start from the **catalogue**, never a guessed URL.
3. Timing from **PTS** (`CAP_PROP_POS_MSEC` / buffer PTS / RTP). Never arrival time. Never declared FPS for speed or dwell.
4. Tolerate uneven frame gaps. Do not treat a gap as disconnect until backoff expires.
5. Reconnect with exponential backoff 2 s → 30 s.
6. Decoder warnings at join are logs, not fatal.
7. Mixed H.264/H.265 and mixed resolutions: size buffers from catalogue properties.
8. Scene loop / hard cut: reset trackers; do not assume infinite continuity.
9. Consume only. Do not publish to the gateway.
10. Open only cameras you are processing. Cap concurrent captures.

---

## 4. How to use this book

- One phase per session. Paste the prompt in the fence.
- Work in `09_Industry_Demo/symphony-industry` unless the prompt names the research repo.
- After each phase: tests named in that phase, then commit and push.
- Do not claim “live” unless a network trace in the session shows a 2xx from a city adapter in the last two minutes.
- Do not commit API keys. `.env` stays local. GitHub Pages Observe mode uses public OSM + optional public city APIs only.
- Do not add FER PDFs or claim-set Word files to the public repo.

Commit style: `L0n: <what an operator in London would notice>`

---

## 5. Phase prompts (copy one block)

### L00 — Honest gap (do this first)

```
You are extending SYMPHONY from a Bengaluru ORR simulation to a live multi-city twin.

Current public app: GitHub Pages, HashRouter, six hard-coded ORR junctions, synthetic
queues, no city switcher, no live HTTP to Google/TomTom/TfL/511.

Write docs/LIVE_GAP.md with a table: feature | today | live-city bar | phase that closes it.
Do not change product copy to say "live global" until L06+L07 pass.
Commit LIVE_GAP.md only.
```

### L01 — City pack schema and registry

```
Add src/cities/schema.ts and src/cities/registry.ts.

- CityPack type matching pack.yaml in this promptbook §2.
- Load packs from src/cities/packs/*.yaml (or .ts if YAML is heavy).
- Registry: listCities(), getCity(id), defaultCity() = bengaluru.
- Ship four packs with honest adapter lists:
  bengaluru (orr_silk_marathahalli, speeds google+tomtom, cameras none)
  london (central + inner ring placeholder corridor, speeds tfl+google, cameras jamcam optional)
  newyork (Manhattan / FDR or Broadway corridor placeholder, speeds nyc511+google, cameras optional)
  hongkong (NKIL / HK Island corridor placeholder, speeds datagovhk+google, cameras optional)
- Until OSM ingest exists, packs MAY include a starter junction list. Mark it
  source: "seed" in metadata so L02 can replace it.

Tests: four cities in the registry; getCity("london").tz === "Europe/London";
unknown id throws. Commit and push.
```

### L02 — OSM geometry ingest

```
Add adapter src/live/osm.ts.

Input: city bbox + optional corridor names.
Output: signalised nodes and way polylines from Overpass (highway=traffic_signals
and the named corridor). Cache GeoJSON under public/cities/<id>/geometry.json
so GitHub Pages can run without Overpass at request time, and refresh in Recommend mode.

Replace hard-coded JUNCTIONS in the live path with pack + geometry.
Keep the old simulator behind a "Shadow / paper demo" toggle so the patent demo
does not disappear.

Tests: parse a fixture Overpass JSON for Bengaluru bbox; at least 6 signal nodes;
coordinates inside bbox. Commit and push.
```

### L03 — Live speed adapters

```
Add src/live/adapters/ with a common interface:

  SpeedReading { junctionId, speedKmh, congestion01, observedAtIso, source,
                 freshnessS, raw? }

Implement:
- google.ts  (Distance Matrix or Roads; skip if no GOOGLE_MAPS_API_KEY)
- tomtom.ts  (Flow; skip if no TOMTOM_API_KEY)
- tfl.ts     (no key or app_id/app_key from env)
- nyc511.ts
- hkgov.ts
- openmeteo.ts (weather only)

Each adapter: timeout 4s, retry once, never throw past the fusion layer.
Return [] on missing key so Observe mode still boots.

Tests: mock fetch. google adapter maps a fixture to SpeedReading.
Missing key → []. Commit and push.
```

### L04 — Fusion, rolling window, health

```
Port claim 3–4 into src/live/fusion.ts (do not delete the demo simulator).

- Normalise units to km/h, WGS84, UTC.
- Confidence weight = 0.5*freshness + 0.3*historicalAccuracy + 0.2*consistency.
- Anomaly: jump > 15 km/h vs median → down-weight 0.1 unless all sources agree.
- Rolling window of 8 snapshots per junction.
- Source health panel data: lastOkAt, lastError, ageS.

Tests: two sources 25 and 22 km/h → fused in (22,25); one 40 vs two ~23 → 40 down-weighted;
window length never > 8. Commit and push.
```

### L05 — City switcher UI

```
Command centre top bar: city <select> from registry.
On change: reload geometry, clear window, reset agents, set timezone clock.
Map fits the city bbox. Junction cards come from the pack, not data.ts.
Website /cities page: four cards, each listing adapters and "Live when keys present /
Seed geometry until L02 refresh".

Tests: render with london selected → Europe/London or London in the chrome;
Bengaluru still shows Silk Board. Commit, push, Pages.
```

### L06 — Bengaluru live Observe

```
Wire google+tomtom for the ORR pack when keys exist in .env.
Without keys, show a banner: "Observe mode — add GOOGLE_MAPS_API_KEY and
TOMTOM_API_KEY for live Bengaluru speeds. Geometry is OSM."
Poll ≤ every 30s (the patented cycle). Display source age on each junction.
Do not call APIs from GitHub Pages if keys cannot be kept server-side.

If keys cannot go to Pages, add a tiny backend (Cloud Function / FastAPI)
that holds keys and exposes GET /api/live/:city. The browser never sees keys.

Prove live: log one real 2xx in the session. Screenshot source health green.
Tests: with mocked 2xx, UI shows age < 120s. Commit and push.
```

### L07 — London live Observe

```
Implement tfl.ts against real TfL endpoints using a fixture first, then live.
Corridor: pick one inner corridor with ≥4 signalised nodes from OSM (e.g. A501 /
Marylebone–Euston or a documented TfL corridor). Do not fake TfL speeds with
the ORR generator.

City card: Transport for London, Unified API, JamCam optional.
Tests: timezone Europe/London; adapter parses disruption fixture;
fusion accepts tfl as a source. Commit and push.
```

### L08 — New York live Observe

```
nyc511 / NYC Open Data traffic speeds for one Manhattan or outer-borough
corridor with ≥4 signals. Timezone America/New_York. Same fusion path.
Tests: pack loads; adapter fixture; no Bengaluru names on the NY map.
Commit and push.
```

### L09 — Hong Kong live Observe

```
data.gov.hk / TD journey time or speed for one NT or HK Island corridor.
Timezone Asia/Hong_Kong. Same fusion path.
Tests: pack loads; adapter fixture; bilingual name field allowed.
Commit and push.
```

### L10 — Optional camera catalogue (any city)

```
Generic camera adapter. Input: catalogue URL (SENTINEL-style GET /api/ingest
or a city JPEG/HLS list). Output: {id, location, codec, live, rtsp, whep, hls}.

Browser wall: HLS or WHEP only. Never put RTSP in page JSON.
If RTSP is used for ANPR/sampling, OpenCV/FFmpeg must set rtsp_transport=tcp
BEFORE import; PTS from CAP_PROP_POS_MSEC; backoff 2–30s; scene-cut on PTS jump.

Do not wget /stream/<id>. Do not publish to the gateway. Cap open captures at 4.

If the operator has no cameras, skip UI (no empty broken tiles).
Tests: parse catalogue fixture; RTSP absent from presentational JSON;
tcp flag in capture source. Commit and push.
```

### L11 — Predict and hierarchical agents on live series

```
Feed the 8-snapshot window + 18-d features into the predictor.
Show 5/15/30 min on the T-GNN pane from live history, not from the old
scenario generator.

Agents:
- Junction: phase/duration suggestion, decisionMs ≤ 200, uses fused + forecast
- Corridor: offsets from predicted speeds (claim 8)
- Network: incident / VIP / long-term pattern directives (claim 9)
Predictions supplied to all three (claim 1).
Mode Observe: suggestions only, labelled "advisory".
Mode Recommend: same, persisted.
Mode Actuate: blocked unless CITY_ACTUATE=1 and a controller adapter exists.

Tests: after 8 mocked live snapshots, m5/m15/m30 finite; junction decisionMs ≤ 200.
Commit and push.
```

### L12 — Fail-safe and partial data (claims 1, 7)

```
If all speed adapters fail: keep last window, mark sources red, junction agents
switch to fail-safe local (stored timing). Banner: "Running on local logic".
If one adapter fails: fuse the rest.
Comms-outage city scenario remains for the paper demo toggle.

Tests: both adapters throw → failSafe true, UI still renders map;
one adapter ok → fusedSpeed finite. Commit and push.
```

### L13 — Predicted vs observed (claim 10)

```
Store forecast at t and compare to fused speed at t+5min.
Pane: residual km/h per junction. Periodically (config) flag retraining due.
Tests: inject forecast 30 and later observation 28 → residual ~2.
Commit and push.
```

### L14 — Tests and live smoke

```
Automated:
- Registry: 4 cities
- Each adapter: fixture parse + missing-key empty
- Fusion weights sum ≈ 1, window ≤ 8, anomaly down-weight
- UI: city switch, no ORR names on London
- Integrator laws if cameras: TCP, no CAP_PROP_FPS in live path, no publish
- decisionMs ≤ 200, fail-safe on total outage

Live smoke (manual, keys required):
- Bengaluru: one real Google or TomTom 2xx, age < 120s
- London: one real TfL 2xx
- New York: one real 511/open-data 2xx
- Hong Kong: one real data.gov.hk 2xx

Do not mark a city Live on the website until its smoke row is dated in
docs/LIVE_SMOKE.md. Commit and push.
```

### L15 — Deploy and operator runbook

```
- GitHub Pages: Observe mode, OSM + cached geometry, public city APIs only.
- Recommend mode: small backend with keys, HTTPS, no keys in the browser.
- docs/OPERATOR.md: how to add a city pack; how to set keys; how to attach
  a camera catalogue; how to stay in Observe.
- Website copy: remove any sentence that implies every city is live today.
  Bengaluru live when L06 smoke dated; others "pack ready / live when keys".
- Push main and publish Pages.

Prove: live URL city switcher visible; Bengaluru health panel honest.
```

### L16 — Next city (generic)

```
Operator wants city X (not in the first four).

1. Create cities/packs/<id>.yaml: bbox, tz, agencies, one corridor.
2. Reuse osm adapter. Add a speed adapter only if X has a documented API;
   otherwise google+tomtom if keys allow that geography.
3. Cameras only if a catalogue URL exists.
4. Tests: pack loads, bbox contains junctions, timezone correct.
5. Smoke: one real 2xx or an explicit "geometry-only" badge.
6. Do not claim Actuate.

This phase is the template forever. Do not special-case a fifth city in
the command centre source.
```

---

## 6. Definition of done

### Paper demo (already shipped)

- Six ORR junctions, synthetic scenarios, claims 1–10 mapped in copy, GitHub Pages.

### Live working system (this book)

- [ ] City switcher with ≥4 packs
- [ ] OSM geometry per pack (cached)
- [ ] At least one live speed source on Bengaluru with age < 120 s
- [ ] At least one overseas city with a real 2xx smoke dated
- [ ] Fusion + 8-snapshot window on live readings
- [ ] Agents on live series; 200 ms budget; fail-safe
- [ ] Camera wall optional, catalogue-driven, no RTSP in the browser
- [ ] Observe / Recommend / Actuate labelled; Actuate off by default
- [ ] Website does not say “live global” until two cities have dated smoke
- [ ] OPERATOR.md and LIVE_SMOKE.md on main
- [ ] Keys never in git

### First city a partner can use tomorrow

Bengaluru Observe + London Observe is enough to show “any city we can get access to.” New York and Hong Kong packs can be geometry-first the same week.

---

## 7. What not to do

- Do not stream Gujarat Sentinel cameras into the SYMPHONY industry site unless that partner engagement is explicit. Camera ingest is a **generic adapter**.
- Do not put Google/TomTom keys in GitHub Pages.
- Do not write to field signal controllers from the public app.
- Do not keep `data.ts` six-junction constants as the only source of truth after L02.
- Do not use declared FPS or wall-clock arrival for any metric that looks like speed, delay, or dwell.
- Do not wget a looping VOD and call it live.

---

## 8. Session log

| Phase | Date | Result |
|---|---|---|
| L00–L16 | 2026-09-01 | Promptbook written. Product still simulation. Next: execute L00 then L01. |
