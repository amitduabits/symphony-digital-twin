# SYMPHONY industry promptbook

Operating manual for making the Bengaluru traffic digital twin **exceptionally good**, **fully tested**, **pushed to GitHub in small commits**, and **hosted from GitHub** so industry can open it without installing anything.

Use this file in three ways:

1. As a human checklist before a partner meeting.
2. As copy-paste prompts for an agent (one phase per session).
3. As the definition of done for the public industry site.

Research code stays in [amitduabits/bangalore-traffic-digital-twin](https://github.com/amitduabits/bangalore-traffic-digital-twin).  
This product is the **industry demonstration**: website + command centre, no API keys, no SUMO.

**Do not put in the public industry repo:** FER PDFs, amended claims, attorney correspondence, GPA drafts, MSME certificates, or unpublished claim charts.

---

## 0. What “exceptionally great” means

A partner from Bengaluru Traffic Police, Greater Bengaluru Authority, an ITS integrator, or a campus industry cell should be able to:

| Bar | Pass condition |
|---|---|
| Open in 10 seconds | Public HTTPS URL. No login. No `npm`. |
| Understand in 2 minutes | Home page states what it is, where it runs (ORR, six junctions), who owns the IP, and what to click next. |
| Operate in 5 minutes | Command centre runs live. Changing scenario changes the corridor. Agents speak in reasons, not slogans. |
| Trust the numbers | Results page separates **published paper/patent figures** from **reproducible harness figures**. No silent mixing of 352% and 10%. |
| Believe the twin | A/B view shows SYMPHONY and fixed-time on the same demand. Queues, phases, fusion weights, and forecasts all move. |
| Leave with a next step | Partnership page drafts mail to Amit Dua. Patent page states 202611024014 and FER-response status without dumping claims. |
| Survive a sceptical engineer | Tests cover every scenario, fusion invariants, cycle timing, and every website route. CI is green on `main`. |

If any row fails, the build is not ready to share.

---

## 1. Product map (do not skip)

### Website routes (`/#/…`)

| Route | Job | Must contain |
|---|---|---|
| `/` | Industry landing | ORR, six junctions, 65% delay / 17% speed, patent number, launch CTA |
| `/technology` | Architecture | 30 s cycle, 3-level hierarchy, T-GNN 18-d vector, patent figures 1–4, junction table |
| `/results` | Evidence | Paper metrics **and** quick-test table, caption that explains the 352% vs 10.2% difference |
| `/ip` | Patent hygiene | 202611024014, applicant, inventor, FER response submitted, demo ≠ licence |
| `/partnership` | Call to action | Police / integrator / campus tracks, working mailto form |
| `/app` | Working product | Full command centre |

### Command centre panes

| Pane | Job | Must prove |
|---|---|---|
| Overview | Situation picture | Cycle stages, map, six cards, strategy, alerts, agent feed |
| Network map | Geography | Dark ORR path, coloured junctions, east/west vehicles |
| Agents | Hierarchy | Strategist / coordinator / six junction chips + log |
| T-GNN | Prediction | Now / 15 min / 30 min bars, 18 feature chips |
| Fusion | Multi-source | Google, TomTom, fused, weights, anomaly flag |
| Twin A/B | Control proof | SYMPHONY vs fixed-time KPIs and speed traces |
| Evaluation | Frozen evidence | Published + harness numbers |

### Scenarios that must each be a first-class case

`morning_rush`, `evening_rush`, `midday`, `incident`, `vip`, `rain`, `weekend`

---

## 2. How to use this promptbook with an agent

Rules for every phase:

- Work only in `09_Industry_Demo/symphony-industry` unless the prompt says otherwise.
- Do not commit `node_modules`, FER files, or the `_upstream` clone.
- After each phase: run the tests named in that phase, then **commit and push**.
- Do not claim “tested” unless the command output is in the session.
- Do not claim “deployed” unless the live URL returns 200 and the app hash route renders SYMPHONY.

Commit message style:

```
<phase>: <what a partner would notice>
```

Examples: `test: cover all seven corridor scenarios`, `pages: enable public industry URL`.

---

## 3. Phase prompts (copy one block at a time)

### Phase A — Repo hygiene and IP fence

```
You are working on SYMPHONY, the Bengaluru ORR traffic digital twin industry demo
in 09_Industry_Demo/symphony-industry.

Goal: make the public GitHub repo safe to share with industry.

Do:
1. Confirm the tree contains only the website/app, tests, promptbook, and licence.
2. Confirm .gitignore drops node_modules, dist, and OS junk.
3. Confirm README states: demo, not a live police deployment; patent 202611024014;
   research repo is separate; FER/claims stay private.
4. Add a short NOTICE if missing: no unpublished claim charts in this repo.
5. Commit and push to origin main.

Do not add patent PDFs, attorney Word files, or the Streamlit research tree.
```

### Phase B — Website excellence

```
Improve the SYMPHONY industry website until a non-technical partner can brief
their boss from the pages alone.

Routes: /#/  /#/technology  /#/results  /#/ip  /#/partnership

Checklist:
- Home hero: what / where / who / CTA to /#/app.
- Technology: 30s cycle, three agent levels, T-GNN, six junctions with lat/lon.
- Results: paper numbers and harness table both labelled; never imply 352% and
  10.2% are the same experiment.
- IP: application number, applicant Yushu Excellence Technologies, inventor
  Amit Dua, BITS Pilani, FER response submitted, licensing goes through campus.
- Partnership: three buyer types, mailto amit.dua@pilani.bits-pilani.ac.in.
- Mobile: nav wraps, grids collapse, command-centre CTA still visible.
- Accessibility: real buttons/links, contrast on navy and ops dark theme,
  images have alt text, form inputs have names.
- Meta: title, description, OG fields for industry sharing on mail/LinkedIn.

Verify by reading the rendered copy, not by restating the React source.
Commit and push.
```

### Phase C — Command centre excellence

```
Harden the /#/app command centre so a traffic engineer can interrogate it.

Requirements:
1. Default run is live (4×). Pause, Run, Reset work.
2. Scenario switch changes demand, alerts, and strategist text within one cycle.
3. Incident flags Silk Board and mentions spillback/divert.
4. VIP forces eastbound language in strategy and alerts.
5. Rain reduces saturation; monsoon alert is visible.
6. Fusion weights for each junction sum to 1 ± 0.001.
7. T-GNN always has m5, m15, m30 in (6, 50) km/h.
8. Twin A/B updates both SYMPHONY and fixed-time; delay/speed deltas are finite.
9. Agent feed contains strategist, coordinator, and junction events over 90s sim.
10. Map loads; if Leaflet fails, show a readable fallback, never a white hole.

Walk every pane. Fix anything a partner would call “broken” or “fake”.
Commit and push.
```

### Phase D — Engine tests (every portion)

```
Add or extend Vitest tests in src/engine/*.test.ts until these cases are
automated. Use invariants, not brittle pixel snapshots.

Initial state
- 6 junctions, 6 baseline twins, 36 vehicles
- scenario morning_rush, running true, cycle 30s, cycleNumber 1
- Silk Board … Marathahalli order and coordinates match data.ts

Tick physics
- tick is a no-op when running is false
- 1s tick advances simTime by 1, cycleSecond = simTime % 30
- after 30 ticks cycleNumber increments
- queues in [0, 48], speeds in [5, 55], congestion in [4, 98]
- googleWeight + tomtomWeight ≈ 1
- vehicles remain in progress (0.01, 0.99)

All scenarios (parametrised)
For each of morning_rush, evening_rush, midday, incident, vip, rain, weekend:
- 45 ticks do not throw
- 6 junctions remain
- fusedSpeed is finite
- predicted.m5 >= predicted.m30 is NOT required (do not invent that)
- incident: silk_board.incident === true; others false
- vip: strategy or alerts mention VIP / eastbound
- rain: alerts mention monsoon or rain

Controllers
- baseline lastReason mentions fixed-time at start
- after 50 ticks, some junction has switched or extended (SYMPHONY)
- after 50 ticks, baseline has used yellow or switch to
- resetState returns simTime 0 and empty history
- setScenario pushes a strategist event with the scenario name

KPIs
- delaySeconds increases while queues exist
- vehicles (discharged) is non-decreasing
- history length capped at 90
- events length capped at 80

Helpers
- currentStage covers 0,5,8,12,25,28,29
- congestionColor distinct for 20 / 40 / 60 / 80
- formatSimTime(75) === "01:15"
- pctDelta(110, 100) === 10

Run npm test. Do not push if it fails. Then commit and push.
```

### Phase E — UI tests (every route and pane)

```
Add Vitest + Testing Library coverage for the website and command centre.

Website
- Home shows SYMPHONY, patent number, Launch command centre
- Technology shows operational cycle and Silk Board
- Results shows FixedTime and SYMPHONY rows
- IP shows 202611024014 and Yushu
- Partnership form has name, org, mailto intent
- Unknown hash route redirects home

Command centre
- Mock MapView
- Renders Overview KPIs and six junction names
- Each tab button exists: Overview, Network map, Agents, T-GNN, Fusion,
  Twin A/B, Evaluation
- Clicking each tab reveals pane-specific text (strategy / forecast /
  Google / Fixed-time / quick-test)
- Scenario <select> lists all seven scenarios
- Pause toggles the live indicator / button label
- Reset restores a strategist stand-up event

Run npm test && npm run build. Commit and push.
```

### Phase F — Visual / partner walkthrough (manual, still mandatory)

```
You cannot skip this even if unit tests pass. Use the live preview.

Desktop 1280×800 and mobile 390×844:

Website: home → technology → results → ip → partnership → back to app.
App: let morning peak run 20s wall clock.
Then scenario Lane closure. Confirm Silk Board alert.
Then VIP movement. Confirm eastbound protocol.
Then Monsoon. Confirm saturation language.
Open every pane. Confirm charts are not empty after ~15s.
Click Website. Confirm you can return to /#/app.

Record failures as GitHub issues or FIXMEs in the commit, then fix them
before calling the demo shareable.
```

### Phase G — GitHub cadence

```
Keep origin/main always in a shareable state.

Cadence:
- After every completed phase: commit, push.
- Never batch an untested UI change with a deploy config change.
- Tag industry-ready builds: v1.0.0-industry, then v1.0.1, …
- README live URL must match the Pages URL after the first successful deploy.

If gh is authenticated as amitduabits, use that account.
Repo should be public for industry. Description must mention BITS Pilani
and “industry demonstration”.
```

### Phase H — Create the public site from GitHub

```
Publish the industry demo from GitHub Pages so a partner only needs a URL.

1. Repo: amitduabits/symphony-digital-twin (public).
2. vite base is /symphony-digital-twin/ in CI and '/' locally.
3. HashRouter stays (refresh-safe on Pages).
4. Preferred: GitHub Actions from `docs/github-pages-workflow.yml` (needs `workflow` OAuth scope).
   Until that scope exists, publish the `dist/` folder to the `gh-pages` branch:

   ```
   $env:BASE_PATH="/symphony-digital-twin/"
   npm test
   npm run build
   # push dist as branch gh-pages
   ```

5. Pages source: branch `gh-pages`, folder `/`.
6. After deploy, curl the URL and open `/#/app`.
7. Put the live URL at the top of README.

Live URL:
https://amitduabits.github.io/symphony-digital-twin/

Do not use Streamlit Cloud for the industry briefing. This app is the briefing.
```

### Phase I — Partner pack (optional, after URL is live)

```
Add docs/PARTNER-WALKTHROUGH.md: 8-minute script.

Minute 0–1: home, patent number, “not a live BTP system”.
Minute 1–2: technology, 30s cycle.
Minute 2–3: results, how to read the table.
Minute 3–7: command centre, morning peak → incident → VIP.
Minute 7–8: partnership form, campus contact.

Keep it to one page. No claim charts.
Commit, push, confirm Pages rebuild.
```

---

## 4. Automated test matrix

| ID | Portion | Case | Automated by |
|---|---|---|---|
| E01 | Engine | Initial six-junction corridor | `engine/simulator.test.ts` |
| E02 | Engine | Pause does not advance time | same |
| E03 | Engine | 30-second cycle wrap | same |
| E04 | Engine | Queue/speed/congestion bounds | same |
| E05 | Engine | Fusion weights sum to 1 | same |
| E06 | Engine | Vehicles stay on corridor | same |
| E07–E13 | Engine | All 7 scenarios × 45 ticks | same (each) |
| E14 | Engine | Incident only at Silk Board | same |
| E15 | Engine | VIP language | same |
| E16 | Engine | Rain/monsoon language | same |
| E17 | Engine | Reset clears clocks | same |
| E18 | Engine | Scenario change logs strategist | same |
| E19 | Engine | KPI monotonicity | same |
| E20 | Engine | Event/history caps | same |
| E21 | Engine | Stage helper + colours + time fmt | same |
| D01 | Data | Junction coordinates / order | `engine/data.test.ts` |
| D02 | Data | Evaluation table identities | same |
| D03 | Data | Patent number and contact | same |
| U01–U06 | Website | Each public route | `pages/*.test.tsx` |
| U07 | Website | Unknown route → home | `App.test.tsx` |
| U08–U14 | App | Each command-centre pane | `pages/CommandCenter.test.tsx` |
| U15 | App | Scenario select options | same |
| U16 | App | Pause / reset | same |
| B01 | Build | `tsc --noEmit && vite build` | `npm run build` |
| C01 | CI | test + build on pull_request and main | `.github/workflows/pages.yml` |
| P01 | Pages | Live URL 200 after push | deploy job + manual curl |

Manual (Phase F) is still required for map tiles, chart paint, and mobile layout.

---

## 5. Commands

```bash
cd 09_Industry_Demo/symphony-industry

npm install
npm test              # Vitest, every automated case
npm run test:watch
npm run build         # typecheck + production bundle
npm run dev           # http://localhost:5188/  and  /#/app
npm run preview       # production preview
```

GitHub:

```bash
git add -A
git commit -m "phase: message"
git push origin main
```

After Pages is on:

```bash
curl -I https://amitduabits.github.io/symphony-digital-twin/
```

---

## 6. Sharing with industry

Send three things, not a zip of the research tree:

1. **Live site** — `https://amitduabits.github.io/symphony-digital-twin/`
2. **Command centre** — `https://amitduabits.github.io/symphony-digital-twin/#/app`
3. **This promptbook + README** — so a technical counterpart can reproduce

Spoken caveat, every time:

> This is a working digital twin of the filed architecture, running in the browser for demonstration. It is not connected to Bengaluru Traffic Police signals. A pilot would ingest live Google/TomTom (or ITMS) feeds and sit above existing controllers.

---

## 7. Definition of done (industry-ready)

- [ ] `npm test` green
- [ ] `npm run build` green
- [ ] CI green on `main`
- [ ] Public repo `amitduabits/symphony-digital-twin`
- [ ] GitHub Pages URL opens the website
- [ ] `/#/app` runs without keys
- [ ] All seven scenarios exercised in tests
- [ ] All six website routes exercised in tests
- [ ] All seven command-centre panes exercised in tests
- [ ] Patent page present; claim-set files absent
- [ ] README live URL is correct
- [ ] Partner can complete the 8-minute walkthrough without a developer in the room

When every box is ticked, stop polishing and send the URL.
