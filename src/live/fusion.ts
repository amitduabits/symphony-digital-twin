import type { SpeedReading } from "./types";

const WINDOW = 8;

export interface FusedPoint {
  junctionId: string;
  speedKmh: number;
  congestion01: number;
  google?: number;
  tomtom?: number;
  tfl?: number;
  nyc511?: number;
  hkgov?: number;
  googleWeight: number;
  tomtomWeight: number;
  freshness: number;
  accuracy: number;
  consistency: number;
  anomaly: boolean;
  observedAtIso: string;
}

export function fuseReadings(readings: SpeedReading[]): FusedPoint[] {
  const byJ = new Map<string, SpeedReading[]>();
  for (const r of readings) {
    const list = byJ.get(r.junctionId) ?? [];
    list.push(r);
    byJ.set(r.junctionId, list);
  }
  const out: FusedPoint[] = [];
  for (const [junctionId, list] of byJ) {
    const speeds = list.map((r) => r.speedKmh);
    const median = [...speeds].sort((a, b) => a - b)[Math.floor(speeds.length / 2)] ?? 0;
    let num = 0;
    let den = 0;
    let anomaly = false;
    const weights: Record<string, number> = {};
    for (const r of list) {
      const freshness = Math.exp(-0.02 * r.freshnessS);
      const accuracy = 0.85;
      const consistency = 1 - Math.min(1, Math.abs(r.speedKmh - median) / 20);
      let w = 0.5 * freshness + 0.3 * accuracy + 0.2 * consistency;
      if (Math.abs(r.speedKmh - median) > 15 && list.length > 1) {
        anomaly = true;
        w *= 0.1;
      }
      weights[r.source] = w;
      num += w * r.speedKmh;
      den += w;
    }
    const speed = den > 0 ? num / den : median;
    const cong = Math.max(0, Math.min(1, 1 - speed / 48));
    out.push({
      junctionId,
      speedKmh: speed,
      congestion01: cong,
      google: list.find((r) => r.source === "google")?.speedKmh,
      tomtom: list.find((r) => r.source === "tomtom")?.speedKmh,
      tfl: list.find((r) => r.source === "tfl")?.speedKmh,
      nyc511: list.find((r) => r.source === "nyc511")?.speedKmh,
      hkgov: list.find((r) => r.source === "hkgov")?.speedKmh,
      googleWeight: (weights.google ?? 0) / (den || 1),
      tomtomWeight: (weights.tomtom ?? 0) / (den || 1),
      freshness: list.reduce((s, r) => s + Math.exp(-0.02 * r.freshnessS), 0) / list.length,
      accuracy: 0.85,
      consistency: 1 - Math.min(1, (Math.max(...speeds) - Math.min(...speeds)) / 20),
      anomaly,
      observedAtIso: list[0]?.observedAtIso ?? new Date().toISOString(),
    });
  }
  return out;
}

export function pushWindow<T>(window: T[], item: T): T[] {
  const next = [...window, item];
  while (next.length > WINDOW) next.shift();
  return next;
}

export const LIVE_WINDOW = WINDOW;
