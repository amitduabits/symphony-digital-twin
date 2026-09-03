import { describe, expect, it } from "vitest";
import { fuseReadings, pushWindow, LIVE_WINDOW } from "./fusion";
import type { SpeedReading } from "./types";

function r(source: string, speed: number): SpeedReading {
  return {
    junctionId: "j1",
    speedKmh: speed,
    congestion01: 0.4,
    observedAtIso: new Date().toISOString(),
    source,
    freshnessS: 2,
  };
}

describe("live fusion", () => {
  it("fuses two nearby speeds into the interval", () => {
    const [p] = fuseReadings([r("google", 25), r("tomtom", 22)]);
    expect(p.speedKmh).toBeGreaterThan(22);
    expect(p.speedKmh).toBeLessThan(25);
    expect(p.googleWeight + p.tomtomWeight).toBeCloseTo(1, 2);
  });

  it("down-weights a 40 km/h outlier against two ~23 readings", () => {
    const [p] = fuseReadings([r("google", 23), r("tomtom", 22), r("tfl", 40)]);
    expect(p.anomaly).toBe(true);
    expect(p.speedKmh).toBeLessThan(28);
  });

  it("caps the rolling window at 8", () => {
    let w: number[] = [];
    for (let i = 0; i < 20; i++) w = pushWindow(w, i);
    expect(w.length).toBe(LIVE_WINDOW);
    expect(w[0]).toBe(12);
  });
});
