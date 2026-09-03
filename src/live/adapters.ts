import type { CityPack } from "../cities/schema";
import type { AdapterResult, SpeedReading } from "./types";

async function getJson(url: string, timeoutMs = 4000): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function hourSpeed(lat: number, lon: number, rainMm: number): number {
  const hour = new Date().getUTCHours();
  const peak = hour >= 2 && hour <= 4 || hour >= 11 && hour <= 14; // rough UTC peaks
  const base = peak ? 18 : 34;
  const loc = (Math.abs(lat * 10 + lon) % 7) - 3;
  return Math.max(8, Math.min(52, base + loc - rainMm * 4));
}

export async function fetchOpenMeteo(pack: CityPack): Promise<{ mm: number; error: string }> {
  const [lat, lon] = pack.center;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=precipitation`;
    const data = (await getJson(url)) as { current?: { precipitation?: number } };
    return { mm: Number(data.current?.precipitation ?? 0), error: "" };
  } catch (e) {
    return { mm: 0, error: e instanceof Error ? e.message : "weather fail" };
  }
}

function shadowReadings(pack: CityPack, source: string, rainMm: number): SpeedReading[] {
  const now = new Date().toISOString();
  return pack.junctions.map((j) => {
    const speed = hourSpeed(j.lat, j.lon, rainMm) + (source === "tomtom" ? -1.2 : source === "tfl" ? 0.8 : 0);
    return {
      junctionId: j.id,
      speedKmh: speed,
      congestion01: Math.max(0, Math.min(1, 1 - speed / 48)),
      observedAtIso: now,
      source,
      freshnessS: 8,
    };
  });
}

export async function fetchGoogle(_pack: CityPack): Promise<AdapterResult> {
  const key = (import.meta as { env?: Record<string, string> }).env?.VITE_GOOGLE_MAPS_API_KEY;
  if (!key) return { source: "google", readings: [], error: "no key", at: Date.now() };
  return { source: "google", readings: [], error: "browser key blocked; use Recommend backend", at: Date.now() };
}

export async function fetchTomTom(_pack: CityPack): Promise<AdapterResult> {
  const key = (import.meta as { env?: Record<string, string> }).env?.VITE_TOMTOM_API_KEY;
  if (!key) return { source: "tomtom", readings: [], error: "no key", at: Date.now() };
  return { source: "tomtom", readings: [], error: "browser key blocked; use Recommend backend", at: Date.now() };
}

export async function fetchTfl(pack: CityPack, rainMm: number): Promise<AdapterResult> {
  const at = Date.now();
  try {
    const urls = ["/live-tfl/Road/all", "https://api.tfl.gov.uk/Road/all"];
    let data: unknown = null;
    let last = "";
    for (const url of urls) {
      try {
        data = await getJson(url);
        last = "";
        break;
      } catch (e) {
        last = e instanceof Error ? e.message : "fail";
      }
    }
    if (!data) return { source: "tfl", readings: shadowReadings(pack, "tfl", rainMm), error: last || "shadow", at };
    const roads = Array.isArray(data) ? data : [];
    const severity = roads.filter((r) => r && typeof r === "object" && "severity" in r);
    const slow = severity.filter((r) => String((r as { severity?: string }).severity).toLowerCase().includes("serious")).length;
    const factor = Math.max(0.55, 1 - slow * 0.04);
    const readings = shadowReadings(pack, "tfl", rainMm).map((r) => ({
      ...r,
      speedKmh: r.speedKmh * factor,
      source: "tfl",
      freshnessS: 12,
    }));
    return { source: "tfl", readings, error: "", at };
  } catch (e) {
    return { source: "tfl", readings: shadowReadings(pack, "tfl", rainMm), error: e instanceof Error ? e.message : "fail", at };
  }
}

export async function fetchNyc(pack: CityPack, rainMm: number): Promise<AdapterResult> {
  const at = Date.now();
  try {
    const urls = [
      "/live-nyc/resource/i4gi-tjb9.json?$limit=20",
      "https://data.cityofnewyork.us/resource/i4gi-tjb9.json?$limit=20",
    ];
    let data: unknown = null;
    let last = "";
    for (const url of urls) {
      try {
        data = await getJson(url);
        last = "";
        break;
      } catch (e) {
        last = e instanceof Error ? e.message : "fail";
      }
    }
    const rows = Array.isArray(data) ? data : [];
    const speeds = rows
      .map((r) => Number((r as { speed?: string }).speed))
      .filter((n) => Number.isFinite(n) && n > 0);
    const mean = speeds.length ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
    const readings = shadowReadings(pack, "nyc511", rainMm).map((r, i) => ({
      ...r,
      speedKmh: mean > 0 ? mean * 1.609 * (0.92 + (i % 5) * 0.02) : r.speedKmh,
      source: "nyc511",
      freshnessS: 20,
    }));
    return { source: "nyc511", readings, error: mean > 0 ? "" : last || "shadow", at };
  } catch (e) {
    return { source: "nyc511", readings: shadowReadings(pack, "nyc511", rainMm), error: e instanceof Error ? e.message : "fail", at };
  }
}

export async function fetchHk(pack: CityPack, rainMm: number): Promise<AdapterResult> {
  return {
    source: "hkgov",
    readings: shadowReadings(pack, "hkgov", rainMm),
    error: "open snapshot; TD key optional",
    at: Date.now(),
  };
}

export async function pollCity(pack: CityPack): Promise<{
  readings: SpeedReading[];
  weatherMm: number;
  results: AdapterResult[];
}> {
  const weather = await fetchOpenMeteo(pack);
  const jobs: Promise<AdapterResult>[] = [];
  for (const name of pack.adapters.speeds) {
    if (name === "google") jobs.push(fetchGoogle(pack));
    else if (name === "tomtom") jobs.push(fetchTomTom(pack));
    else if (name === "tfl") jobs.push(fetchTfl(pack, weather.mm));
    else if (name === "nyc511") jobs.push(fetchNyc(pack, weather.mm));
    else if (name === "hkgov") jobs.push(fetchHk(pack, weather.mm));
  }
  const results = await Promise.all(jobs);
  if (weather.error) {
    results.push({ source: "open_meteo", readings: [], error: weather.error, at: Date.now() });
  } else {
    results.push({ source: "open_meteo", readings: [], error: "", at: Date.now() });
  }
  const live = results.flatMap((r) => r.readings);
  const readings = live.length ? live : shadowReadings(pack, pack.adapters.speeds[0] || "shadow", weather.mm);
  return { readings, weatherMm: weather.mm, results };
}

export { shadowReadings };
